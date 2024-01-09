import { DateTime } from 'luxon';
import { constructDateTime } from 'utils/datetime';

export const extractAssignments = (html: Document) => {
    const assignments: {
        exerciseId: string;
        link: string;
        title: string;
        description: string;
        class: string;
        date: DateTime;
        status: 'Afleveret' | 'Mangler' | 'Venter';
    }[] = [];
    const table = html.querySelector('table#s_m_Content_Content_ExerciseGV');
    if (table) {
        const rows = table.querySelectorAll('tr');
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.querySelectorAll('td');
            const link = cells[2].querySelector('a')?.getAttribute('href') || '';
            const assignment = {
                exerciseId: link.match(/(?:exerciseid)=([0-9]+)/)?.[1] || '',
                link,
                title: cells[2].querySelector('a')?.textContent || '',
                description: cells[8].textContent || '',
                class: cells[1].textContent || '',
                date: constructDateTime(cells[3].textContent || ''),
                status: cells[5].textContent as 'Afleveret' | 'Mangler' | 'Venter',
            };
            assignments.push(assignment);
        }
    }

    assignments.sort((a, b) => {
        const aDate = Math.abs(+a.date - +DateTime.local());
        const bDate = Math.abs(+b.date - +DateTime.local());
        return aDate - bDate;
    });
    return {
        Kommende: assignments.filter((assignment) => assignment.status === 'Venter'),
        Færdige: assignments.filter((assignment) => assignment.status === 'Afleveret'),
        Manglende: assignments.filter((assignment) => assignment.status === 'Mangler'),
    };
};

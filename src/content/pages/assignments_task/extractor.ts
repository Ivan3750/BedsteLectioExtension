import { DateTime } from 'luxon';
import { af } from 'utils/array';

export interface AssignmentDetails {
    title: string;
    descriptionFiles: { name: string; link: string }[];
    note: string;
    className: string;
    gradeScale: string;
    teacher: string;
    studentTime: string;
    deadline: DateTime | null;
    groupMembers: string[];
    submissions: {
        time: DateTime;
        user: string;
        comment: string;
        file?: { name: string; link: string };
    }[];
}

export const extractAssignment = (html: Document): AssignmentDetails => {
    const container = html.querySelector('div.lectioTabContent');
    if (!container) {
        throw new Error('No assignment content found');
    }

    const title = container.querySelector('#m_Content_NameLbl')?.textContent?.trim() ?? '';

    const descriptionFiles = af(container.querySelectorAll('#m_Content_registerAfl_pa a')).map((a) => ({
        name: a.textContent?.trim() ?? '',
        link: (a as HTMLAnchorElement).href,
    }));

    const note = container.querySelector('#m_Content_registerAfl_pa tr:nth-child(3) td')?.textContent?.trim() ?? '';

    const className =
        container.querySelector('#m_Content_registerAfl_pa tr:nth-child(4) td')?.textContent?.trim() ?? '';

    const gradeScale = container.querySelector('#m_Content_gradeScaleIdLbl')?.textContent?.trim() ?? '';

    const teacher = container.querySelector('#m_Content_registerAfl_pa tr:nth-child(6) td')?.textContent?.trim() ?? '';

    const studentTime = container.querySelector('#m_Content_WeightLbl')?.textContent?.trim() ?? '';

    const deadlineRaw =
        container.querySelector('#m_Content_registerAfl_pa tr:nth-child(8) td')?.textContent?.trim() ?? '';
    const deadline = deadlineRaw ? DateTime.fromFormat(deadlineRaw, 'd/M-yyyy HH:mm') : null;

    const groupMembers = af(container.querySelectorAll('#m_Content_groupMembersGV td span')).map(
        (el) => el.textContent?.trim() ?? '',
    );

    const submissions = af(container.querySelectorAll('#m_Content_RecipientGV tr'))
        .slice(1)
        .map((row) => {
            const cells = af(row.querySelectorAll('td'));
            const timeRaw = cells[0]?.textContent?.trim() ?? '';
            const time = timeRaw ? DateTime.fromFormat(timeRaw, 'd/M-yyyy HH:mm') : DateTime.invalid('Invalid');
            const user = cells[1]?.textContent?.trim() ?? '';
            const comment = cells[2]?.textContent?.trim() ?? '';
            const fileLink = cells[3]?.querySelector('a');
            const file = fileLink
                ? {
                      name: fileLink.textContent?.trim() ?? '',
                      link: (fileLink as HTMLAnchorElement).href,
                  }
                : undefined;

            return { time, user, comment, file };
        });

    return {
        title,
        descriptionFiles,
        note,
        className,
        gradeScale,
        teacher,
        studentTime,
        deadline,
        groupMembers,
        submissions,
    };
};

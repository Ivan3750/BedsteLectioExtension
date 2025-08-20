import { af } from 'utils/array';

export const extractAbsence = (html: Document) => {
    const rows = af(html.querySelectorAll('table#s_m_Content_Content_SFTabStudentAbsenceDataTable > tbody > tr')).slice(
        3,
    ); // пропускаємо 3 рядки з заголовками

    const absences: {
        subject: string;
        link: string;
        normal: { percent: string; modules: string };
        yearly: { percent: string; modules: string };
        written: { percent: string; time: string };
        yearlyWritten: { percent: string; time: string };
    }[] = [];

    for (const row of rows) {
        const cells = af(row.querySelectorAll('td,th'));
        if (!cells.length) continue;

        // перша клітинка завжди назва предмету / "Samlet"
        const anchor = cells[0].querySelector<HTMLAnchorElement>('a');
        const subject = anchor?.textContent?.trim() ?? cells[0].textContent?.trim() ?? '';
        const link = anchor?.href ?? '';

        // останній рядок "Samlet" теж хочемо залишити
        absences.push({
            subject,
            link,
            normal: {
                percent: cells[1]?.textContent?.trim() ?? '',
                modules: cells[2]?.textContent?.trim() ?? '',
            },
            yearly: {
                percent: cells[3]?.textContent?.trim() ?? '',
                modules: cells[4]?.textContent?.trim() ?? '',
            },
            written: {
                percent: cells[5]?.textContent?.trim() ?? '',
                time: cells[6]?.textContent?.trim() ?? '',
            },
            yearlyWritten: {
                percent: cells[7]?.textContent?.trim() ?? '',
                time: cells[8]?.textContent?.trim() ?? '',
            },
        });
    }

    return absences;
};

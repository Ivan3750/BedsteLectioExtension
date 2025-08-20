import { af } from 'utils/array';

export const extractAbsence = (html: Document) => {
    // --- Samlet fravær ---
    const normal =
        html.querySelector<HTMLSpanElement>('#s_m_Content_Content_FremmoedeFravaer')?.textContent?.trim() ?? '';
    const written =
        html.querySelector<HTMLSpanElement>('#s_m_Content_Content_SkriftligFravaer')?.textContent?.trim() ?? '';

    // --- Manglende fraværsårsager ---
    const missingTable = html.querySelector<HTMLTableElement>('#s_m_Content_Content_FatabMissingAarsagerGV');
    const missing: string[] = [];
    if (missingTable) {
        const rows = af(missingTable.querySelectorAll('tbody > tr'));
        for (const row of rows) {
            const cellText = row.textContent?.trim() ?? '';
            if (cellText && !cellText.includes('Ingen')) {
                missing.push(cellText);
            }
        }
    }

    // --- Fraværsregistreringer ---
    const regTable = html.querySelector<HTMLTableElement>('#s_m_Content_Content_FatabAbsenceFravaerGV');
    const registrations: string[] = [];
    if (regTable) {
        const rows = af(regTable.querySelectorAll('tbody > tr'));
        for (const row of rows) {
            const cellText = row.textContent?.trim() ?? '';
            if (cellText && !cellText.includes('Listen er tom')) {
                registrations.push(cellText);
            }
        }
    }

    return {
        summary: {
            normal,
            written,
        },
        missing,
        registrations,
    };
};

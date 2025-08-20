import { af } from 'utils/array';
import { toTitleCase } from 'utils/string';

export type extractedDocument = {
    link: string;
    title: string;
    uploadedBy: string;
    uploadedAt: string;
};

export const extractDocuments = (html: Document): extractedDocument[] => {
    const rows = af(html.querySelectorAll('table#s_m_Content_Content_MaterialFolderGV > tbody > tr')).slice(1); // пропускаємо заголовки

    const documents: extractedDocument[] = [];

    for (const row of rows) {
        const cells = af(row.querySelectorAll('td'));
        if (cells.length < 5) continue;

        const anchor = cells[2].querySelector<HTMLAnchorElement>('a.s2skemabrik');
        if (!anchor) continue;

        const title = anchor.textContent?.trim() ?? '';
        const link = anchor.href;

        const uploadedBy = cells[3].textContent?.trim() ?? '';
        const uploadedAt = cells[4].textContent?.trim() ?? '';

        documents.push({
            link,
            title: toTitleCase(title),
            uploadedBy,
            uploadedAt,
        });
    }

    return documents;
};

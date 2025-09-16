import { af } from 'utils/array';
import { DateTime } from 'luxon';

export type Message = {
    link: string;
    subject: string;
    from: string;
    to: string;
    time: string;
    flagged: boolean;
    unread: boolean;
};

export const extractMessages = (html: Document): Message[] => {
    const rows = af(html.querySelectorAll('table#s_m_Content_Content_threadGV_ctl00 > tbody > tr')).slice(1);

    const messages: Message[] = [];
    const schoolId = getSchoolIdFromDocument(html);

    for (const row of rows) {
        const cells = af(row.querySelectorAll('td'));
        if (cells.length < 8) continue;

        const flagImg = cells[1].querySelector<HTMLImageElement>('img');
        const flagged = flagImg?.src.includes('flagon.gif') ?? false;

        const readImg = cells[2].querySelector<HTMLImageElement>('img');
        const unread = readImg?.src.includes('munread.gif') ?? false;

        const anchor = cells[3].querySelector<HTMLAnchorElement>('a');
        const subject = anchor?.innerText.trim() ?? '';

        // 🟢 Будуємо правильний URL
        let link = '';
        if (anchor) {
            const onclick = anchor.getAttribute('onclick') ?? '';
            const id = extractMessageId(onclick);
            if (id) {
                link = `/lectio/${schoolId}/beskeder2.aspx?type=visbesked&id=${id}`;
            }
        }

        const from = cells[4].innerText.trim();
        const to = cells[6].innerText.trim();
        const time = cells[7].innerText.trim();

        messages.push({
            link,
            subject,
            from,
            to,
            time,
            flagged,
            unread,
        });
    }

    return messages;
};

// 🔍 Витягуємо id з onclick
function extractMessageId(onClickRaw: string): string | null {
    const m1 = onClickRaw.match(/\$_MC_\$_(\d+)/);
    if (m1) return m1[1];
    const m2 = onClickRaw.match(/VIEWTHREAD_(\d+)/);
    if (m2) return m2[1];
    return null;
}

function getSchoolIdFromDocument(doc: Document): string {
    try {
        const u = new URL(doc.baseURI || (doc as any).URL || window.location.href);
        const parts = u.pathname.split('/').filter(Boolean);
        const i = parts.findIndex((p) => p.toLowerCase() === 'lectio');
        if (i !== -1 && parts[i + 1]) return parts[i + 1];
    } catch {}
    return '';
}

export function parseMessageTime(time?: string): Date {
    if (!time) return DateTime.local().toJSDate();
    const parts = time.split(':');
    if (parts.length !== 2) return DateTime.local().toJSDate();
    const [h, m] = parts.map((n) => Number(n));
    if (isNaN(h) || isNaN(m)) return DateTime.local().toJSDate();
    return DateTime.local().set({ hour: h, minute: m }).toJSDate();
}

import { af } from 'utils/array';

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
    const rows = af(html.querySelectorAll('table#s_m_Content_Content_threadGV_ctl00 > tbody > tr')).slice(1); // пропускаємо заголовок таблиці

    const messages: Message[] = [];

    for (const row of rows) {
        const cells = af(row.querySelectorAll('td'));
        if (cells.length < 8) continue;

        // флаг (flagged чи ні)
        const flagImg = cells[1].querySelector<HTMLImageElement>('img');
        const flagged = flagImg?.src.includes('flagon.gif') ?? false;

        // прочитане / непрочитане
        const readImg = cells[2].querySelector<HTMLImageElement>('img');
        const unread = readImg?.src.includes('munread.gif') ?? false;

        // посилання на повідомлення
        const anchor = cells[3].querySelector<HTMLAnchorElement>('a');
        const subject = anchor?.innerText.trim() ?? '';
        const link = anchor?.getAttribute('onclick') ?? '';

        // останній відправник
        const from = cells[4].innerText.trim();

        // перший відправник (створив тред)
        // можна використати cells[5], але не завжди потрібно
        // const firstFrom = cells[5].innerText.trim();

        // отримувачі
        const to = cells[6].innerText.trim();

        // час
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

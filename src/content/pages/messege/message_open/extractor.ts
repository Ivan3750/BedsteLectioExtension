import { af } from 'utils/array';

export type ThreadMessage = {
    from: string;
    time: string;
    subject: string;
    content: string;
};

export const extractThreadMessages = (html: Document): ThreadMessage[] => {
    const rows = af(html.querySelectorAll('div.message-thread-messages-container table tr'));

    const messages: ThreadMessage[] = [];

    for (const row of rows) {
        const senderEl = row.querySelector<HTMLElement>('.message-thread-message-sender');
        const contentEl = row.querySelector<HTMLElement>('.message-thread-message-content');
        const subjectEl = row.querySelector<HTMLElement>('.message-thread-message-header');

        if (!senderEl || !contentEl) continue;

        // ✉️ Витягуємо "від кого" і час
        const senderText = senderEl.innerText.trim();
        let from = senderText;
        let time = '';
        const timeMatch = senderText.match(/, (.+)$/);
        if (timeMatch) {
            time = timeMatch[1];
            from = senderText.replace(/, .+$/, '');
        }

        // 📝 Тема (якщо є)
        const subject = subjectEl?.innerText.trim() ?? '';

        // 📄 Текст повідомлення
        const content = contentEl.innerText.trim();

        messages.push({
            from,
            time,
            subject,
            content,
        });
    }

    return messages;
};

import { DateTime } from 'luxon';

export type Task = {
    title: string;
    description?: string;
    note?: string;
    link?: string;
    files: { name: string; url: string }[];
    externalLinks: { name: string; url: string }[];
    interval?: { start?: DateTime; end?: DateTime };
    type: 'homework' | 'note'; // 👈 тепер маємо 2 типи
};

export function extractTask(document: Document): Task[] {
    const tasks: Task[] = [];

    // === Нотатки / опис (textarea) ===
    const noteTextarea = document.querySelector<HTMLTextAreaElement>('#s_m_Content_Content_tocAndToolbar_ActNoteTB_tb');
    if (noteTextarea && noteTextarea.value.trim()) {
        tasks.push({
            title: 'Beskrivelse / Noter',
            description: noteTextarea.value.trim().replace(/\n/g, '<br/>'),
            files: [],
            externalLinks: [],
            type: 'note',
        });
    }

    // === Домашка (artikler) ===
    const articles = document.querySelectorAll<HTMLElement>(
        '#s_m_Content_Content_tocAndToolbar_inlineHomeworkDiv article',
    );

    articles.forEach((article) => {
        const titleEl = article.querySelector('h1, h2');
        if (!titleEl) return;

        const task: Task = {
            title: titleEl.textContent?.trim() ?? 'Ukendt opgave',
            description: '',
            files: [],
            externalLinks: [],
            type: 'homework',
        };

        // Note/description
        const blockquote = article.querySelector('blockquote');
        if (blockquote) {
            task.description = blockquote.innerHTML.trim();
        }

        // Посилання у заголовку
        const link = titleEl.querySelector('a');
        if (link) {
            const url = link.getAttribute('href') ?? '';
            if (url.includes('/res/')) {
                task.files.push({
                    name: link.textContent?.trim() ?? 'Fil',
                    url,
                });
            } else {
                task.externalLinks.push({
                    name: link.textContent?.trim() ?? 'Link',
                    url,
                });
            }
        }

        tasks.push(task);
    });

    return tasks;
}

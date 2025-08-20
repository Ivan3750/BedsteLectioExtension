import { Interval } from 'luxon';
import { extractLesson } from '../../calendar/extractor';
import { constructInterval } from 'utils/datetime';

export interface Task {
    link: string;
    title: string;
    note: string;
    description: string; // HTML контент з посиланнями
    files: { name: string; url: string }[];
    externalLinks: { name: string; url: string }[];
    interval: Interval | null;
}

export const extractTask = (html: Document): Task | null => {
    // --- Заголовок активності (сам урок) ---
    const anchor = html.querySelector<HTMLAnchorElement>('.ls-section-title-heading a.s2skemabrik');
    if (!anchor) return null;

    const lesson = extractLesson(anchor);
    const title = lesson.navn || lesson.hold || '';

    // --- Note (textarea) ---
    const note =
        html.querySelector<HTMLTextAreaElement>('#s_m_Content_Content_tocAndToolbar_ActNoteTB_tb')?.value.trim() ?? '';

    // --- Homework секція ---
    const homeworkArticle = html.querySelector<HTMLElement>(
        '#s_m_Content_Content_tocAndToolbar_inlineHomeworkDiv article',
    );

    let description = '';
    const files: { name: string; url: string }[] = [];
    const externalLinks: { name: string; url: string }[] = [];

    if (homeworkArticle) {
        // Прибираємо зайві картинки "doc-homework.auto"
        homeworkArticle.querySelectorAll('img').forEach((img) => {
            if (img.src.includes('/lectio/img/doc-homework.auto')) img.remove();
        });

        // Збираємо файли
        homeworkArticle.querySelectorAll<HTMLAnchorElement>('a[data-lc-display-linktype="file"]').forEach((a) => {
            files.push({ name: a.textContent?.trim() || 'file', url: a.href });
        });

        // Збираємо зовнішні посилання
        homeworkArticle.querySelectorAll<HTMLAnchorElement>('a[data-lc-display-linktype="external"]').forEach((a) => {
            externalLinks.push({ name: a.textContent?.trim() || 'link', url: a.href });
        });

        // HTML контент
        description = homeworkArticle.innerHTML.trim();
    }

    const interval = lesson.tidspunkt ? constructInterval(lesson.tidspunkt) : null;

    return {
        link: anchor.href,
        title,
        note,
        description,
        files,
        externalLinks,
        interval,
    };
};

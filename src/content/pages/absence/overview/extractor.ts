import { extractLesson } from 'content/pages/calendar/extractor';
import { DateTime, Interval } from 'luxon';
import { af } from 'utils/array';
import { constructInterval } from 'utils/datetime';
import { toTitleCase } from 'utils/string';

export const extractAbsence = (html: Document) => {
    const homeworkRows = af(
        html.querySelectorAll('table#s_m_Content_Content_MaterialLektieOverblikGV > tbody > tr'),
    ).slice(1);

    const homework: { link: string; title: string; description: string; interval: Interval }[] = [];
    for (const row of homeworkRows) {
        const cells = af(row.querySelectorAll('td'));
        const anchor = cells[1].querySelector<HTMLAnchorElement>('a.s2skemabrik');
        if (!anchor) {
            continue;
        }
        const lesson = extractLesson(anchor);
        const title = lesson.navn || lesson.hold;

        const content = cells[2];
        // Remove leading and trailing newlines
        let node = content.firstChild;
        while (node && (node.nodeName === 'BR' || node.textContent === '\n')) {
            node.remove();
            node = content.firstChild;
        }

        node = content.lastChild;
        while (node && (node.nodeName === 'BR' || node.textContent === '\n')) {
            node.remove();
            node = content.lastChild;
        }

        for (const img of af(content.querySelectorAll('img'))) {
            if (img && img.src.includes('/lectio/img/doc-homework.auto')) {
                img.remove();
            }
        }

        const description = content.innerHTML.trim() ?? '';

        homework.push({
            link: anchor.href,
            title: title ?? '',
            description,
            interval: constructInterval(lesson.tidspunkt),
        });
    }

    const filteredHomework: {
        label: string;
        homework: { link: string; title: string; description: string; interval: Interval }[];
    }[] = [];
    for (const hw of homework) {
        const label = formatLabel(hw.interval.start ?? DateTime.fromMillis(0));
        const existing = filteredHomework.find((h) => h.label === label);
        if (existing) {
            existing.homework.push(hw);
        } else {
            filteredHomework.push({
                label,
                homework: [hw],
            });
        }
    }
    return filteredHomework;
};

const formatLabel = (date: DateTime) => {
    const today = DateTime.local();
    const tomorrow = today.plus({ days: 1 });
    if (date.hasSame(today, 'day')) {
        return 'I dag';
    }
    if (date.hasSame(tomorrow, 'day')) {
        return 'I morgen';
    }
    return toTitleCase(date.toFormat('EEEE, d/M'));
};

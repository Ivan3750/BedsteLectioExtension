import { DateTime } from 'luxon';
import { extractLesson } from '../calendar/extractor';
import { stringToColor } from 'utils/color';
import { constructInterval } from 'utils/datetime';
import { extractSchool } from 'utils/page';
import { toTitleCase } from 'utils/string';

export const extractLessons = (html: Document) => {
    const elements = Array.from<HTMLAnchorElement>(
        html.querySelectorAll("div#s_m_Content_Content_skemaIsland_pa > div[role='heading'] > a"),
    );
    const lessons = elements
        .map((element) => extractLesson(element))
        .map((lesson) => ({
            color: stringToColor(lesson.hold ?? '', 100, 90).string,
            textColor: stringToColor(lesson.hold ?? '', 100, 30).string,
            class: lesson.hold ?? '',
            id: lesson.absid,
            link: `/lectio/${extractSchool(document.location.pathname)}/aktivitet/aktivitetforside2.aspx?absid=${lesson.absid}`,
            interval: constructInterval(lesson.tidspunkt),
            name: lesson.navn?.replace('prv.', 'prøve').replace('mdt.', 'mundtlig').replace('skr.', 'skriftlig') ?? '',
            note: lesson.andet ?? '',
            room: lesson.lokale ?? '',
            status: lesson.status ?? '',
            teacher: lesson.lærer ?? '',
        }));

    const days: Array<{ label: string; lessons: typeof lessons }> = [];
    for (const lesson of lessons) {
        const day = lesson.interval.start?.hasSame(DateTime.now(), 'day')
            ? 'I dag'
            : (lesson.interval.start?.hasSame(DateTime.now().plus({ days: 1 }), 'day')
                ? 'I morgen'
                : toTitleCase(lesson.interval.start?.toFormat('EEEE d/M') ?? '')) ?? 'N/A';
        if (days.find((day_) => day_.label === day) === undefined) {
            days.push({ label: day, lessons: [lesson] });
        } else {
            days.find((day_) => day_.label === day)?.lessons.push(lesson);
        }
    }

    return days;
};

export const extractNews = (html: Document) => {
    const aktueltItems = Array.from(
        html.querySelectorAll('table#s_m_Content_Content_importantInfo >tbody > tr.DashWithScroll.textTop'),
    );
    const news: Array<{ heading: string; body: string }> = [];

    for (const tr of aktueltItems) {
        const content = tr.querySelector('td.infoCol span');
        if (!content) {
            continue;
        }

        const heading = content.querySelector('span.bb_b')?.textContent ?? '';
        (content.querySelector('span.bb_b') ?? html.createElement('span')).remove();

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

        const body = content.innerHTML.trim() ?? '';

        news.push({ heading, body });
    }

    return news;
};

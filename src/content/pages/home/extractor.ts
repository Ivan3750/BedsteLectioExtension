import { DateTime } from 'luxon';
import { extractLesson } from '../calendar/extractor';
import { stringToColor } from 'utils/color';
import { constructDateTime, constructInterval } from 'utils/datetime';
import { extractSchool } from 'utils/page';
import { toTitleCase } from 'utils/string';
import { af } from 'utils/array';

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
            link: `/lectio/${extractSchool(document.location.pathname)}/aktivitet/aktivitetforside2.aspx?absid=${lesson.absid
                }`,
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

    const examRows = af(
        html.querySelectorAll<HTMLTableRowElement>('table#s_m_Content_Content_EksamenerInfo > tbody > tr'),
    );
    if (examRows.length > 0) {
        const heading = 'Eksamener';
        const body = examRows
            .map((row) => {
                const info = row.querySelector<HTMLTableCellElement>('td.infoCol')?.querySelector('a');
                const title = info?.textContent ?? '';
                const link = info?.href ?? '';
                const date = constructDateTime(row.querySelector<HTMLTableCellElement>('td.timeCol')?.title ?? '');
                return `<a href="${link}">${title} ${date.toRelative()}</a>`;
            })
            .join('<br>');
        news.push({ heading, body });
    }

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

export const extractHomework = (html: Document) => {
    const homeworkRows = af(
        html.querySelectorAll<HTMLTableRowElement>('table#s_m_Content_Content_LektierOversigt > tbody > tr'),
    );

    const homework: { link: string; title: string; body: string; date: DateTime }[] = [];
    for (const row of homeworkRows) {
        if (row.querySelector('td.norecord') !== null) {
            continue;
        }
        const body = row.title;
        const info = row.querySelector<HTMLTableCellElement>('td.infoCol')?.querySelector('a');
        const title = info?.textContent ?? '';
        const link = info?.href ?? '';
        const date = constructDateTime(row.querySelector<HTMLTableCellElement>('td.timeCol')?.title ?? '');
        homework.push({ link, title, body, date });
    }

    return homework;
};

export const extractMessages = (html: Document) => {
    const messageRows = af(
        html.querySelectorAll<HTMLTableRowElement>('table#s_m_Content_Content_BeskederInfo > tbody > tr'),
    );

    const messages: { link: string; title: string; sender: string; date: DateTime }[] = [];
    for (const row of messageRows) {
        if (row.querySelector('td.norecord') !== null) {
            continue;
        }
        const info = row.querySelector<HTMLTableCellElement>('td.infoCol')?.querySelector('a');
        const title = info?.textContent ?? '';
        const link = info?.href ?? '';
        const sender = row.querySelector<HTMLTableCellElement>('td.nameCol')?.textContent ?? '';
        const date = constructDateTime(row.querySelector<HTMLTableCellElement>('td.timeCol')?.title ?? '');
        messages.push({ link, title, sender, date });
    }

    return messages;
};

export const extractDocuments = (html: Document) => {
    const documentsRows = af(
        html.querySelectorAll<HTMLTableRowElement>('table#s_m_Content_Content_DokumenterInfo > tbody > tr'),
    );

    const documents: { link: string; title: string; owner: string; date: DateTime }[] = [];
    for (const row of documentsRows) {
        if (row.querySelector('td.norecord') !== null) {
            continue;
        }
        const info = row.querySelector<HTMLTableCellElement>('td.infoCol')?.querySelector('a');
        const title = info?.textContent ?? '';
        const link = info?.href ?? '';
        const owner = row.querySelector<HTMLTableCellElement>('td.nameCol')?.querySelector('span')?.title ?? '';
        const date = constructDateTime(row.querySelector<HTMLTableCellElement>('td.timeCol')?.title ?? '');
        documents.push({ link, title, owner, date });
    }

    return documents;
};

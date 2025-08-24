import { DateTime } from 'luxon';

export const PAGES = {
    home: { name: 'Forside', link: '/lectio/$school/forside.aspx', supported: true, inHeader: true },
    calendar: { name: 'Skema', link: '/lectio/$school/SkemaNy.aspx', supported: true, inHeader: true },
    assignments: { name: 'Opgaver', link: '/lectio/$school/OpgaverElev.aspx', supported: true, inHeader: true },
    assignments_task: {
        name: 'Opgaver',
        link: '/lectio/$school/ElevAflevering.aspx',
        supported: true,
        inHeader: false,
    },
    homework: {
        name: 'Lektier',
        link: '/lectio/$school/material_lektieoversigt.aspx',
        supported: true,
        inHeader: true,
    },
    messege: { name: 'Messege', link: '/lectio/$school/beskeder2.aspx', supported: false, inHeader: false },
    task: {
        name: 'Lektier',
        link: '/lectio/$school/aktivitet/aktivitetforside2.aspx',
        supported: true,
        inHeader: false,
    },
    absence_overview: {
        parent: 'Fravær',
        name: 'Oversigt',
        description: 'Se en oversigt over dit almindelige- og skriftlige fravær. ',
        link: '/lectio/$school/subnav/fravaerelev.aspx',
        supported: true,
        inHeader: true,
    },
    absence_reasons: {
        parent: 'Fravær',
        name: 'Fraværsårsager',
        description: 'Se dine fraværsårsager og administrer dem.',
        link: '/lectio/$school/subnav/fravaerelev_fravaersaarsager.aspx',
        supported: true,
        inHeader: true,
    },
    documents: { name: 'Dokumenter', link: '/lectio/$school/DokumentOversigt.aspx', supported: true, inHeader: true },
    messages: { name: 'Beskeder', link: '/lectio/$school/beskeder2.aspx', supported: true, inHeader: true },
};

export const getPages = (location: Location) => {
    const school = extractSchool(location.pathname);
    const pages: Record<
        string,
        { parent?: string; name: string; description?: string; link: string; supported: boolean }
    > = {};
    for (const page of Object.keys(PAGES)) {
        const pageData = PAGES[page as keyof typeof PAGES];
        pages[page] = { ...pageData, link: pageData.link.replace('$school', school) };
    }

    return pages;
};
interface Page {
    parent?: string;
    name: string;
    description?: string;
    link: string;
    supported: boolean;
    inHeader?: boolean;
}

export const getNavbarPages = (location: Location) => {
    const pages: Record<string, Page> = getPages(location); // Типізуємо сторінки
    const parentedPages: Record<
        string,
        { name: string; link: string; children: { name: string; link: string; description?: string }[] }
    > = {};

    for (const pageKey of Object.keys(pages)) {
        const pageData = pages[pageKey];

        // Пропускаємо сторінки, які не мають inHeader
        if (!pageData.inHeader) continue;

        if (pageData.parent !== undefined) {
            if (!parentedPages[pageData.parent]) {
                parentedPages[pageData.parent] = { name: pageData.parent, link: '', children: [] };
            }
            parentedPages[pageData.parent].children.push({
                name: pageData.name,
                description: pageData.description,
                link: pageData.link,
            });
        } else {
            parentedPages[pageKey] = { name: pageData.name, link: pageData.link, children: [] };
        }
    }

    return parentedPages;
};

export const isLocationSupported = (location: Location) =>
    shouldOverridePath(location.pathname)
        ? true
        : Object.values(getPages(location))
              .filter((page) => page.supported)
              .map((page) => page.link)
              .some((substring) => location.pathname.includes(substring));

export const shouldOverridePath = (path: string) => {
    return path.includes('login_list.aspx') || path === '/';
};

export const extractSchool = (value: string) => value.match(/\/lectio\/(\d*)\//)?.[1] ?? '';

export const linkTo = (location: Location, to: keyof typeof PAGES) => getPages(location)[to].link;

export const linkToEvent = (location: Location, event: { absid: string }) => {
    const school = extractSchool(location.pathname);
    return `/lectio/${school}/aktivitet/aktivitetforside2.aspx?absid=${event.absid}`;
};

export const linkToCalendarDate = (location: Location, date: DateTime) => {
    return `${linkTo(location, 'calendar')}?week=${date.weekNumber.toString().padStart(2, '0')}${date.year}`;
};

export const toPageKey = (location: Location) => {
    if (location.pathname === '/') {
        return 'lectioroot';
    }
    if (location.pathname.includes('login_list.aspx')) {
        return 'lectio';
    }
    const school = extractSchool(location.pathname);
    const matches = Object.entries(PAGES).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, page]) => location.pathname === page.link.replace('$school', school),
    );
    return matches?.[0] ?? 'home';
};

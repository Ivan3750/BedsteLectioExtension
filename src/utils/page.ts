import { DateTime } from 'luxon';

export const PAGES = {
    home: { name: 'Forside', link: '/lectio/$school/forside.aspx', supported: true },
    calendar: { name: 'Skema', link: '/lectio/$school/SkemaNy.aspx', supported: true },
    assignments: { name: 'Opgaver', link: '/lectio/$school/OpgaverElev.aspx', supported: true },
    homework: { name: 'Lektier', link: '/lectio/$school/material_lektieoversigt.aspx', supported: false },
    absence: { name: 'Fravær', link: '/lectio/$school/subnav/fravaerelev_fravaersaarsager.aspx', supported: false },
    documents: { name: 'Dokumenter', link: '/lectio/$school/DokumentOversigt.aspx', supported: false },
    messages: { name: 'Beskeder', link: '/lectio/$school/beskeder2.aspx', supported: false },
};

export const getPages = (location: Location) => {
    const school = extractSchool(location.pathname);
    const pages: Record<string, { name: string; link: string; supported: boolean }> = {};
    for (const page of Object.keys(PAGES)) {
        // @ts-expect-error
        pages[page] = { ...PAGES[page], link: PAGES[page].link.replace('$school', school) };
    }

    return pages;
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
    const page = Object.entries(PAGES).find(
        ([_, page]) => location.pathname === page.link.replace('$school', school),
    )?.[0];
    return page ?? 'home';
};

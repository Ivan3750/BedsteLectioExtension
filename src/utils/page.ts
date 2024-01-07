import { DateTime } from 'luxon';

export const PAGES = {
    home: { name: 'Forside', link: '/lectio/$school/forside.aspx', supported: true },
    calendar: { name: 'Skema', link: '/lectio/$school/SkemaNy.aspx', supported: true },
    assignments: { name: 'Opgaver', link: '/lectio/$school/OpgaverElev.aspx', supported: false },
};

export const getPages = (location: Location) => {
    const school = extractSchool(location);
    const pages: Record<string, { name: string; link: string; supported: boolean }> = {};
    for (const page of Object.keys(PAGES)) {
        // @ts-expect-error
        pages[page] = { ...PAGES[page], link: PAGES[page].link.replace('$school', school) };
    }

    return pages;
};

export const isLocationSupported = (location: Location) =>
    location &&
    location.pathname &&
    Object.values(getPages(location))
        .filter((page) => page.supported)
        .map((page) => page.link)
        .some((substring) => location.pathname.includes(substring));

export const extractSchool = (location: Location) => location.pathname.split('/')[2];

export const linkTo = (location: Location, to: keyof typeof PAGES) => getPages(location)[to].link;

export const linkToEvent = (location: Location, event: { absid: string }) => {
    const school = extractSchool(location);
    return `/lectio/${school}/aktivitet/aktivitetforside2.aspx?absid=${event.absid}`;
};

export const linkToCalendarDate = (location: Location, date: DateTime) => {
    return `${linkTo(location, 'calendar')}?week=${date.weekNumber.toString().padStart(2, '0')}${date.year}`;
};

export const toPageKey = (location: Location) => {
    const school = extractSchool(location);
    const page = Object.entries(PAGES).find(
        ([_, page]) => location.pathname === page.link.replace('$school', school),
    )?.[0];
    return page ?? 'home';
};

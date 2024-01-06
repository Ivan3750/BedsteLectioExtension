export const PAGES = {
    "home": { name: "Forside", link: "forside.aspx", supported: true },
    "calendar": { name: "Skema", link: "SkemaNy.aspx", supported: false },
};

export const isLocationSupported = (location: Location) => {
    return location && location.pathname && Object.values(PAGES).filter((page) => page.supported).map((page) => page.link).some((substring) => location.pathname.includes(substring));
};

export const extractSchool = (location: Location) => {
    return location.pathname.split("/")[2];
};

export const linkTo = (location: Location, to: keyof typeof PAGES) => {
    const school = extractSchool(location);
    return `/lectio/${school}/${PAGES[to].link}`;
};

export const toPageKey = (location: Location) => {
    const page = Object.entries(PAGES).find(([_, page]) => {
        return location.pathname.includes(page.link);
    })?.[0];
    return page ?? "home";
}

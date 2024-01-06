export const PAGES = {
    "home": { name: "Forside", link: "/lectio/$school/forside.aspx", supported: true },
    "calendar": { name: "Skema", link: "/lectio/$school/SkemaNy.aspx", supported: false },
    "assignments": { name: "Opgaver", link: "/lectio/$school/OpgaverElev.aspx", supported: false },
};

export const getPages = (location: Location) => {
    const school = extractSchool(location);
    const pages: Record<string, { name: string; link: string, supported: boolean }> = {}
    for (const page of Object.keys(PAGES)) {
        // @ts-ignore
        pages[page] = { ...PAGES[page], link: PAGES[page].link.replace("$school", school) };
    }
    return pages;
}

export const isLocationSupported = (location: Location) => {
    return location && location.pathname && Object.values(getPages(location)).filter((page) => page.supported).map((page) => page.link).some((substring) => location.pathname.includes(substring));
};

export const extractSchool = (location: Location) => {
    return location.pathname.split("/")[2];
};

export const linkTo = (location: Location, to: keyof typeof PAGES) => {
    return getPages(location)[to].link;
};

export const toPageKey = (location: Location) => {
    const school = extractSchool(location);
    const page = Object.entries(PAGES).find(([_, page]) => {
        return location.pathname === page.link.replace("$school", school);
    })?.[0];
    return page ?? "home";
}

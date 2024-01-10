import { extractSchool } from 'utils/page';

export const extractSchools = (html: Document): { name: string; id: string }[] => {
    const schools = html.querySelectorAll<HTMLDivElement>('div#schoolsdiv > div.buttonHeader');
    return Array.from(schools).map((school) => {
        const anchor = school.querySelector('a');
        return {
            name: anchor?.textContent?.trim() ?? '',
            id: extractSchool(anchor?.href ?? ''),
        };
    });
};

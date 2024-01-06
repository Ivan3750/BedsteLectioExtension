const statusDictionary: Record<string, string> = {
    "s2brik": "normal",
    "s2cancelled": "aflyst",
    "s2changed": "ændret",
    "s2bgboxeksamen": "eksamen",
};

const renameDictionary: Record<string, string> = { "Lærere": "Lærer", "Lokaler": "Lokale" };

export const extractLesson = (element: HTMLAnchorElement) => {
    const matches = element.href.match(/(?:absid|ProeveholdId)=([0-9]+)/);
    const absid = matches ? matches[1] : element.href;

    const lesson: {
        navn: string | null;
        tidspunkt: string;
        hold: string | null;
        hold_id: string | null;
        lærer: string | null;
        lokale: string | null;
        status: string;
        absid: string;
        andet: string | null;
    } = {
        navn: null,
        tidspunkt: "",
        hold: null,
        hold_id: null,
        lærer: null,
        lokale: null,
        status: "normal",
        absid,
        andet: null,
    };

    const statusClass = element.classList[2];
    if (statusClass in statusDictionary) {
        lesson.status = statusDictionary[statusClass];
    } else {
        lesson.status = statusClass;
    }

    const tooltip = element.dataset.tooltip ?? "";
    const tooltipParts = tooltip.split("\n\n")[0].split("\n");

    for (const part of tooltipParts) {
        const value = part.split(": ").slice(1).join(": ");
        if (value !== "" && Object.keys(lesson).includes(part.split(": ")[0].toLowerCase())) {
            let navn = part.split(": ")[0];
            if (navn in renameDictionary) {
                navn = renameDictionary[navn];
            }

            // @ts-ignore
            lesson[navn.toLowerCase()] = value;
        } else if (part.match(
            /((?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til( (?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d)? ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/
        )) {
            lesson.tidspunkt = part;
        } else {
            lesson.navn = part;
        }
    }

    try {
        lesson.hold_id = element.innerHTML.match(/data-lectiocontextcard="HE[0-9]+/)?.[0]?.replace('data-lectiocontextcard="', "") ?? null;
    } catch (error) {
        // Ignore exception
    }

    try {
        lesson.andet = tooltip.split("\n\n")[1];
    } catch (error) {
        // Ignore exception
    }

    return lesson;
};
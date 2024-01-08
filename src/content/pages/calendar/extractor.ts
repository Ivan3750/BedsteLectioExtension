import { DateTime, Interval } from 'luxon';
import { af } from 'utils/array';
import { stringToColor } from 'utils/color';
import { constructInterval } from 'utils/interval';
import { linkToEvent } from 'utils/page';

export const extractEvents = (html: Document) => {
    const events: ReturnType<typeof extractLesson>[] = [];
    const timeSchedule: Record<string, string> = {};

    const dateString =
        html.querySelector<HTMLInputElement>('#s_m_Content_Content_SkemaNyMedNavigation_datePicker_tb')?.value ?? '';
    const dateRegex = /\((\d{1,2}\/\d{1,2})-(\d{1,2}\/\d{1,2})\) (\d{4})/;
    const match = dateString.match(dateRegex);
    let startDate: DateTime;
    let endDate: DateTime;
    if (match) {
        const startDateString = match[1];
        const endDateString = match[2];
        const year = match[3];

        startDate = DateTime.fromFormat(`${startDateString} ${year}`, 'd/M yyyy');
        endDate = DateTime.fromFormat(`${endDateString} ${year}`, 'd/M yyyy');
    } else {
        startDate = DateTime.now().startOf('week');
        endDate = DateTime.now().endOf('week');
    }
    const interval = Interval.fromDateTimes(startDate, endDate);

    af(html.querySelectorAll('div.s2skemabrikcontainer')).map((element, i) => {
        if (i === 0) {
            const schedules = element.querySelectorAll('div.s2module-bg');
            const scheduleTimes = element.querySelectorAll('div.s2module-info');

            for (let i = 0; i < schedules.length; i++) {
                const offset = parseFloat(
                    schedules[i]
                        .getAttribute('style')
                        ?.match(/top:[^;]+/)?.[0]
                        ?.slice(4, -2) ?? '0',
                ).toFixed(0);

                timeSchedule[offset] =
                    scheduleTimes[i]?.textContent
                        ?.match(/\d+:\d+ - \d+:\d+/)?.[0]
                        ?.replace('-', 'til')
                        ?.replace(/(?<![0-9])(\d)(?![0-9])/g, '0$1') ?? '';
            }
        } else {
            af(element.querySelectorAll<HTMLAnchorElement>('a.s2skemabrik')).map((element) => {
                const lesson = extractLesson(element);
                if (!lesson.tidspunkt) {
                    const offset =
                        element
                            ?.getAttribute('style')
                            ?.match(/top:[^;]+/)?.[0]
                            ?.slice(4, -2) ?? '0';
                    const dayHeaderText = html
                        ?.querySelector('tr.s2dayHeader')
                        ?.querySelectorAll('td')
                        ?.[i].textContent?.trim()
                        .split(' ')[1]
                        .slice(1, -1);

                    lesson['tidspunkt'] = dayHeaderText + '-' + interval?.start?.year + ' ' + timeSchedule[offset];
                }
                events.push(lesson);
            });
        }
    });

    const parsedEvents = events.map((event) => {
        const interval = constructInterval(event.tidspunkt);
        const start = interval.start?.toISO() ?? 'string';
        const end = interval.end?.toISO() ?? 'string';

        const color = stringToColor(event.hold ?? '', 100, 90).string;
        const textColor = stringToColor(event.hold ?? '', 100, 30).string;
        const className = event.hold ?? '';
        const name = event.navn ? `${event.navn}<br>` : '';
        const other = event.andet ? `<br><br>${event.andet}` : '';

        return {
            color: color,
            textColor: textColor,
            end,
            extendedProps: {
                cancelled: event.status === 'aflyst',
                description: `${name}${event.tidspunkt}<br>Hold: ${className}<br>Lærer: ${event.lærer}<br>Lokale: ${event.lokale}${other}`,
            },
            id: event.absid,
            start,
            title: `${event.navn ?? className}${event.lokale ? ` • ${event.lokale}` : ''}`,
            url: linkToEvent(document.location, event),
        };
    });

    return { interval, events: parsedEvents };
};

const statusDictionary: Record<string, string> = {
    s2brik: 'normal',
    s2cancelled: 'aflyst',
    s2changed: 'ændret',
    s2bgboxeksamen: 'eksamen',
};

const renameDictionary: Record<string, string> = { Lærere: 'Lærer', Lokaler: 'Lokale' };

export const extractLesson = (element: HTMLAnchorElement) => {
    const matches = /(?:absid|ProeveholdId)=(\d+)/.exec(element.href);
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
        tidspunkt: '',
        hold: null,
        hold_id: null,
        lærer: null,
        lokale: null,
        status: 'normal',
        absid,
        andet: null,
    };

    const statusClass = element.classList[2];
    lesson.status = statusClass in statusDictionary ? statusDictionary[statusClass] : statusClass;

    const tooltip = element.dataset.tooltip ?? '';
    const tooltipParts = tooltip.split('\n\n')[0].split('\n');

    for (const part of tooltipParts) {
        const value = part.split(': ').slice(1).join(': ');
        if (value !== '' && Object.keys(lesson).includes(part.split(': ')[0].toLowerCase())) {
            let navn = part.split(': ')[0];
            if (navn in renameDictionary) {
                navn = renameDictionary[navn];
            }

            // @ts-expect-error
            lesson[navn.toLowerCase()] = value;
        } else if (
            /((?:[1-9]|[12]\d|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?\d|2[0-3]):[0-5]\d) til( (?:[1-9]|[12]\d|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d)? ((?:[01]?\d|2[0-3]):[0-5]\d)/.test(
                part,
            )
        ) {
            lesson.tidspunkt = part;
        } else {
            lesson.navn = part;
        }
    }

    try {
        lesson.hold_id =
            /data-lectiocontextcard="HE\d+/.exec(element.innerHTML)?.[0]?.replace('data-lectiocontextcard="', '') ??
            null;
    } catch {
        // Ignore exception
    }

    try {
        lesson.andet = tooltip.split('\n\n')[1];
    } catch {
        // Ignore exception
    }

    return lesson;
};

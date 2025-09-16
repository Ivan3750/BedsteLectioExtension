import { DateTime, Interval } from 'luxon';
import { af } from 'utils/array';
import { stringToColor } from 'utils/color';
import { constructInterval } from 'utils/datetime';
import { linkToEvent } from 'utils/page';

export const extractEvents = (html: Document, referenceDate?: DateTime) => {
    const events: ReturnType<typeof extractLesson>[] = [];
    const timeSchedule: Record<string, string> = {};

    // Використовуємо referenceDate, ігноруємо DOM для дати
    const today = referenceDate ?? DateTime.now();
    const startDate = today.startOf('week');
    const endDate = today.endOf('week');
    const interval = Interval.fromDateTimes(startDate, endDate);

    af(html.querySelectorAll('div.s2skemabrikcontainer')).map((element, i) => {
        if (i === 0) {
            const schedules = element.querySelectorAll('div.s2module-bg');
            const scheduleTimes = element.querySelectorAll('div.s2module-info');

            for (let j = 0; j < schedules.length; j++) {
                const offset = parseFloat(
                    schedules[j].getAttribute('style')?.match(/top:[^;]+/)?.[0]?.slice(4, -2) ?? '0'
                ).toFixed(0);

                timeSchedule[offset] =
                    scheduleTimes[j]?.textContent
                        ?.match(/\d+:\d+ - \d+:\d+/)?.[0]
                        ?.replace('-', 'til')
                        ?.replace(/(?<![0-9])(\d)(?![0-9])/g, '0$1') ?? '';
            }
        } else {
            af(element.querySelectorAll<HTMLAnchorElement>('a.s2skemabrik')).map((element) => {
                const lesson = extractLesson(element);
                if (!lesson.tidspunkt) {
                    const offset =
                        element.getAttribute('style')?.match(/top:[^;]+/)?.[0]?.slice(4, -2) ?? '0';
                    const dayHeaderText = html
                        .querySelector('tr.s2dayHeader')
                        ?.querySelectorAll('td')
                        ?.[i].textContent?.trim()
                        .split(' ')[1]
                        .slice(1, -1);

                    lesson.tidspunkt = `${dayHeaderText}/${startDate.year} ${timeSchedule[offset]}`;
                }
                events.push(lesson);
            });
        }
    });

    const parsedEvents = events.map((event) => {
        const interval = constructInterval(event.tidspunkt);
        const start = interval.start?.toISO() ?? '';
        const end = interval.end?.toISO() ?? '';

        const color = stringToColor(event.hold ?? '', 100, 90).string;
        const textColor = stringToColor(event.hold ?? '', 100, 30).string;
        const className = event.hold ?? '';
        const name = event.navn ? `${event.navn}<br>` : '';
        const other = event.andet ? `<br><br>${event.andet}` : '';

        return {
            color,
            textColor,
            start,
            end,
            extendedProps: {
                cancelled: event.status === 'aflyst',
                description: `${name}${event.tidspunkt}<br>Hold: ${className}<br>Lærer: ${event.lærer}<br>Lokale: ${event.lokale}${other}`,
            },
            id: event.absid,
            title: `${event.navn ?? className}${event.lokale ? ` • ${event.lokale}` : ''}`,
            url: linkToEvent(document.location, event),
        };
    });

    return { interval, events: parsedEvents };
};

// ---------------- extractLesson ----------------
const statusDictionary = {
    s2brik: 'normal',
    s2cancelled: 'aflyst',
    s2changed: 'ændret',
    s2bgboxeksamen: 'eksamen',
};

const renameDictionary = { Lærere: 'Lærer', Lokaler: 'Lokale' };

export const extractLesson = (element: HTMLAnchorElement) => {
    const matches = /(?:absid|ProeveholdId)=(\d+)/.exec(element.href);
    const absid = matches ? matches[1] : element.href;

    const lesson: any = {
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
    lesson.status =
        statusClass in statusDictionary ? statusDictionary[statusClass as keyof typeof statusDictionary] : statusClass;

    const tooltip = element.dataset.tooltip ?? '';
    const tooltipParts = tooltip.split('\n\n')[0].split('\n');

    for (const part of tooltipParts) {
        const parts = part.split(': ');
        const key = (
            parts[0] in renameDictionary ? renameDictionary[parts[0] as keyof typeof renameDictionary] : parts[0]
        ).toLowerCase();
        const value = parts.slice(1).join(': ');

        if (value !== '' && Object.keys(lesson).includes(key)) {
            lesson[key] = value;
        } else if (/((?:[1-9]|[12]\d|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?\d|2[0-3]):[0-5]\d) til( (?:[1-9]|[12]\d|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d)? ((?:[01]?\d|2[0-3]):[0-5]\d)/.test(part)) {
            lesson.tidspunkt = part;
        } else {
            lesson.navn = part;
        }
    }

    try {
        lesson.hold_id = /data-lectiocontextcard="HE\d+/.exec(element.innerHTML)?.[0]?.replace('data-lectiocontextcard="', '') ?? null;
    } catch { }

    try {
        lesson.andet = tooltip.split('\n\n')[1];
    } catch { }

    return lesson;
};

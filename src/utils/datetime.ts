import { DateTime, Interval } from 'luxon';

export const constructDateTime = (input: string) => {
    return DateTime.fromFormat(input, 'd/M-yyyy HH:mm', { locale: 'da' });
};

export const constructInterval = (input: string) => {
    const parts = input.split(' ');
    let fromDate;
    let fromTime;
    let toDate;
    let toTime;
    if (parts.length === 4) {
        [fromDate, fromTime, , toTime] = parts;
        toDate = fromDate;
    } else if (parts.length === 5) {
        [fromDate, fromTime, , toDate, toTime] = parts;
    } else {
        return Interval.invalid('Invalid input string for interval');
    }

    const from = constructDateTime(`${fromDate} ${fromTime}`);
    const to = constructDateTime(`${toDate} ${toTime}`);
    return Interval.fromDateTimes(from, to);
};

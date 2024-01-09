import React from 'react';
import TimeAgo, { type Formatter } from 'react-timeago';
// @ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const formatter: Formatter = buildFormatter({
    prefixAgo: 'for',
    prefixFromNow: 'om',
    suffixAgo: 'siden',
    suffixFromNow: '',
    seconds: 'mindre end et minut',
    minute: 'et minut',
    minutes: '%d minutter',
    hour: 'en time',
    hours: '%d timer',
    day: 'en dag',
    days: '%d dage',
    month: 'en måned',
    months: '%d måneder',
    year: 'et år',
    years: '%d år',
});

export const RelativeTime = (props: { date: Date | string | number }) => {
    const { date } = props;
    return <TimeAgo date={date} formatter={formatter} />;
};

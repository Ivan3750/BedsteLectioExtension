import { DateTime } from 'luxon';
import { constructDateTime } from 'utils/datetime';

export const extractHomework = (html: Document) => {
    return [
        {
            label: 'I dag',
            homework: [
                {
                    link: 'https://google.com/',
                    title: 'Dansk',
                    description: 'Læs side 1-2',
                    date: DateTime.local().plus({ days: 1 }),
                },
                {
                    link: 'https://google.com/',
                    title: 'Dansk',
                    description: 'Læs side 1-2',
                    date: DateTime.local().plus({ days: 1 }),
                },
            ],
        },
        {
            label: 'I morgen',
            homework: [
                {
                    link: 'https://google.com/',
                    title: 'Dansk',
                    description: 'Læs side 1-2',
                    date: DateTime.local().plus({ days: 1 }),
                },
            ],
        },
    ];
};

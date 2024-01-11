import React from 'react';

import { extractAbsence } from './extractor';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from 'components/card';
import { RelativeTime } from 'components/relative-time';
import { DateTime } from 'luxon';

export const AbsenceReasonsPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const homework = extractAbsence(content);

    return (
        <div className="page-container">
            <div>
                <h1 className="mb-2">Lektier</h1>
                {homework.map((day, i) => (
                    <div key={i}>
                        <span className="font-bold leading-10">{day.label}</span>
                        {day.homework.map((entry, j) => (
                            <div className="!mb-2" key={j}>
                                <a href={entry.link} className="!no-underline">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{entry.title}</CardTitle>
                                            <CardDescription>
                                                <RelativeTime
                                                    date={
                                                        entry.interval.start?.toJSDate() ?? DateTime.local().toJSDate()
                                                    }
                                                />
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <p
                                                className="!m-0"
                                                dangerouslySetInnerHTML={{ __html: entry.description }}
                                            />
                                        </CardFooter>
                                    </Card>
                                </a>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

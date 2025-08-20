import React from 'react';
import { extractTask, Task } from './extractor';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from 'components/card';
import { RelativeTime } from 'components/relative-time';
import { DateTime } from 'luxon';

export const TaskPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const homework: Task | null = extractTask(content);

    if (!homework) {
        return <div className="page-container">Ingen lektier fundet.</div>;
    }

    return (
        <div className="page-container">
            <h1 className="mb-2">Lektier</h1>
            <div className="mb-4">
                <span className="font-bold leading-10">{homework.title}</span>
                <div className="!mb-2">
                    <a href={homework.link} className="!no-underline">
                        <Card>
                            <CardHeader>
                                <CardTitle>{homework.title}</CardTitle>
                                <CardDescription>
                                    <RelativeTime
                                        date={homework.interval?.start?.toJSDate() ?? DateTime.local().toJSDate()}
                                    />
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                {homework.note && <p className="!m-0">{homework.note}</p>}
                                {homework.description && (
                                    <p
                                        className="!m-0 mt-1"
                                        dangerouslySetInnerHTML={{ __html: homework.description }}
                                    />
                                )}

                                {/* Файли */}
                                {homework.files.length > 0 && (
                                    <div className="mt-2">
                                        <strong>Filer:</strong>
                                        <ul className="list-disc ml-5">
                                            {homework.files.map((file, idx) => (
                                                <li key={idx}>
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                        {file.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Зовнішні посилання */}
                                {homework.externalLinks.length > 0 && (
                                    <div className="mt-2">
                                        <strong>Eksterne links:</strong>
                                        <ul className="list-disc ml-5">
                                            {homework.externalLinks.map((link, idx) => (
                                                <li key={idx}>
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                        {link.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    </a>
                </div>
            </div>
        </div>
    );
};

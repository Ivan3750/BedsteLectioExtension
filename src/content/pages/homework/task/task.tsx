import React from 'react';
import { extractTask, Task } from './extractor';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from 'components/card';
import { RelativeTime } from 'components/relative-time';
import { DateTime } from 'luxon';

export const TaskPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const allTasks: Task[] = extractTask(content);

    const notes = allTasks.filter((t) => t.type === 'note');
    const homework = allTasks.filter((t) => t.type === 'homework');

    if (allTasks.length === 0) {
        return <div className="page-container">Ingen lektier eller noter fundet.</div>;
    }

    return (
        <div className="page-container">
            <h1 className="mb-4">Lektier & Noter</h1>

            {/* Нотатки / опис */}
            {notes.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Beskrivelse / Noter</h2>
                    {notes.map((note, idx) => (
                        <Card key={idx} className="mb-3">
                            <CardHeader>
                                <CardTitle>{note.title}</CardTitle>
                            </CardHeader>
                            <CardFooter>
                                <p dangerouslySetInnerHTML={{ __html: note.description ?? '' }} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Домашка */}
            {homework.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Lektier</h2>
                    {homework.map((task, idx) => (
                        <div className="mb-4" key={idx}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{task.title}</CardTitle>
                                    <CardDescription>
                                        <RelativeTime
                                            date={task.interval?.start?.toJSDate() ?? DateTime.local().toJSDate()}
                                        />
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    {task.note && <p className="!m-0">{task.note}</p>}
                                    {task.description && (
                                        <p
                                            className="!m-0 mt-1"
                                            dangerouslySetInnerHTML={{ __html: task.description }}
                                        />
                                    )}

                                    {/* Файли */}
                                    {task.files.length > 0 && (
                                        <div className="mt-2">
                                            <strong>Filer:</strong>
                                            <ul className="list-disc ml-5">
                                                {task.files.map((file, idx) => (
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
                                    {task.externalLinks.length > 0 && (
                                        <div className="mt-2">
                                            <strong>Eksterne links:</strong>
                                            <ul className="list-disc ml-5">
                                                {task.externalLinks.map((link, idx) => (
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

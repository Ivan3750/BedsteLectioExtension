import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { linkTo } from 'utils/page';
import { Tabs, useTabs } from 'components/tabs';
import { Timeline, TimelineItem } from 'components/timeline';
import {
    extractDocuments,
    extractHomework,
    extractLessons,
    extractMessages,
    extractNews,
    extractName,
} from './extractor';
import { Card, CardDescription, CardHeader, CardTitle } from 'components/card';
import { RelativeTime } from 'components/relative-time';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'components/tooltip';

export const HomePage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const lessons = extractLessons(content);
    const news = extractNews(content);
    const homework = extractHomework(content);
    const messages = extractMessages(content);
    const documents = extractDocuments(content);
    const myname = extractName(content);

    const [tabProps] = useState({
        tabs: lessons.map((day) => ({
            label: day.label,
            children: (
                <Timeline className="ml-3">
                    {day.lessons.map((lesson) => (
                        <TimelineItem
                            key={lesson.id}
                            cancelled={lesson.status === 'aflyst'}
                            className="mb-10"
                            color={lesson.color}
                            textColor={lesson.textColor}
                            description={`${lesson.note === '' ? lesson.room : `${lesson.note}<br>${lesson.room}`}`}
                            link={lesson.link}
                            time={lesson.interval.toLocaleString(DateTime.TIME_24_SIMPLE)}
                            title={lesson.name === '' ? lesson.class : lesson.name}
                            titleNote={lesson.teacher}
                        />
                    ))}
                </Timeline>
            ),
            id: day.label,
        })),
        initialTabId: lessons[0]?.label,
    });
    const tabs = useTabs(tabProps);

    return (
        <div className="page-container">
            <div className="text-[40px] text-[#000] font-extrabold"> Hej {myname}! </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4">
                <div className="lg:col-span-2 h-[70vh] 2xl:h-[50vh] flex flex-col bg-white dark:bg-dark rounded-2xl p-6">
                    <div className="mb-[0.3em] flex items-center justify-between">
                        <h1 className="mb-0 ">Skema</h1>
                        <a href={linkTo(document.location, 'calendar')}>
                            <ArrowRight />
                        </a>
                    </div>
                    {lessons.length > 0 ? (
                        <div className="overflow-y-auto">
                            <Tabs {...tabs.tabProps} />
                            {tabs.selectedTab.children}
                        </div>
                    ) : (
                        <p>Ingen kommende lektioner.</p>
                    )}
                </div>
                <div className="lg:col-span-1 h-[70vh] 2xl:h-[50vh] flex flex-col bg-white dark:bg-dark rounded-2xl p-6">
                    <h1 className="mb-0">Aktuelt</h1>
                    <div className="block overflow-y-auto not-prose">
                        {news.length > 0 ? (
                            <div className="space-y-4">
                                {news.map((newsItem, i) => (
                                    <div key={i}>
                                        <strong>{newsItem.heading}</strong>
                                        <p
                                            className="[&_a]:underline"
                                            dangerouslySetInnerHTML={{ __html: newsItem.body }}
                                        />
                                        {i < news.length - 1 && <hr className="!my-4 dark:border-t-gray-600/50" />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Ingen aktuelle nyheder.</p>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1 lg:row-start-2 h-[70vh] 2xl:h-[50vh] flex flex-col bg-white dark:bg-dark rounded-2xl p-6">
                    <div className="mb-[0.3em] flex items-center justify-between">
                        <h1 className="mb-0">Lektier</h1>
                        <a href={linkTo(document.location, 'homework')}>
                            <ArrowRight />
                        </a>
                    </div>
                    <div className="block overflow-y-auto">
                        {homework.length > 0 ? (
                            homework.map((entry) => (
                                <TooltipProvider key={entry.link}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={entry.link} className="!no-underline">
                                                <Card className="mt-5">
                                                    <CardHeader>
                                                        <CardTitle>{entry.title}</CardTitle>
                                                        <CardDescription>
                                                            <RelativeTime date={entry.date.toJSDate()} />
                                                        </CardDescription>
                                                    </CardHeader>
                                                </Card>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>{entry.body}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))
                        ) : (
                            <p>Ingen kommende lektier.</p>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1 lg:row-start-2 h-[70vh] 2xl:h-[50vh] flex flex-col bg-white dark:bg-dark rounded-2xl p-6">
                    <div className="mb-[0.3em] flex items-center justify-between">
                        <h1 className="mb-0">Beskeder</h1>
                        <a href={linkTo(document.location, 'messages')}>
                            <ArrowRight />
                        </a>
                    </div>
                    <div className="block overflow-y-auto">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <a href={message.link} className="!no-underline" key={message.link}>
                                    <Card className="mt-5">
                                        <CardHeader>
                                            <CardTitle>{message.title}</CardTitle>
                                            <CardDescription>
                                                {message.sender} • <RelativeTime date={message.date.toJSDate()} />
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </a>
                            ))
                        ) : (
                            <p>Ingen ulæste beskeder.</p>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1 lg:row-start-2 h-[70vh] 2xl:h-[50vh] flex flex-col bg-white dark:bg-dark rounded-2xl p-6">
                    <div className="mb-[0.3em] flex items-center justify-between">
                        <h1 className="mb-0">Dokumenter</h1>
                        <a href={linkTo(document.location, 'documents')}>
                            <ArrowRight />
                        </a>
                    </div>
                    <div className="block overflow-y-auto">
                        {documents.length > 0 ? (
                            documents.map((document) => (
                                <a href={document.link} className="!no-underline" key={document.link}>
                                    <Card className="mt-5">
                                        <CardHeader>
                                            <CardTitle>{document.title}</CardTitle>
                                            <CardDescription>
                                                {document.owner} • <RelativeTime date={document.date.toJSDate()} />
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </a>
                            ))
                        ) : (
                            <p>Ingen nye dokumenter.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

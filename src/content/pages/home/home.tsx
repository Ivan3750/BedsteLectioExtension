import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { linkTo } from 'utils/page';
import { extractLessons, extractNews } from './extractor';
import { Tabs, useTabs } from 'components/tabs';
import { Timeline, TimelineItem } from 'components/timeline';

export const Home = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const lessons = extractLessons(content);
    const news = extractNews(content);

    const [tabProps] = useState({
        tabs: lessons.map(day => ({
            label: day.label,
            children: (
                <Timeline className="ml-3">
                    {day.lessons.map(lesson => (
                        <TimelineItem key={lesson.id} cancelled={lesson.status == "aflyst"} className="mb-10" color={lesson.color} textColor={lesson.textColor} description={`${lesson.note != "" ? `${lesson.note}<br>${lesson.room}` : lesson.room}`} link={lesson.link} time={lesson.interval.toLocaleString(DateTime.TIME_24_SIMPLE)} title={lesson.name != "" ? lesson.name : lesson.class} titleNote={lesson.teacher} />
                    ))}
                </Timeline>
            ),
            id: day.label
        })),
        initialTabId: lessons[0]?.label
    })
    const tabs = useTabs(tabProps)

    return (
        <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4">
                <div className="lg:col-span-2 h-[70vh] 2xl:h-[50vh] flex flex-col bg-white dark:bg-dark rounded-2xl p-6">
                    <div className="mb-[0.3em] flex items-center justify-between">
                        <h1 className="mb-0">Skema</h1>
                        <a href={linkTo(document.location, "calendar")}>
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
                                        <p className='[&_a]:underline' dangerouslySetInnerHTML={{ __html: newsItem.body }} />
                                        {i < news.length - 1 && <hr className='!my-4 dark:border-t-gray-600/50' />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Ingen aktuelle nyheder.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};
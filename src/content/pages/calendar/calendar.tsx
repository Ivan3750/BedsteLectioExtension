import React from 'react';
import luxonPlugin from '@fullcalendar/luxon3';
import timeGridPlugin from '@fullcalendar/timegrid';
import daLocale from '@fullcalendar/core/locales/da';
import FullCalendar from '@fullcalendar/react';
import { extractEvents } from './extractor';

import { DateTime } from 'luxon';
import { toTitleCase } from 'utils/string';
import { cn } from 'utils/cn';
import { linkToCalendarDate } from 'utils/page';
import { Button } from 'components/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import tippy from 'tippy.js';
import { sanitize } from 'dompurify';

export const CalendarPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const events = extractEvents(content);

    const calendarRef = React.createRef<FullCalendar>();



    return (
        <div className="page-container">
            {/*             <div> {JSON.stringify(events)}</div>
 */}            <div className="mb-8 flex items-center justify-between">
                <h1 className="!m-0">
                    Skema (Uge {events.interval.start?.weekNumber}, {events.interval.start?.year})
                </h1>
                <div className="flex space-x-2">
                    {events.interval?.start?.hasSame(DateTime.local(), 'week') ? null : (
                        <Button
                            onClick={() => {
                                const today = DateTime.now();
                                document.location.href = linkToCalendarDate(document.location, today);
                            }}
                        >
                            I dag
                        </Button>
                    )}
                    <Button
                        onClick={() => {
                            const current = events.interval.start ?? DateTime.now();
                            const previous = current.minus({ weeks: 1 });
                            document.location.href = linkToCalendarDate(document.location, previous);
                        }}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        onClick={() => {
                            const current = events.interval.start ?? DateTime.now();
                            const previous = current.plus({ weeks: 1 });
                            document.location.href = linkToCalendarDate(document.location, previous);
                        }}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
            <div className="!mt-0 not-prose">
                <FullCalendar
                    key={events.interval?.start?.toISODate()}
                    ref={calendarRef}
                    locale={daLocale}
                    plugins={[luxonPlugin, timeGridPlugin]}
                    initialView={window.innerWidth >= 768 ? 'timeGridWeek' : 'timeGridDay'}
                    initialDate={events.interval?.start?.toJSDate() ?? DateTime.now().toJSDate()}
                    events={events.events}
                    eventDidMount={(args) => {
                        tippy(args.el, {
                            content: sanitize(args.event.extendedProps.description, { USE_PROFILES: { html: true } }),
                            placement: 'top',
                            duration: 0,
                            allowHTML: true,
                        });
                        if (args.event.extendedProps.cancelled) args.el.classList.add('event-cancelled');
                    }}
                    windowResize={() => {
                        if (window.innerWidth >= 768) {
                            calendarRef.current?.getApi().changeView('timeGridWeek');
                        } else {
                            calendarRef.current?.getApi().changeView('timeGridDay');
                        }
                    }}
                    slotDuration={'00:30:00'}
                    slotMinTime={'07:00'}
                    slotMaxTime={'18:00'}
                    allDaySlot={false}
                    slotEventOverlap={false}
                    weekends={false}
                    headerToolbar={false}
                    dayHeaderContent={(renderProps) => {
                        const date = DateTime.fromJSDate(renderProps.date).setLocale('da');
                        const todayClasses = renderProps.isToday
                            ? 'w-8 h-8 rounded-full bg-[#adffb9] dark:bg-[#8678F9]'
                            : '';
                        const weekday = toTitleCase(date.weekdayShort?.replace('.', '') ?? '');
                        return (
                            <div className="h-12 flex items-center justify-center py-3">
                                <span className="flex items-baseline font-normal leading-6">
                                    {weekday}
                                    <span
                                        className={cn(
                                            'flex items-center justify-center ml-[0.375rem] font-semibold text-black dark:text-white',
                                            todayClasses,
                                        )}
                                    >
                                        {date.day}
                                    </span>
                                </span>
                            </div>
                        );
                    }}
                    dayHeaderFormat={{ weekday: 'long' }}
                    contentHeight={'auto'}
                    nowIndicator
                />
            </div>
        </div>
    );
};

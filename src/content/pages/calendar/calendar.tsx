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

export const CalendarPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const events = extractEvents(content);

    const calendarRef = React.createRef<FullCalendar>();

    return (
        <div className="page-container">
            <div className="!mt-0 not-prose">
                <FullCalendar
                    ref={calendarRef}
                    locale={daLocale}
                    plugins={[luxonPlugin, timeGridPlugin]}
                    initialView={window.innerWidth >= 768 ? 'timeGridWeek' : 'timeGridDay'}
                    initialDate={events.interval?.start?.toJSDate() ?? DateTime.now().toJSDate()}
                    events={events.events}
                    eventDidMount={(args) => {
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
                    titleFormat={'Uge W, yyyy'}
                    headerToolbar={{
                        left: 'title',
                        right: 'prev,next',
                    }}
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
                    // datesSet={(args) => {
                    //     if (args.view.currentStart === events.interval?.start?.toJSDate() ?? DateTime.now().toJSDate())
                    //         return;
                    //     const date = DateTime.fromJSDate(args.view.currentStart);
                    //     const url = linkToCalendarDate(window.location, date);
                    //     console.log(
                    //         window.location.pathname,
                    //         date,
                    //         events.interval?.start?.toJSDate() ?? DateTime.now().toJSDate(),
                    //         url,
                    //     );
                    //     if (window.location.pathname !== url) {
                    //         window.location.href = url;
                    //     }
                    // }}
                    nowIndicator
                />
            </div>
        </div>
    );
};

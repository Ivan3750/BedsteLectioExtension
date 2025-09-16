import React, { useState, useEffect, useRef } from 'react';
import luxonPlugin from '@fullcalendar/luxon3';
import timeGridPlugin from '@fullcalendar/timegrid';
import daLocale from '@fullcalendar/core/locales/da';
import FullCalendar from '@fullcalendar/react';
import { extractEvents } from './extractor';
import { DateTime } from 'luxon';
import { toTitleCase } from 'utils/string';
import { cn } from 'utils/cn';
import { Button } from 'components/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import tippy from 'tippy.js';
import { sanitize } from 'dompurify';

export const CalendarPage = () => {
    const calendarRef = useRef<FullCalendar>(null);

    // --- Поточний тиждень / week з URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const weekParam = urlParams.get('week');
    const initialDate: DateTime = weekParam && weekParam.length >= 5
        ? DateTime.fromObject({
            weekYear: parseInt(weekParam.slice(-4)),
            weekNumber: parseInt(weekParam.slice(0, weekParam.length - 4)),
            weekday: 1
        }, { zone: 'local' })
        : DateTime.local();

    const [currentDate, setCurrentDate] = useState(initialDate);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Функція fetch для потрібного тижня ---
    const fetchWeek = async (week: string) => {
        const url = `https://www.lectio.dk/lectio/305/SkemaNy.aspx?week=${week}`;
        const res = await fetch(url, { method: 'GET', credentials: 'include' });
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return doc;
    };

    // --- Підвантаження подій при зміні currentDate ---
    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            const weekString = `${currentDate.weekNumber}${currentDate.year}`;
            const doc = await fetchWeek(weekString);
            const extracted = extractEvents(doc, currentDate);
            setEvents(extracted.events);
            setLoading(false);

            // Перемістити календар на потрібну дату
            if (calendarRef.current) {
                calendarRef.current.getApi().gotoDate(currentDate.toJSDate());
            }
        };

        loadEvents();
    }, [currentDate]);

    // --- Оновлення URL без перезавантаження ---
    const updateURL = (date: DateTime) => {
        const weekParam = `${date.weekNumber}${date.year}`;
        const url = new URL(document.location.href);
        url.searchParams.set('week', weekParam);
        if (document.location.href !== url.toString()) {
            window.history.pushState({}, '', url.toString());
        }
    };

    // --- Навігація ---
    const goToToday = () => {
        const today = DateTime.local();
        setCurrentDate(today);
        updateURL(today);
    };

    const goToPreviousWeek = () => {
        const prev = currentDate.minus({ weeks: 1 });
        setCurrentDate(prev);
        updateURL(prev);
    };

    const goToNextWeek = () => {
        const next = currentDate.plus({ weeks: 1 });
        setCurrentDate(next);
        updateURL(next);
    };

    return (
        <div className="page-container">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="!m-0">
                    Skema (Uge {currentDate.weekNumber}, {currentDate.year})
                </h1>
                <div className="flex space-x-2">
                    {!currentDate.hasSame(DateTime.local(), 'week') && (
                        <Button onClick={goToToday}>I dag</Button>
                    )}
                    <Button onClick={goToPreviousWeek}>
                        <ChevronsLeft />
                    </Button>
                    <Button onClick={goToNextWeek}>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : null}

            <div className="!mt-0 not-prose">
                <FullCalendar
                    key={currentDate.toISODate()}
                    ref={calendarRef}
                    locale={daLocale}
                    plugins={[luxonPlugin, timeGridPlugin]}
                    initialView={window.innerWidth >= 768 ? 'timeGridWeek' : 'timeGridDay'}
                    initialDate={currentDate.toJSDate()}
                    events={events}
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
                                            todayClasses
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

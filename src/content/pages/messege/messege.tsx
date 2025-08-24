import React from 'react';
import { extractMessages } from './extractor';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from 'components/card';
import { RelativeTime } from 'components/relative-time';
import { DateTime } from 'luxon';

export const MessagesPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const messages = extractMessages(content);
    const schoolId = getSchoolIdFromDocument(content);

    return (
        <div className="page-container">
            <div>
                <h1 className="mb-2">Beskeder</h1>
                {messages.map((msg, i) => {
                    const fallbackUrl = buildThreadUrlFromOnClick(msg.link, schoolId);

                    return (
                        <div className="!mb-2" key={i}>
                            <a
                                href="#"
                                className="!no-underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    triggerLectioPostBack(msg.link, fallbackUrl);
                                }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {msg.subject}
                                            {msg.unread && <span className="ml-2 text-red-500">●</span>}
                                            {msg.flagged && <span className="ml-2 text-yellow-500">⚑</span>}
                                        </CardTitle>
                                        <CardDescription>
                                            <span className="mr-2">{msg.from}</span>
                                            <RelativeTime date={parseMessageTime(msg.time)} />
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <p className="!m-0 text-sm text-gray-500">Til: {msg.to}</p>
                                    </CardFooter>
                                </Card>
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ---------- helpers ----------

// універсальний postback
export const doPostBack = (eventTarget: string, eventArgument: string) => {
    const form = (document.forms.namedItem('aspnetForm') || (document as any).aspnetForm) as HTMLFormElement | null;
    if (!form) return;

    // виконуємо submit лише якщо onsubmit не забороняє
    if (!form.onsubmit) {
        const eventTargetInput = getOrCreateHidden(form, '__EVENTTARGET');
        const eventArgumentInput = getOrCreateHidden(form, '__EVENTARGUMENT');

        eventTargetInput.value = eventTarget;
        eventArgumentInput.value = eventArgument;

        form.submit();
    }
};

// виклик або реального postback, або fallback URL
function triggerLectioPostBack(onClickRaw?: string, fallbackUrl?: string) {
    if (onClickRaw) {
        const m = onClickRaw.match(/__doPostBack\('([^']*)','([^']*)'\)/);
        if (m) {
            const [, target, argument] = m;
            doPostBack(target, argument);
            return;
        }
    }
    if (fallbackUrl) window.location.href = fallbackUrl;
}

// побудувати робочий URL треду
function buildThreadUrlFromOnClick(onClickRaw: string | undefined, schoolId: string): string | undefined {
    if (!onClickRaw) return undefined;
    const id = extractThreadId(onClickRaw);
    if (!id) return undefined;

    const origin = window.location.origin;
    return `${origin}/lectio/${schoolId}/beskeder2.aspx?type=showthread&threadid=${id}`;
}

// витягнути threadId
function extractThreadId(s: string): string | null {
    const m1 = s.match(/\$_MC_\$_(\d+)/);
    if (m1) return m1[1];
    const m2 = s.match(/VIEWTHREAD_(\d+)/);
    if (m2) return m2[1];
    return null;
}

// витягнути schoolId з URL
function getSchoolIdFromDocument(doc: Document): string {
    try {
        const u = new URL(doc.baseURI || (doc as any).URL || window.location.href);
        const parts = u.pathname.split('/').filter(Boolean);
        const i = parts.findIndex((p) => p.toLowerCase() === 'lectio');
        if (i !== -1 && parts[i + 1]) return parts[i + 1];
    } catch {}
    return '';
}

// парсер часу "HH:mm"
function parseMessageTime(time?: string): Date {
    if (!time) return DateTime.local().toJSDate();
    const parts = time.split(':');
    if (parts.length !== 2) return DateTime.local().toJSDate();
    const [h, m] = parts.map((n) => Number(n));
    if (isNaN(h) || isNaN(m)) return DateTime.local().toJSDate();
    return DateTime.local().set({ hour: h, minute: m }).toJSDate();
}

// створити hidden input, якщо його нема
const getOrCreateHidden = (form: HTMLFormElement, name: string): HTMLInputElement => {
    let input = form.querySelector<HTMLInputElement>(`#${name}`);
    if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.id = name;
        form.appendChild(input);
    }
    return input;
};

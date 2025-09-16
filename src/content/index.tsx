import React from 'react';
import ReactDOM from 'react-dom/client';
import { HomePage } from './pages/home';
import { ThemeProvider } from 'components/theme-provider';
import { isLocationSupported, toPageKey } from 'utils/page';
import { SiteHeader } from 'components/site-header';
import { CalendarPage } from './pages/calendar';
import { createEnableButton } from './content';
import { AssignmentsPage } from './pages/assignments';
import { AssignmentTaskPage } from './pages/assignments_task';
import { LectioPage } from './pages/lectio';
import { SchoolProvider } from 'components/school-provider';
import { HomeworkPage } from './pages/homework';
import { DocumentPage } from './pages/documents';
import { AbsenceOverviewPage } from './pages/absence/overview';
import { AbsenceReasonsPage } from './pages/absence/reasons';
import { TaskPage } from './pages/homework/task';
import { MessagesPage } from './pages/messege/messege';
import { MessagesPageOpen } from './pages/messege/message_open/messege';
import favicon from '../assets/icons/favicon.png';

const Main = (props: { page: JSX.Element }) => {
    return (
        <ThemeProvider>
            <SchoolProvider>
                <SiteHeader />
                <div className="prose dark:prose-invert marker:prose-li:text-black dark:marker:prose-li:text-white max-w-none">
                    {props.page}
                </div>
            </SchoolProvider>
        </ThemeProvider>
    );
};

if (localStorage.getItem('bedstelectio-disabled')) {
    const button = createEnableButton();
    (document.querySelector('#m_mastermenu') ?? document.querySelector('#s_m_mastermenu'))
        ?.querySelector('div')
        ?.appendChild(button);
    console.info('Bedstelectio is disabled');
    console.info('To re-enable, click "Aktivér BedsteLectio" in the top menubar.');
} else {
    if (isLocationSupported(document.location)) {
        require('./content.css');
        const originalContent = document.cloneNode(true) as Document;

        // Clean up the page
        for (const t of ['style', 'link']) {
            for (const i of Array.from(document.getElementsByTagName(t))) {
                if (i.parentElement && !i.innerHTML.includes('tailwind')) {
                    i.remove();
                }
            }
        }

        document.documentElement.classList.value = '';

        const body = document.createElement('body');
        const app = document.createElement('div');
        app.id = 'bedstelectio-app';
        body.append(app);
        document.body.replaceWith(body);
        const root = ReactDOM.createRoot(app);
        let page: JSX.Element = <div />;
        switch (toPageKey(document.location)) {
            case 'lectioroot': {
                location.href = 'https://www.lectio.dk/lectio/login_list.aspx';
                break;
            }
            case 'lectio': {
                page = <LectioPage originalContent={originalContent} />;
                break;
            }
            case 'home': {
                page = <HomePage originalContent={originalContent} />;
                break;
            }
            case 'calendar': {
                page = <CalendarPage originalContent={originalContent} />;
                break;
            }
            case 'assignments': {
                page = <AssignmentsPage originalContent={originalContent} />;
                break;
            }
            case 'assignments_task': {
                page = <AssignmentTaskPage originalContent={originalContent} />;
                break;
            }
            case 'homework': {
                page = <HomeworkPage originalContent={originalContent} />;
                break;
            }
            case 'task': {
                page = <TaskPage originalContent={originalContent} />;
                break;
            }
            case 'absence_overview': {
                page = <AbsenceOverviewPage originalContent={originalContent} />;
                break;
            }
            case 'absence_reasons': {
                page = <AbsenceReasonsPage originalContent={originalContent} />;
                break;
            }
            case 'documents': {
                page = <DocumentPage originalContent={originalContent} />;
                break;
            }
            case 'messege': {
                page = <MessagesPage originalContent={originalContent} />;
                break;
            }
            case 'messege_open': {
                page = <MessagesPageOpen originalContent={originalContent} />;
                break;
            }
            default: {
                page = <div>Not found</div>;
                break;
            }
        }

        root.render(<Main page={page} />);
    } else {
        require('./lectio/base.css');
        if ((localStorage.getItem('bedstelectio-theme') ?? '') === 'dark') {
            // "system" theme TBA
            require('./lectio/dark.css');
        }
    }
}
function setFavicon(url: string): void {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = url;
}

// Виклик:
setFavicon(favicon);

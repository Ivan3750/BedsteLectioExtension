import React from 'react';
import ReactDOM from 'react-dom/client';
import { HomePage } from './pages/home';
import { ThemeProvider } from 'components/theme-provider';
import { isLocationSupported, toPageKey } from 'utils/page';
import { SiteHeader } from 'components/site-header';
import { CalendarPage } from './pages/calendar';
import { createEnableButton } from './content';

const Main = (props: { page: JSX.Element }) => (
    <ThemeProvider>
        <SiteHeader />
        <div className="prose dark:prose-invert marker:prose-li:text-black dark:marker:prose-li:text-white max-w-none">
            {props.page}
        </div>
    </ThemeProvider>
);

const Basic = (props: { originalContent: Document }) => {
    const content =
        props.originalContent.querySelector('#contenttable')?.outerHTML ?? props.originalContent.body.innerHTML;
    return (
        <ThemeProvider>
            <SiteHeader />
            <div className="page-container" dangerouslySetInnerHTML={{ __html: content }} />
        </ThemeProvider>
    );
};

if (localStorage.getItem('bedstelectio-disabled')) {
    const button = createEnableButton();
    (document.querySelector('#m_mastermenu') ?? document.querySelector('#s_m_mastermenu'))
        ?.querySelector('div')
        ?.appendChild(button);
    console.info('Bedstelectio is disabled');
    console.info('To re-enable, click "Enable BedsteLectio" in the top menubar.');
} else {
    require('./content.css');
    if (isLocationSupported(document.location)) {
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
        let page: JSX.Element;
        switch (toPageKey(document.location)) {
            case 'home': {
                page = <HomePage originalContent={originalContent} />;
                break;
            }
            case 'calendar': {
                page = <CalendarPage originalContent={originalContent} />;
                break;
            }
            default: {
                page = <div>Not found</div>;
                break;
            }
        }

        root.render(<Main page={page} />);
    } else if (!document.location.pathname.includes('/login.aspx')) {
        require('./content.css');
        const originalContent = document.cloneNode(true) as Document;
        const body = document.createElement('body');
        const app = document.createElement('div');
        app.id = 'bedstelectio-app';
        body.append(app);
        document.body.replaceWith(body);
        const root = ReactDOM.createRoot(app);
        root.render(<Basic originalContent={originalContent} />);
    }
}

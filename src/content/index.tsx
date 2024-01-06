import React from 'react';
import ReactDOM from 'react-dom/client';

import './content.css';
import { ThemeProvider } from 'components/theme-provider';
import { isLocationSupported, toPageKey } from 'utils/page';
import { SiteHeader } from 'components/site-header';
import { Home } from './pages/home';

const Main = (props: { page: JSX.Element }) => {
    return (
        <ThemeProvider>
            <SiteHeader />
            <div className="prose dark:prose-invert marker:prose-li:text-black dark:marker:prose-li:text-white max-w-none">
                {props.page}
            </div>
        </ThemeProvider>
    );
}

const Basic = (props: { originalContent: Document }) => {
    const content =
        props.originalContent.getElementById('contenttable')?.outerHTML ?? props.originalContent.body.innerHTML;
    return (
        <ThemeProvider>
            <SiteHeader />
            <div className='page-container' dangerouslySetInnerHTML={{ __html: content }} />
        </ThemeProvider>
    );
};

if (isLocationSupported(document.location)) {
    const originalContent = document.cloneNode(true) as Document;

    // Clean up the page
    ['style', 'link'].forEach((t) =>
        Array.from(document.getElementsByTagName(t)).forEach((i) => {
            if (i.parentElement && !i.innerHTML.includes('tailwind')) {
                i.parentElement.removeChild(i);
            }
        }),
    );
    document.documentElement.classList.value = '';

    const body = document.createElement('body');
    const app = document.createElement('div');
    app.id = 'bedstelectio-app';
    body.appendChild(app);
    document.body.replaceWith(body);
    const root = ReactDOM.createRoot(app);
    let page: JSX.Element;
    switch (toPageKey(document.location)) {
        case 'home':
            page = <Home originalContent={originalContent} />;
            break;
        default:
            page = <div>Not found</div>;
            break;
    }
    root.render(<Main page={page} />);
} else if (!document.location.pathname.includes('/login.aspx')) {
    const originalContent = document.cloneNode(true) as Document;
    const body = document.createElement('body');
    const app = document.createElement('div');
    app.id = 'bedstelectio-app';
    body.appendChild(app);
    document.body.replaceWith(body);
    const root = ReactDOM.createRoot(app);
    root.render(<Basic originalContent={originalContent} />);
}

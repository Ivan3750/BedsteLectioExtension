import React from 'react';
import ReactDOM from 'react-dom/client';

import './content.css';
import { Button } from 'components/button';
import { ThemeProvider } from 'components/theme-provider';
import { ThemeToggle } from 'components/theme-toggle';
import { isLocationSupported } from 'utils/page';

class Main extends React.Component {
    render() {
        return (
            <ThemeProvider>
                <div className="container mx-auto">
                    <ThemeToggle />
                    <Button asChild>
                        <a href="/lectio/681/SkemaNy.aspx">Hello World!</a>
                    </Button>
                </div>
            </ThemeProvider>
        );
    }
}

const Basic = (props: { originalContent: Document }) => {
    const content =
        props.originalContent.getElementById('contenttable')?.outerHTML ?? props.originalContent.body.innerHTML;
    return (
        <ThemeProvider>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </ThemeProvider>
    );
};

if (isLocationSupported(document.location)) {
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
    root.render(<Main />);
} else {
    const originalContent = document.cloneNode(true) as Document;
    const body = document.createElement('body');
    const app = document.createElement('div');
    app.id = 'bedstelectio-app';
    body.appendChild(app);
    document.body.replaceWith(body);
    const root = ReactDOM.createRoot(app);
    root.render(<Basic originalContent={originalContent} />);
}

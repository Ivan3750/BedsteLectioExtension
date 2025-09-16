import React from 'react';
import { extractThreadMessages } from './extractor';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from 'components/card';
import { RelativeTime } from 'components/relative-time';

export const MessagesPageOpen = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const messages = extractThreadMessages(content);

    return (
        <div className="page-container">
            <h1 className="mb-4">Beskedtråd</h1>
            {messages.map((msg, i) => (
                <div className="!mb-3" key={i}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{msg.subject || 'Uden emne'}</CardTitle>
                            <CardDescription>
                                <span className="mr-2 font-medium">{msg.from}</span>
                                <RelativeTime date={new Date(msg.time)} />
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
};

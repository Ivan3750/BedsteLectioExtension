import React from 'react';

import { extractDocuments } from './extractor';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from 'components/card';
import { RelativeTime } from 'components/relative-time';
import { DateTime } from 'luxon';

export const DocumentPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const documents = extractDocuments(content);

    return (
        <div className="page-container">
            <div>
                <h1 className="mb-2">Documents</h1>
                {documents.map((doc, i) => (
                    <div className="!mb-2" key={i}>
                        <a href={doc.link} className="!no-underline">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{doc.title}</CardTitle>
                                    <CardDescription>
                                        Uploaded by {doc.uploadedBy} ·{' '}
                                        <RelativeTime
                                            date={DateTime.fromFormat(doc.uploadedAt, 'd/M yyyy HH:mm').toJSDate()}
                                        />
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <p className="!m-0 text-sm text-gray-500">{doc.link}</p>
                                </CardFooter>
                            </Card>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

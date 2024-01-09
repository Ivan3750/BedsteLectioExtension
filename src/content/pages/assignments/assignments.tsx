import React, { useState } from 'react';

import { extractAssignments } from './extractor';
import { Tabs, useTabs } from 'components/tabs';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from 'components/card';
import { Badge } from 'components/badge';
import { RelativeTime } from 'components/relative-time';

export const AssignmentsPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const assignments = extractAssignments(content);

    const [tabProps] = useState({
        tabs: Object.entries(assignments).map((tab) => ({
            label: tab[0],
            children: (
                <div>
                    {tab[1].length ? (
                        tab[1].map((assignment) => (
                            <div key={assignment.exerciseId} className="not-prose">
                                <a href={assignment.link}>
                                    <Card className="mb-4">
                                        <CardHeader>
                                            <CardTitle>{assignment.title}</CardTitle>
                                            <CardDescription>{assignment.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <Badge>
                                                <RelativeTime date={assignment.date.toJSDate()} />
                                            </Badge>
                                        </CardFooter>
                                    </Card>
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>Ingen {tab[0].toLowerCase()} opgaver.</p>
                    )}
                </div>
            ),
            id: tab[0],
        })),
        initialTabId: 'Kommende',
    });
    const tabs = useTabs(tabProps);

    return (
        <div className="page-container">
            <div className="space-y-4">
                <h1>Assignments</h1>
                <div className="flex justify-between">
                    <Tabs {...tabs.tabProps} />
                    {/* TODO: Lmao */}
                    {/* <Input className="max-w-64" placeholder="Søg efter opgaver..." /> */}
                </div>
                {tabs.selectedTab.children}
            </div>
        </div>
    );
};

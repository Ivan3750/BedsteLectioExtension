import React from 'react';

import { extractAbsence } from './extractor';

export const AbsenceOverviewPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const absence = extractAbsence(content);

    return (
        <div className="page-container">
            <div>
                <h1 className="mb-2">Fraværsoversigt</h1>
            </div>
        </div>
    );
};

import React from 'react';

import { extractAbsence } from './extractor';

export const AbsenceReasonsPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const absence = extractAbsence(content);

    return (
        <div className="page-container">
            <div>
                <h1 className="mb-2">Fraværsårsager</h1>
            </div>
        </div>
    );
};

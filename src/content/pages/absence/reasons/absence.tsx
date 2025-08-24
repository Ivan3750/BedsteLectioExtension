import React from 'react';
import { extractAbsence } from './extractor';

export const AbsenceReasonsPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const absence = extractAbsence(content);

    return (
        <div className="page-container">
            <div>
                <h1 className="mb-4 text-xl font-semibold">Fraværsårsager</h1>
            </div>

            {/* Samlet fravær */}
            <section className="mb-6">
                <h2 className="font-medium mb-2">Samlet fravær</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[white] dark:bg-black  border p-4 shadow-sm">
                        <p className="text-gray-500">Almindeligt fravær</p>
                        <p className="text-lg font-bold">{absence.summary.normal}</p>
                    </div>
                    <div className="rounded-xl  bg-[white] dark:bg-black border p-4 shadow-sm">
                        <p className="text-gray-500">Skriftligt fravær</p>
                        <p className="text-lg font-bold">{absence.summary.written}</p>
                    </div>
                </div>
            </section>

            {/* Manglende fraværsårsager */}
            <section className="mb-6">
                <h2 className="font-medium mb-2">Manglende fraværsårsager</h2>
                {absence.missing.length > 0 ? (
                    <ul className="list-disc pl-6 space-y-1">
                        {absence.missing.map((m, i) => (
                            <li key={i}>{m}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Ingen manglende fraværsårsager.</p>
                )}
            </section>

            {/* Fraværsregistreringer */}
            <section>
                <h2 className="font-medium mb-2">Fraværsregistreringer</h2>
                {absence.registrations.length > 0 ? (
                    <ul className="list-disc pl-6 space-y-1">
                        {absence.registrations.map((r, i) => (
                            <li key={i}>{r}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Ingen fraværsregistreringer.</p>
                )}
            </section>
        </div>
    );
};

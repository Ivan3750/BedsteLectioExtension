import React from 'react';
import { extractAbsence } from './extractor';

export const AbsenceOverviewPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const absence = extractAbsence(content);

    return (
        <div className="page-container p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="mb-4">
                <h1 className="text-2xl font-bold mb-4">Fraværsoversigt</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300 dark:border-gray-700 w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="border px-3 py-2 text-left">Hold</th>
                            <th className="border px-3 py-2">Opgjort %</th>
                            <th className="border px-3 py-2">Opgjort moduler</th>
                            <th className="border px-3 py-2">Året %</th>
                            <th className="border px-3 py-2">Året moduler</th>
                            <th className="border px-3 py-2">Skriftligt %</th>
                            <th className="border px-3 py-2">Skriftligt tid</th>
                            <th className="border px-3 py-2">Året skriftligt %</th>
                            <th className="border px-3 py-2">Året skriftligt tid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {absence.map((row, idx) => {
                            const isLastRow = row.subject === 'Samlet'; // або інша умова
                            return (
                                <tr
                                    key={idx}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                        isLastRow ? 'font-semibold bg-gray-200 dark:bg-gray-800' : ''
                                    }`}
                                >
                                    <td className="border px-3 py-2">
                                        {row.link ? (
                                            <a
                                                href={row.link}
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {row.subject}
                                            </a>
                                        ) : (
                                            row.subject
                                        )}
                                    </td>
                                    <td className="border px-3 py-2">{row.normal.percent}</td>
                                    <td className="border px-3 py-2">{row.normal.modules}</td>
                                    <td className="border px-3 py-2">{row.yearly.percent}</td>
                                    <td className="border px-3 py-2">{row.yearly.modules}</td>
                                    <td className="border px-3 py-2">{row.written.percent}</td>
                                    <td className="border px-3 py-2">{row.written.time}</td>
                                    <td className="border px-3 py-2">{row.yearlyWritten.percent}</td>
                                    <td className="border px-3 py-2">{row.yearlyWritten.time}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

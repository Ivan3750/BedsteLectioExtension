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

            <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left">Hold</th>
                        <th className="border px-2 py-1">Opgjort %</th>
                        <th className="border px-2 py-1">Opgjort moduler</th>
                        <th className="border px-2 py-1">Året %</th>
                        <th className="border px-2 py-1">Året moduler</th>
                        <th className="border px-2 py-1">Skriftligt %</th>
                        <th className="border px-2 py-1">Skriftligt tid</th>
                        <th className="border px-2 py-1">Året skriftligt %</th>
                        <th className="border px-2 py-1">Året skriftligt tid</th>
                    </tr>
                </thead>
                <tbody>
                    {absence.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">
                                {row.link ? (
                                    <a
                                        href={row.link}
                                        className="text-blue-600 hover:underline"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {row.subject}
                                    </a>
                                ) : (
                                    row.subject
                                )}
                            </td>
                            <td className="border px-2 py-1">{row.normal.percent}</td>
                            <td className="border px-2 py-1">{row.normal.modules}</td>
                            <td className="border px-2 py-1">{row.yearly.percent}</td>
                            <td className="border px-2 py-1">{row.yearly.modules}</td>
                            <td className="border px-2 py-1">{row.written.percent}</td>
                            <td className="border px-2 py-1">{row.written.time}</td>
                            <td className="border px-2 py-1">{row.yearlyWritten.percent}</td>
                            <td className="border px-2 py-1">{row.yearlyWritten.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

import React from 'react';
import { extractAssignment } from './extractor'; // ✅ правильна назва
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'components/card';
import { Badge } from 'components/badge';
import { RelativeTime } from 'components/relative-time';
import { DateTime } from 'luxon';

export const AssignmentTaskPage = (props: { originalContent: Document }) => {
    const assignment = extractAssignment(props.originalContent);

    return (
        <div className="page-container">
            <div className="space-y-6">
                {/* Назва завдання */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">{assignment.title}</CardTitle>
                        <CardDescription>
                            Afleveringsfrist:{' '}
                            {assignment.deadline ? (
                                <Badge variant="secondary">
                                    <RelativeTime date={assignment.deadline.toJSDate()} />
                                </Badge>
                            ) : (
                                'Ukendt'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-gray-600">
                        <p>
                            <strong>Hold:</strong> {assignment.className}
                        </p>
                        <p>
                            <strong>Ansvarlig:</strong> {assignment.teacher}
                        </p>
                        <p>
                            <strong>Karakterskala:</strong> {assignment.gradeScale}
                        </p>
                        <p>
                            <strong>Elevtid:</strong> {assignment.studentTime}
                        </p>
                        {assignment.note && (
                            <p>
                                <strong>Note:</strong> {assignment.note}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Документи */}
                {assignment.descriptionFiles.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Opgavebeskrivelse</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {assignment.descriptionFiles.map((file, i) => (
                                <a
                                    key={i}
                                    href={file.link}
                                    className="block p-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                    📄 {file.name}
                                </a>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Групові учасники */}
                {assignment.groupMembers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Gruppemedlemmer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1">
                                {assignment.groupMembers.map((member, i) => (
                                    <li key={i}>{member}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Сабмішени */}
                {assignment.submissions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Afleveringer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {assignment.submissions.map((sub, i) => (
                                <div key={i} className="p-3 border rounded-lg space-y-1">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{sub.user}</span>
                                        <span>
                                            {sub.time.isValid ? sub.time.toLocaleString(DateTime.DATETIME_SHORT) : ''}
                                        </span>
                                    </div>
                                    {sub.comment && <p className="text-gray-700">{sub.comment}</p>}
                                    {sub.file && (
                                        <a href={sub.file.link} className="text-blue-600 hover:underline">
                                            📎 {sub.file.name}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

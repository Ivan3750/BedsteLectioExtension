import React, { useState } from "react";
import { extractAssignment, AssignmentDetails } from "./extractor";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "components/card";
import { Badge } from "components/badge";
import { RelativeTime } from "components/relative-time";
import { DateTime } from "luxon";

interface AssignmentTaskPageProps {
    originalContent: Document;
}

// 🔹 Хелпер для postback
async function doPostBack(
    originalContent: Document,
    eventTarget: string,
    eventArgument: string,
    extraFields: Record<string, string> = {}
): Promise<Document> {
    const formData = new URLSearchParams();

    // зберемо всі hidden inputs
    originalContent
        .querySelectorAll<HTMLInputElement>("input[type=hidden]")
        .forEach((input) => {
            if (input.name) {
                formData.append(input.name, input.value ?? "");
            }
        });

    // ASP.NET спецполя
    formData.set("__EVENTTARGET", eventTarget);
    formData.set("__EVENTARGUMENT", eventArgument);

    // додаткові поля (наприклад, studentId)
    for (const [key, val] of Object.entries(extraFields)) {
        formData.set(key, val);
    }

    const response = await fetch(window.location.href, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const text = await response.text();
    return new DOMParser().parseFromString(text, "text/html");
}

export const AssignmentTaskPage: React.FC<AssignmentTaskPageProps> = ({
    originalContent,
}) => {
    const [assignment, setAssignment] = useState<AssignmentDetails>(
        extractAssignment(originalContent)
    );

    const handleAddToGroup = async (studentId: string) => {
        const newDoc = await doPostBack(
            originalContent,
            "m$Content$groupStudentAddBtn",
            "",
            { "m$Content$groupStudentAddDD": studentId }
        );

        // оновлюємо assignment зі свіжого HTML
        setAssignment(extractAssignment(newDoc));
    };

    return (
        <div className="page-container">
            <div className="space-y-6">
                {/* Назва завдання */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {assignment.title}
                        </CardTitle>
                        <CardDescription>
                            Afleveringsfrist:{" "}
                            {assignment.deadline ? (
                                <Badge variant="secondary">
                                    <RelativeTime date={assignment.deadline.toJSDate()} />
                                </Badge>
                            ) : (
                                "Ukendt"
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

                {/* Форма додавання до групи */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tilføj til gruppeaflevering</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select id="groupStudentSelect" className="border p-2 rounded">
                            <option value="">Vælg elev</option>
                            {assignment.groupAddOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.name}
                                </option>
                            ))}
                        </select>
                        <button
                            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => {
                                const select = document.getElementById(
                                    "groupStudentSelect"
                                ) as HTMLSelectElement | null;
                                const studentId = select?.value;
                                if (studentId) handleAddToGroup(studentId);
                            }}
                        >
                            Tilføj
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

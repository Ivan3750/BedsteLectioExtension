import React from 'react';
import { extractMessages, parseMessageTime } from './extractor';
import { Card } from 'components/card';
import { RelativeTime } from 'components/relative-time';
import { FaFlag, FaCircle } from 'react-icons/fa';

export const MessagesPage = (props: { originalContent: Document }) => {
    const content = props.originalContent;
    const messages = extractMessages(content);

    return (
        <div className="page-container max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Beskeder</h1>
            <div className="space-y-3">
                {messages.map((msg, i) => (
                    <a
                        key={i}
                        href={msg.link}
                        className="block transform transition hover:scale-[1.01] hover:shadow-lg"
                    >
                        <Card
                            className={`flex items-center border rounded-lg overflow-hidden p-3 shadow-sm hover:shadow-md transition 
                                ${msg.unread ? 'bg-gray-50' : 'bg-white'}`}
                        >
                            {/* Аватарка */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 text-sm">
                                {msg.from[0].toUpperCase()}
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* Тема і іконки */}
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2 text-gray-800 font-semibold text-md truncate">
                                        {msg.subject}
                                        {msg.unread && <FaCircle className="text-red-500 text-xs" />}
                                        {msg.flagged && <FaFlag className="text-yellow-500 text-xs" />}
                                    </div>
                                    <span className="text-gray-400 text-xs">
                                        <RelativeTime date={parseMessageTime(msg.time)} />
                                    </span>
                                </div>

                                {/* Інформація про відправника та отримувача */}
                                <div className="text-gray-600 text-sm truncate">
                                    Fra: <span className="font-medium">{msg.from}</span> &nbsp;|&nbsp; Til: <span className="font-medium">{msg.to}</span>
                                </div>
                            </div>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    );
};

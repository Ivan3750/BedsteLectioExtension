import { Calendar } from "lucide-react";
import React from "react";
import { cn } from "utils/cn";

const Timeline = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(({ className, ...props }, ref) => (
    <ol ref={ref} className={cn("relative border-l border-gray-200 dark:border-gray-700 list-none", className)} {...props} />
))
Timeline.displayName = "Timeline";

const TimelineItem = ({ className, cancelled, color, textColor, title, titleNote, time, description, link }: {
    className: string;
    cancelled: boolean;
    color: string;
    textColor: string;
    title: string;
    titleNote: string;
    time: string;
    description: string;
    link: string;
}) => {
    return (
        <li className={className}>
            <a className="no-underline" href={link}>
                <span style={{ color: textColor, backgroundColor: color }} className="absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-0">
                    <Calendar className="w-4 h-4" />
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    <span className={cancelled ? "line-through" : ""}>{title}</span>
                    {titleNote && <span style={{ color: textColor, backgroundColor: color }} className="hidden lg:block max-w-xs whitespace-nowrap overflow-hidden overflow-ellipsis text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">{titleNote}</span>}
                </h3>
                {!cancelled && (
                    <>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{time}</time>
                        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                        </p>
                    </>
                )}
            </a>
        </li>
    );
};
TimelineItem.displayName = "TimelineItem";

export { Timeline, TimelineItem };
import { cn } from "@/lib/utils";
import React from "react";

export default function TitleSection({ title, textSize }: { title: string, textSize?: string }): React.JSX.Element {
    return (
        <div className="flex flex-col gap-1 max-w-fit">
            <div className={cn(textSize ? textSize : "text-2xl")}>{ title }</div>
            <div className="w-full bg-neutral-800 h-[2px]"></div>
        </div>
    )
}
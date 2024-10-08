"use client"

import React, { ElementType } from "react";
import { usePathname } from "next/navigation";

import clsx from "clsx";
import toast from "react-hot-toast";

import { FaLink } from "react-icons/fa6";

type Variant =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "body"
    | "body-small"
    | "small";

interface Props {
    variant: Variant;
    children: React.ReactNode;
    className?: string;
    as?: ElementType;
    id?: string;
    link?: boolean
}

const tags: Record<Variant, ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    body: "p",
    "body-small": "p",
    small: "span",
};

const sizes: Record<Variant, string> = {
    h1: "text-3xl font-bold font-ubuntu sm:text-5xl",
    h2: "text-2xl font-bold font-ubuntu sm:text-4xl",
    h3: "text-xl font-bold font-ubuntu sm:text-3xl",
    h4: "text-lg font-bold font-ubuntu sm:text-2xl",
    h5: "text-md font-bold font-ubuntu sm:text-lg",
    body: "text-md sm:text-lg",
    "body-small": "font-ubuntu text-sm sm:text-sm",
    small: "font-ubuntu text-sm sm:text-xs",
};

const Heading = ({ variant, children, className, as, id, link }: Props) => {
    const sizeClasses = sizes[variant];
    const Tag = as || tags[variant];
    const linkId = id ? `#${id}` : undefined;

    const path = usePathname();

    const tagClassName = clsx(
        "pr-4",
        className,
        sizeClasses,
        link && 'hover:underline'
    );

    const vercelUrl = process.env.VERCEL_URL;
    const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'http';
    const baseUrl = vercelUrl ? `${protocol}://${vercelUrl}` : 'http://localhost:3000';

    return (
        <div className={`${linkId && link && path && "relative group flex items-center py-0.5"}`}>
            <Tag
                className={`${tagClassName} ${linkId && link && path && "relative group flex items-center py-1"}`}
                id={id}
            >
                {children}
            </Tag>

            {linkId && link && path && (
                <button
                    className="tooltip tooltip-left absolute -ml-10 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    data-tip="Copy link"
                    onClick={() => {
                        navigator.clipboard.writeText(baseUrl + path + linkId);
                        toast.success("Link copied to clipboard");
                    }}
                >
                    <FaLink className="h-6 w-6 cursor-pointer text-main hover:text-blue-600" />
                </button>
            )}
        </div>
    );
};

export type { Variant };
export default Heading
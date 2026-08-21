"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, MapPin } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-charcoal-muted overflow-x-auto py-1.5 whitespace-nowrap ${className}`}
    >
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center gap-1.5"
      >
        {/* Home Item */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center gap-1.5"
        >
          <Link
            href="/"
            itemProp="item"
            className="flex items-center gap-1 text-charcoal-muted hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 2;

          return (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5"
            >
              <ChevronRight className="w-3 h-3 text-surface-border shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  itemProp="item"
                  className="hover:text-primary hover:underline text-charcoal-muted transition-colors"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  itemProp="name"
                  className={`font-semibold ${
                    isLast ? "text-primary" : "text-charcoal"
                  }`}
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={position.toString()} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

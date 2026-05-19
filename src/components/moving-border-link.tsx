"use client";

import Link from "next/link";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";

export function MovingBorderLink({
  href,
  children,
  className,
  containerClassName,
  borderClassName,
  borderRadius,
  duration,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  borderRadius?: string;
  duration?: number;
}) {
  return (
    <MovingBorderButton
      as={Link}
      href={href}
      className={className}
      containerClassName={containerClassName}
      borderClassName={borderClassName}
      borderRadius={borderRadius}
      duration={duration}
    >
      {children}
    </MovingBorderButton>
  );
}

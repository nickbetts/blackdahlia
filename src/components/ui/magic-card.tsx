"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

interface MagicCardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
}

type ResetReason = "enter" | "leave" | "global" | "init"

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#e8e8e8",
  gradientOpacity = 0.8,
  gradientFrom = "#d4d4d4",
  gradientTo = "#f0f0f0",
}: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const gradientSizeRef = useRef(gradientSize)
  useEffect(() => { gradientSizeRef.current = gradientSize }, [gradientSize])

  const reset = useCallback((reason: ResetReason = "leave") => {
    if (reason !== "enter") {
      mouseX.set(-gradientSizeRef.current)
      mouseY.set(-gradientSizeRef.current)
    }
  }, [mouseX, mouseY])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  useEffect(() => { reset("init") }, [reset])

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => { if (!e.relatedTarget) reset("global") }
    const handleBlur = () => reset("global")
    const handleVisibility = () => { if (document.visibilityState !== "visible") reset("global") }
    window.addEventListener("pointerout", handleGlobalPointerOut)
    window.addEventListener("blur", handleBlur)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", handleBlur)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [reset])

  return (
    <motion.div
      className={cn(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => reset("leave")}
      onPointerEnter={() => reset("enter")}
      style={{
        background: useMotionTemplate`
          linear-gradient(var(--bg-950, #ffffff) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            rgba(0,0,0,0.08) 100%
          ) border-box
        `,
      }}
    >
      <div className="bg-(--bg-950) absolute inset-px z-20 rounded-[inherit]" />
      <motion.div
        suppressHydrationWarning
        className="pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 100%
            )
          `,
          opacity: gradientOpacity,
        }}
      />
      <div className="relative z-40">{children}</div>
    </motion.div>
  )
}

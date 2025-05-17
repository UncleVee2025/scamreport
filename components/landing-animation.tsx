"use client"

import type React from "react"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"

export function LandingAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative w-full h-48 bg-gradient-to-r from-blue-100 via-blue-50 to-green-100 rounded-xl overflow-hidden shadow-inner"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="flex gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedIcon icon={<Shield className="w-12 h-12 text-primary" />} label="Protect" delay={0.3} />
          <AnimatedIcon icon={<AlertTriangle className="w-12 h-12 text-amber-500" />} label="Report" delay={0.6} />
          <AnimatedIcon icon={<CheckCircle className="w-12 h-12 text-secondary" />} label="Verify" delay={0.9} />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 gradient-bg"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
    </div>
  )
}

function AnimatedIcon({ icon, label, delay }: { icon: React.ReactNode; label: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
      whileHover={{ scale: 1.1 }}
    >
      <div className="p-3 bg-white rounded-full shadow-md glass-effect">{icon}</div>
      <span className="font-medium text-gray-700">{label}</span>
    </motion.div>
  )
}

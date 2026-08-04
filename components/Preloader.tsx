"use client";
import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion'
import { completeIntro, isIntroPending } from '../lib/intro'

const LETTERS = ['D', 'E', 'V', 'S']

/**
 * Branded intro played once per full page load: the four DEVS letters rise
 * out of a mask while a counter runs 000 → 100, then the whole black curtain
 * lifts. Skipped entirely for reduced-motion users and on SPA route changes.
 */
function Preloader() {
  const reduceMotion = useReducedMotion()
  const [active] = useState(() => isIntroPending() && !reduceMotion)
  const [visible, setVisible] = useState(active)
  const [count, setCount] = useState(0)

  // If we're not playing (reduced motion), unblock content immediately.
  useEffect(() => {
    if (!active) completeIntro()
  }, [active])

  useEffect(() => {
    if (!active) return

    document.body.style.overflow = 'hidden'

    const counter = animate(0, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    })
    const hide = setTimeout(() => setVisible(false), 1.9 * 1000)

    return () => {
      counter.stop()
      clearTimeout(hide)
      document.body.style.overflow = ''
    }
  }, [active])

  if (!active) return null

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ''
        completeIntro()
      }}
    >
      {visible && (
        <motion.div
          key="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col justify-between border-4 border-[#2f3133] bg-black px-6 py-6 md:px-10 md:py-8"
          aria-hidden="true"
        >
          {/* Top meta row */}
          <div className="flex items-center justify-between font-press-start-2p text-[8px] uppercase tracking-widest text-zinc-400 md:text-[10px]">
            <span>DEVS Rec</span>
            <span>Chennai, IN</span>
          </div>

          {/* Center wordmark — letters rise out of a mask */}
          <div className="flex justify-center overflow-hidden pt-10">
            <div className="flex items-end gap-1 md:gap-2">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={letter}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.08,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className="font-press-start-2p text-[16vw] leading-[0.85] text-white md:text-9xl"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Bottom row — tagline + counter */}
          <div className="flex items-end justify-between">
            <span className="font-press-start-2p text-[8px] uppercase tracking-widest text-zinc-400 md:text-[10px]">
              Code. Coffee. Repeat.
            </span>
            <span className="font-press-start-2p text-3xl tabular-nums text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] md:text-6xl">
              {String(count).padStart(3, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader

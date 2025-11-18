'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import styles from './page.module.css'

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize Web Audio API for procedural audio generation
    const initAudio = () => {
      if (typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContext()
      }
    }
    initAudio()
  }, [])

  const playIndustrialBeat = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const duration = 15
    const now = ctx.currentTime

    // Resume audio context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Create master gain
    const masterGain = ctx.createGain()
    masterGain.connect(ctx.destination)
    masterGain.gain.value = 0.3

    // Industrial kick drum pattern
    const createKick = (time: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(masterGain)

      osc.frequency.setValueAtTime(150, time)
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.1)

      gain.gain.setValueAtTime(1, time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3)

      osc.start(time)
      osc.stop(time + 0.3)
    }

    // Industrial hi-hat
    const createHihat = (time: number) => {
      const noise = ctx.createBufferSource()
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1
      }

      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = 8000

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.15, time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      noise.start(time)
    }

    // Metallic industrial sound
    const createMetallic = (time: number, freq: number) => {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'square'
      osc2.type = 'sawtooth'
      osc1.frequency.value = freq
      osc2.frequency.value = freq * 1.5

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(masterGain)

      gain.gain.setValueAtTime(0.08, time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5)

      osc1.start(time)
      osc2.start(time)
      osc1.stop(time + 0.5)
      osc2.stop(time + 0.5)
    }

    // Bass line
    const createBass = (time: number, freq: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      osc.connect(gain)
      gain.connect(masterGain)

      gain.gain.setValueAtTime(0.2, time)
      gain.gain.setValueAtTime(0.2, time + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.8)

      osc.start(time)
      osc.stop(time + 0.8)
    }

    // Pattern sequence
    const bpm = 120
    const beatDuration = 60 / bpm
    const beats = Math.floor(duration / beatDuration)

    for (let i = 0; i < beats; i++) {
      const time = now + i * beatDuration

      // Kick on 1 and 3
      if (i % 4 === 0 || i % 4 === 2) {
        createKick(time)
      }

      // Hi-hat on every beat
      createHihat(time)
      createHihat(time + beatDuration / 2)

      // Metallic industrial accents
      if (i % 8 === 4) {
        createMetallic(time, 800)
      }

      // Bass line
      if (i % 2 === 0) {
        const bassFreq = i % 8 === 0 ? 55 : 73.42
        createBass(time, bassFreq)
      }
    }

    // Track progress
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      setProgress((elapsed / duration) * 100)

      if (elapsed >= duration) {
        clearInterval(interval)
        setIsPlaying(false)
        setProgress(0)
      }
    }, 50)
  }

  const handlePlay = () => {
    setIsPlaying(true)
    setProgress(0)
    playIndustrialBeat()
  }

  const handleReplay = () => {
    setProgress(0)
    setIsPlaying(true)
    playIndustrialBeat()
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.background}
        animate={{
          opacity: isPlaying ? [0.05, 0.15, 0.05] : 0.05
        }}
        transition={{
          duration: 2,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear"
        }}
      />

      {/* Scaffolding Structure */}
      <div className={styles.scaffolding}>
        {/* Vertical Poles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={`vertical-${i}`}
            className={styles.verticalPole}
            style={{ left: `${20 + i * 20}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={isPlaying ? {
              scaleY: 1,
              opacity: 0.6,
            } : { scaleY: 0, opacity: 0 }}
            transition={{
              delay: i * 0.3,
              duration: 1,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Horizontal Beams */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`horizontal-${i}`}
            className={styles.horizontalBeam}
            style={{ top: `${30 + i * 20}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isPlaying ? {
              scaleX: 1,
              opacity: 0.6,
            } : { scaleX: 0, opacity: 0 }}
            transition={{
              delay: 0.5 + i * 0.3,
              duration: 1.2,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Diagonal Braces */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`diagonal-${i}`}
            className={styles.diagonalBrace}
            style={{
              left: `${25 + i * 20}%`,
              top: '40%'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isPlaying ? {
              scale: 1,
              opacity: 0.4,
            } : { scale: 0, opacity: 0 }}
            transition={{
              delay: 1.5 + i * 0.2,
              duration: 0.8,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Central Logo */}
      <div className={styles.logoContainer}>
        <motion.div
          className={styles.logoFrame}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={isPlaying ? {
            scale: 1,
            rotate: 0,
            opacity: 1,
          } : { scale: 0, rotate: -180, opacity: 0 }}
          transition={{
            delay: 2.5,
            duration: 1.5,
            ease: "easeOut"
          }}
        >
          <motion.div
            className={styles.logoInner}
            animate={isPlaying ? {
              boxShadow: [
                '0 0 20px rgba(255,165,0,0.3)',
                '0 0 40px rgba(255,165,0,0.6)',
                '0 0 20px rgba(255,165,0,0.3)'
              ]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 200 200" className={styles.logoSvg}>
              <motion.path
                d="M 50 100 L 100 50 L 150 100 L 100 150 Z"
                stroke="rgba(255,165,0,0.9)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isPlaying ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ delay: 3.5, duration: 1, ease: "easeInOut" }}
              />
              <motion.path
                d="M 70 100 L 100 70 L 130 100 L 100 130 Z"
                stroke="rgba(255,165,0,0.7)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isPlaying ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ delay: 4, duration: 0.8, ease: "easeInOut" }}
              />
              <motion.circle
                cx="100"
                cy="100"
                r="8"
                fill="rgba(255,165,0,0.9)"
                initial={{ scale: 0 }}
                animate={isPlaying ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 4.5, duration: 0.5 }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Company Name */}
        <motion.div
          className={styles.companyName}
          initial={{ opacity: 0, y: 30 }}
          animate={isPlaying ? {
            opacity: 1,
            y: 0,
          } : { opacity: 0, y: 30 }}
          transition={{
            delay: 5,
            duration: 1,
            ease: "easeOut"
          }}
        >
          <div className={styles.textLine}>TEHRAN</div>
          <div className={styles.textLine}>SOFT</div>
        </motion.div>
      </div>

      {/* Particle Effects */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isPlaying ? {
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            } : { opacity: 0, scale: 0 }}
            transition={{
              delay: 3 + Math.random() * 2,
              duration: 2 + Math.random() * 2,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Controls */}
      {!isPlaying && progress === 0 && (
        <motion.button
          className={styles.playButton}
          onClick={handlePlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          PLAY
        </motion.button>
      )}

      {!isPlaying && progress > 0 && (
        <motion.button
          className={styles.playButton}
          onClick={handleReplay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          REPLAY
        </motion.button>
      )}

      {/* Progress Bar */}
      {isPlaying && (
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Duration Counter */}
      {isPlaying && (
        <motion.div
          className={styles.duration}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        >
          {(progress * 0.15).toFixed(1)}s / 15.0s
        </motion.div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

export default function LoadingSpinner() {
    const [loading, setLoading] = useState(true)
    const { theme } = useTheme()
    const isDarkMode = theme === 'dark'

    useEffect(() => {
        const interval = setInterval(() => {
            setLoading(false)

            setTimeout(() => {
                setLoading(true)
            }, 1000)
        }, 1000000)

        return () => clearInterval(interval)
    }, [])

    const lightModeColors = ['rgb(0, 0, 0)', 'rgb(31, 41, 55)', 'rgb(55, 65, 81)', 'rgb(75, 85, 99)', 'rgb(107, 114, 128)', 'rgb(156, 163, 175)']

    const darkModeColors = [
        'rgb(255, 255, 255)',
        'rgb(229, 231, 235)',
        'rgb(209, 213, 219)',
        'rgb(156, 163, 175)',
        'rgb(107, 114, 128)',
        'rgb(75, 85, 99)',
    ]

    const colors = isDarkMode ? darkModeColors : lightModeColors

    return (
        <AnimatePresence mode="wait">
            {loading && (
                <motion.div
                    className="relative flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="absolute rounded-full border-t-4 border-b-4 border-transparent"
                        style={{ width: '120px', height: '120px' }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 2,
                            ease: 'linear',
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    >
                        {colors.map((color, index) => (
                            <motion.div
                                key={index}
                                className="absolute rounded-full"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: color,
                                    top: index % 2 === 0 ? '-10px' : 'auto',
                                    bottom: index % 2 === 1 ? '-10px' : 'auto',
                                    left: index === 2 || index === 3 ? '50%' : 'auto',
                                    right: index === 0 || index === 5 ? '0' : 'auto',
                                    transform: `translateX(${index === 2 || index === 3 ? '-50%' : '0'})`,
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.8,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        className={`absolute rounded-full shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                        style={{ width: '80px', height: '80px' }}
                        animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: isDarkMode
                                ? ['0 0 0 0px rgba(255, 255, 255, 0.1)', '0 0 0 10px rgba(255, 255, 255, 0.1)', '0 0 0 0px rgba(255, 255, 255, 0.1)']
                                : ['0 0 0 0px rgba(0, 0, 0, 0.1)', '0 0 0 10px rgba(0, 0, 0, 0.1)', '0 0 0 0px rgba(0, 0, 0, 0.1)'],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                        }}
                    />

                    <motion.div
                        className="relative"
                        style={{ width: '60px', height: '60px' }}
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 3,
                            ease: 'linear',
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    >
                        {[...Array(6)].map((_, index) => {
                            const angle = index * (360 / 6) * (Math.PI / 180)
                            const x = 25 * Math.cos(angle)
                            const y = 25 * Math.sin(angle)

                            return (
                                <motion.div
                                    key={index}
                                    className="absolute rounded-full"
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: colors[index],
                                        top: '50%',
                                        left: '50%',
                                        x: x,
                                        y: y,
                                        margin: '-5px 0 0 -5px',
                                    }}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.7, 1, 0.7],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: index * 0.2,
                                        ease: 'easeInOut',
                                    }}
                                />
                            )
                        })}
                    </motion.div>

                    <motion.div
                        className="absolute rounded-full"
                        style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            backgroundColor: isDarkMode
                                ? [
                                      'rgb(255, 255, 255)',
                                      'rgb(229, 231, 235)',
                                      'rgb(156, 163, 175)',
                                      'rgb(107, 114, 128)',
                                      'rgb(156, 163, 175)',
                                      'rgb(229, 231, 235)',
                                      'rgb(255, 255, 255)',
                                  ]
                                : [
                                      'rgb(0, 0, 0)',
                                      'rgb(31, 41, 55)',
                                      'rgb(75, 85, 99)',
                                      'rgb(156, 163, 175)',
                                      'rgb(75, 85, 99)',
                                      'rgb(31, 41, 55)',
                                      'rgb(0, 0, 0)',
                                  ],
                        }}
                        transition={{
                            scale: {
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'easeInOut',
                            },
                            backgroundColor: {
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'easeInOut',
                            },
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

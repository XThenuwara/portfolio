'use client'

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full gap-3">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="w-2 h-6 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </div>
    )
}

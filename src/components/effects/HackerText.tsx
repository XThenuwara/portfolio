import React, { useState, useEffect } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const HackerText = ({ value }: { value: string }) => {
  const [iteration, setIteration] = useState<number>(0);
  const [text, setText] = useState<string>(value);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setText((currentText) =>
        currentText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return value[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      setIteration((prev) => {
        if (prev >= value.length) {
          setIsAnimating(false);
          return 0;
        }
        return prev + 1/10;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [iteration, value, isAnimating]);

  const handleMouseEnter = () => {
    setIteration(0);
    setIsAnimating(true);
  };

  return (
    <h1 className="text-4xl" onMouseEnter={handleMouseEnter}>
      {text}
    </h1>
  );
};

export default HackerText;
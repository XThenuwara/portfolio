import React, { useState, useEffect } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const HackerText = ({ value }: { value: string }) => {
  const [iteration, setIteration] = useState(0);
  const [text, setText] = useState(value);

  useEffect(() => {
    let interval: any = null;

    interval = setInterval(() => {
      setText((text: any) =>
        text
          .split("")
          .map((letter: any, index: any) => {
            if (index < iteration) {
              return value[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      setIteration(iteration + 1 /10);
    }, 30);

    return () => clearInterval(interval);
  }, [iteration, value]);

  return (
    <h1 className="text-4xl" onMouseEnter={() => setIteration(0)}>
      {text}
    </h1>
  );
};

export default HackerText;
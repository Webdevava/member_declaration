import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, CornerDownLeft, X } from "lucide-react";



export const Keyboard = ({
  inputType = "text",
  onInputChange,
  initialValue = "",
  maxLength,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [capsLock, setCapsLock] = useState(false);
  const audioRef = useRef < HTMLAudioElement > null;

  useEffect(() => {
    onInputChange(inputValue);
  }, [inputValue]);

  const handleKeyPress = (key) => {
    playSound();

    switch (key) {
      case "backspace":
        setInputValue((prev) => prev.slice(0, -1));
        break;
      case "caps":
        setCapsLock((prev) => !prev);
        break;
      case "return":
        onClose();
        break;
      default:
        if (maxLength && inputValue.length >= maxLength) return;

        if (inputType === "number" && !/^\d*$/.test(key)) return;

        let processedKey =
          capsLock && key.length === 1 ? key.toUpperCase() : key;

        setInputValue((prev) => prev + processedKey);
    }
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const getKeyboardLayout = () => {
    const baseRows = [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace"],
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l", "return"],
      ["z", "x", "c", "v", "b", "n", "m", ".", ","],
    ];

    if (inputType === "number") {
      return [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace"],
        [".", ","],
      ];
    }

    if (inputType === "password") {
      return baseRows.map((row) =>
        row.filter((key) =>
          [
            "q",
            "w",
            "e",
            "r",
            "t",
            "y",
            "u",
            "i",
            "o",
            "p",
            "a",
            "s",
            "d",
            "f",
            "g",
            "h",
            "j",
            "k",
            "l",
            "z",
            "x",
            "c",
            "v",
            "b",
            "n",
            "m",
          ].includes(key)
        )
      );
    }

    return baseRows;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-2xl p-4">
      <audio ref={audioRef} src="/sounds/key.mp3" />

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-semibold">
          {inputType === "password"
            ? "Password Input"
            : inputType === "number"
            ? "Number Input"
            : "Text Input"}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-destructive/10 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-4 bg-muted p-2 rounded">
        <input
          type={inputType === "password" ? "password" : "text"}
          value={inputValue}
          readOnly
          className="w-full bg-transparent text-center text-xl"
          maxLength={maxLength}
        />
      </div>

      <div className="flex flex-col gap-2">
        {getKeyboardLayout().map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`
                  px-3 py-2 rounded-md transition-all 
                  ${key === "backspace" ? "bg-destructive/10" : "bg-secondary"}
                  hover:bg-accent
                  active:scale-95
                `}
              >
                {key === "backspace" ? (
                  <ArrowLeft className="h-5 w-5" />
                ) : key === "return" ? (
                  <CornerDownLeft className="h-5 w-5" />
                ) : capsLock && key.length === 1 ? (
                  key.toUpperCase()
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={() => setCapsLock((prev) => !prev)}
            className={`
              px-4 py-2 rounded-md transition-all
              ${
                capsLock ? "bg-primary text-primary-foreground" : "bg-secondary"
              }
            `}
          >
            Caps
          </button>
          <button
            onClick={() => setInputValue("")}
            className="px-4 py-2 bg-destructive/10 rounded-md"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;

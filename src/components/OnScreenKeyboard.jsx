"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const OnScreenKeyboard = ({
  type,
  onKeyPress,
  onEnter,
  onBackspace,
  preventClose,
}) => {
  const [capsLock, setCapsLock] = useState(false);
  const [showSpecialChars, setShowSpecialChars] = useState(false);

  const textKeys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const numberKeys = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];

  const specialCharacters = [
    ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
    ["-", "_", "+", "=", "{", "}", "[", "]", "|", "\\"],
  ];

  const handleKeyPress = (key) => {
    onKeyPress(capsLock ? key.toUpperCase() : key);
    preventClose?.();
  };

  const renderKeys = (keys) => {
    return keys.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center space-x-1 mb-1">
        {row.map((key) => (
          <Button
            key={key}
            variant="outline"
            className="w-10 h-10"
            onClick={() => handleKeyPress(key)}
          >
            {capsLock ? key.toUpperCase() : key}
          </Button>
        ))}
      </div>
    ));
  };

  const renderSpecialCharacters = () => {
    if (!showSpecialChars) return null;

    return specialCharacters.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center space-x-1 mb-1">
        {row.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-10 h-10"
            onClick={() => handleKeyPress(char)}
          >
            {char}
          </Button>
        ))}
      </div>
    ));
  };

  return (
    <Card className="p-2">
      {type === "text" && renderKeys(textKeys)}
      {type === "number" && renderKeys(numberKeys)}
      {type === "password" && (
        <>
          {renderKeys(textKeys)}
          {renderSpecialCharacters()}
        </>
      )}
      <div className="flex justify-center space-x-1 mt-1">
        <Button
          variant="outline"
          className="w-20"
          onClick={() => {
            setCapsLock(!capsLock);
            preventClose?.();
          }}
        >
          Caps
        </Button>
        {type === "password" && (
          <Button
            variant={showSpecialChars ? "default" : "outline"}
            className="w-20"
            onClick={() => {
              setShowSpecialChars(!showSpecialChars);
              preventClose?.();
            }}
          >
            {showSpecialChars ? "Hide Sym" : "Show Sym"}
          </Button>
        )}
        <Button
          variant="outline"
          className="w-40"
          onClick={() => {
            handleKeyPress(" ");
          }}
        >
          Space
        </Button>
        <Button
          variant="outline"
          className="w-20"
          onClick={() => {
            onBackspace();
            preventClose?.();
          }}
        >
          ⌫
        </Button>
        <Button variant="default" className="w-20" onClick={onEnter}>
          Enter
        </Button>
      </div>
    </Card>
  );
};

export default OnScreenKeyboard;

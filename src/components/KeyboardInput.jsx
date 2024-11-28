"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import OnScreenKeyboard from "./OnScreenKeyboard";
import { Keyboard } from "lucide-react";

const KeyboardInput = ({ onEnter, ...props }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyPress = (key) => {
    setValue((prev) => prev + key);
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    setValue((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleEnter = () => {
    onEnter?.();
    inputRef.current?.blur();
    setIsOpen(false);
  };

  return (
    <div className="relative  w-80 ">
      <Input
        {...props}
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-7xl"
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-fit"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <OnScreenKeyboard
            type={props.type}
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onEnter={handleEnter}
            preventClose={() => setIsOpen(true)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default KeyboardInput;

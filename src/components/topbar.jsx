import React from "react";
import { Wifi, Bluetooth } from "lucide-react";
import { Button } from "@/components/ui/button";

const Topbar = () => {
  return (
    <header className="flex items-center justify-between px-4  bg-background  border-b shadow-sm flex-1">
      <div className="flex items-center">
        {/* Logo placeholder - replace with your actual logo */}
        <div className="text-xl font-bold ">INDITRONICS</div>
      </div>


      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Wifi className="h-5 w-5 " />
        </Button>
        <Button variant="ghost" size="icon">
          <Bluetooth className="h-5 w-5 " />
        </Button>
      </div>
    </header>
  );
};

export default Topbar;

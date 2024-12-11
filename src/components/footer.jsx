"use client";
import { useState } from "react";
import {
  Edit,
  Settings,
  Server,
  Battery,
  Wifi,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEditModeStore } from "@/store/editModeStore";
import { cn } from "@/lib/utils";
import SystemSettingsDialog from "./SystemSettings";

const Footer = () => {
  const {
    isEditModeEnabled,
    toggleEditMode,
    touchOptimization,
  } = useEditModeStore();

  // Simulated system states
  const [systemStatus, setSystemStatus] = useState({
    connectionStatus: "connected",
    batteryLevel: 85,
  });


  // Helper function to get battery icon and color
  const getBatteryIcon = (level) => {
    if (level > 75) return { icon: Battery, color: "text-green-500" };
    if (level > 25) return { icon: Battery, color: "text-yellow-500" };
    return { icon: Battery, color: "text-red-500" };
  };

  const { icon: BatteryIcon, color: batteryColor } = getBatteryIcon(systemStatus.batteryLevel);

  return (
    <footer className="bg-background border-t flex items-center justify-between px-4 py-2 transition-all duration-300">
      {/* System Status Section */}
      <div className="flex items-center space-x-4">
        {/* Connection Status */}
        <div className="flex items-center">
          <Wifi className={cn("mr-1 h-4 w-4", 
            systemStatus.connectionStatus === "connected" 
              ? "text-green-500" 
              : "text-red-500"
          )} />
          <span className="text-xs">
            {systemStatus.connectionStatus === "connected" ? "Online" : "Offline"}
          </span>
        </div>

        {/* Battery Status */}
        <div className="flex items-center">
          <BatteryIcon className={cn("mr-1 h-4 w-4", batteryColor)} />
          <span className="text-xs">{systemStatus.batteryLevel}%</span>
        </div>

        {/* System Alerts */}
        {systemStatus.systemAlerts > 0 && (
          <Badge variant="destructive" className="flex items-center">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {systemStatus.systemAlerts} Alerts
          </Badge>
        )}
      </div>


      {/* Edit Mode and Settings Section */}
      <div className="flex items-center space-x-4">
        {isEditModeEnabled && (
          <Button
            variant="destructive"
            size={touchOptimization === "mobile" ? "default" : "sm"}
            onClick={toggleEditMode}
          >
            <Edit className="mr-2 h-4 w-4" />
            Turn Off Edit Mode
          </Button>
        )}
        <SystemSettingsDialog />
      </div>
    </footer>
  );
};

export default Footer;
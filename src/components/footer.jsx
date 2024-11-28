"use client";
import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  Power,
  RotateCcw,
  Settings,
  Sun,
  Moon,
  Edit,
  LayoutGrid,
  List,
  Tablet,
  Smartphone,
  Monitor,
  Minimize2,
  Maximize2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEditModeStore } from "@/store/editModeStore";
import { cn } from "@/lib/utils";

const SystemSettingsDialog = () => {
  const [theme, setTheme] = useState("system");
  const [networks, setNetworks] = useState([
    { ssid: "Home WiFi", signal: 80, security: "WPA", connected: true },
    { ssid: "Cafe Network", signal: 60, security: "WPA", connected: false },
    { ssid: "Public WiFi", signal: 40, security: "Open", connected: false },
  ]);

  const {
    isEditModeEnabled,
    toggleEditMode,
    editModeLayout,
    setEditModeLayout,
    touchOptimization,
    setTouchOptimization,
  } = useEditModeStore();

  const [connectingNetwork, setConnectingNetwork] = useState(null);
  const [wifiPassword, setWifiPassword] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Client-side theme initialization
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    // Client-side theme application
    if (typeof window !== "undefined") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      const effectiveTheme = theme === "system" ? systemTheme : theme;

      document.body.classList.toggle("dark", effectiveTheme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleConnectNetwork = (network) => {
    setConnectingNetwork(network);
  };

  const confirmNetworkConnect = () => {
    if (connectingNetwork) {
      const updatedNetworks = networks.map((net) => ({
        ...net,
        connected: net.ssid === connectingNetwork.ssid,
      }));
      setNetworks(updatedNetworks);
      setConnectingNetwork(null);
      setWifiPassword("");
    }
  };

  const handleSystemAction = (action) => {
    console.log(`Performing system ${action}`);
    alert(`System will ${action} now`);
  };


  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button variant="ghost" className="">
          <Settings className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[75vh] flex flex-col w-full justify-start items-start">
        <DialogHeader className="w-full flex flex-row justify-between items-center">
          <DialogTitle>System Settings</DialogTitle>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </DialogHeader>

        <Tabs defaultValue="network" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Network Tab (previous implementation remains the same) */}
          <TabsContent value="network">
            <ScrollArea className="h-[50vh] w-full rounded-md border p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center">
                    <Wifi className="mr-2" /> WiFi
                  </Label>
                  <Switch
                    checked={networks.some((net) => net.connected)}
                    onCheckedChange={(checked) => {
                      const updatedNetworks = networks.map((net) => ({
                        ...net,
                        connected: checked
                          ? networks[0].ssid === net.ssid
                          : false,
                      }));
                      setNetworks(updatedNetworks);
                    }}
                  />
                </div>
                <Separator />
                {networks.map((network) => (
                  <div
                    key={network.ssid}
                    className="flex justify-between items-center p-2 hover:bg-accent rounded"
                  >
                    <div>
                      <div className="font-medium">{network.ssid}</div>
                      <div className="text-sm text-muted-foreground">
                        Signal: {network.signal}% | Security: {network.security}
                      </div>
                    </div>
                    {network.connected ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleConnectNetwork(network)}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnectNetwork(network)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Appearance Tab (previous implementation remains the same) */}
          <TabsContent value="appearance">
            <div className="space-y-4 p-4">
              <div className="flex items-center space-x-2">
                <Label>Theme</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" /> Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" /> Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => handleThemeChange("system")}
                  >
                    <Monitor className="mr-2 h-4 w-4" /> System
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* System Tab with Edit Mode Settings */}
          <TabsContent value="system">
            <div className="space-y-4 p-4">
              {/* Edit Mode Settings */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" /> Edit Mode
                  </Label>
                  <Switch
                    checked={isEditModeEnabled}
                    onCheckedChange={toggleEditMode}
                  />
                </div>

                
              </div>

              {/* System Actions */}
              <div className="mt-4 space-y-2">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleSystemAction("shutdown")}
                >
                  <Power className="mr-2 h-4 w-4" /> Shutdown
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSystemAction("reboot")}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reboot
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Network Connection Dialog (previous implementation remains the same) */}
        <Dialog
          open={!!connectingNetwork}
          onOpenChange={() => setConnectingNetwork(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {connectingNetwork?.connected ? "Disconnect" : "Connect"} to{" "}
                {connectingNetwork?.ssid}
              </DialogTitle>
            </DialogHeader>
            {!connectingNetwork?.connected && (
              <div className="space-y-4">
                <Label>Network Password</Label>
                <Input
                  type="password"
                  placeholder="Enter WiFi password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                />
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConnectingNetwork(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmNetworkConnect}
                variant={
                  connectingNetwork?.connected ? "destructive" : "default"
                }
              >
                {connectingNetwork?.connected ? "Disconnect" : "Connect"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

const Footer = () => {
  const {
    isEditModeEnabled,
    toggleEditMode,
    editModeLayout,
    touchOptimization,
  } = useEditModeStore();

  const [activeUsers, setActiveUsers] = useState(5);

  return (
    <footer
      className="bg-background border-t flex items-center justify-between px-4 py- transition-all duration-300">
      <div className="flex items-center space-x-4">
        <span
          className={cn("font-bold text-sm transition-all duration-300", {
            "text-base": touchOptimization === "mobile",
            "text-sm": !touchOptimization || touchOptimization === "desktop",
          })}
        >
          Active Users: {activeUsers}
        </span>
      </div>

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
        ) }

        <SystemSettingsDialog />
      </div>
    </footer>
  );
};

export default Footer;

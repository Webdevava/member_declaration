"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Wifi,
  WifiOff,
  Power,
  RotateCcw,
  Settings,
  Sun,
  Moon,
  Edit,
  Monitor,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  X,
  RefreshCw,
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const SystemSettingsDialog = () => {
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState("system");
  const [networks, setNetworks] = useState([]);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [connectingNetwork, setConnectingNetwork] = useState(null);
  const [wifiPassword, setWifiPassword] = useState("");

  // System actions
  const [isShutdownDialogOpen, setIsShutdownDialogOpen] = useState(false);
  const [isRebootDialogOpen, setIsRebootDialogOpen] = useState(false);
  const [isSystemActionLoading, setIsSystemActionLoading] = useState(false);

  // Loading states
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(true);
  const [isLoadingConnection, setIsLoadingConnection] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // WiFi toggle states
  const [isWiFiToggling, setIsWiFiToggling] = useState(false);
  const [isWiFiEnabled, setIsWiFiEnabled] = useState(true);

  // Error handling
  const [error, setError] = useState(null);

  const { isEditModeEnabled, toggleEditMode } = useEditModeStore();

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchNetworks = async () => {
    try {
      setIsLoadingNetworks(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/wifi/networks", {
        timeout: 5000,
      });

      // Create unique keys by adding signal strength to SSID
      const uniqueNetworks = response.data.map((network, index) => ({
        ...network,
        uniqueKey: `${network.ssid}_${network.signal}_${index}`,
      }));

      setNetworks(uniqueNetworks);
    } catch (error) {
      console.error("Error fetching networks:", error);
      toast({
        title: "Network Error",
        description: "Failed to fetch WiFi networks",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNetworks(false);
    }
  };

  const fetchCurrentConnection = async () => {
    try {
      setIsLoadingConnection(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/wifi/status", {
        timeout: 5000,
      });

      setCurrentConnection(response.data);
    } catch (error) {
      console.error("Error fetching current connection:", error);
      toast({
        title: "Connection Error",
        description: "Failed to fetch current connection",
        variant: "destructive",
      });
      setCurrentConnection({ connected: false, ssid: null, device: null });
    } finally {
      setIsLoadingConnection(false);
    }
  };

  const handleConnectNetwork = async () => {
    if (!connectingNetwork) return;

    try {
      setIsConnecting(true);
      await axios.post("http://localhost:5000/wifi/connect", {
        ssid: connectingNetwork.ssid,
        password: wifiPassword,
      });

      toast({
        title: "Connected",
        description: `Successfully connected to ${connectingNetwork.ssid}`,
      });

      await Promise.all([fetchNetworks(), fetchCurrentConnection()]);
      setConnectingNetwork(null);
      setWifiPassword("");
    } catch (error) {
      console.error("Error connecting to network:", error);
      toast({
        title: "Connection Failed",
        description:
          error.response?.data?.error || "Failed to connect to network",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await axios.post("http://localhost:5000/wifi/disconnect");

      toast({
        title: "Disconnected",
        description: "Successfully disconnected from WiFi",
      });

      await Promise.all([fetchNetworks(), fetchCurrentConnection()]);
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: error.response?.data?.error || "Failed to disconnect",
        variant: "destructive",
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleWiFiToggle = async () => {
    try {
      setIsWiFiToggling(true);

      // Simulate WiFi toggling (replace with actual WiFi enable/disable command if available)
      if (isWiFiEnabled) {
        // Disable WiFi
        await axios.post("http://localhost:5000/wifi/disable");
        setIsWiFiEnabled(false);
        toast({
          title: "WiFi Disabled",
          description: "WiFi has been turned off",
        });
      } else {
        // Enable WiFi
        await axios.post("http://localhost:5000/wifi/enable");
        setIsWiFiEnabled(true);
        toast({
          title: "WiFi Enabled",
          description: "WiFi has been turned on",
        });
      }

      // Refresh networks and connection status
      await Promise.all([fetchNetworks(), fetchCurrentConnection()]);
    } catch (error) {
      console.error("Error toggling WiFi:", error);
      toast({
        title: "WiFi Toggle Failed",
        description: error.response?.data?.error || "Failed to toggle WiFi",
        variant: "destructive",
      });
    } finally {
      setIsWiFiToggling(false);
    }
  };

  const handleSystemAction = async (action) => {
    try {
      setIsSystemActionLoading(true);
      // Simulate system action (replace with actual system command)
      const response = await axios.post(
        `http://localhost:5000/system/${action}`
      );

      toast({
        title: `System ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        description: `The system will ${action} momentarily`,
      });
    } catch (error) {
      console.error(`Error during system ${action}:`, error);
      toast({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Failed`,
        description:
          error.response?.data?.error || `Failed to ${action} system`,
        variant: "destructive",
      });
    } finally {
      setIsSystemActionLoading(false);
      setIsShutdownDialogOpen(false);
      setIsRebootDialogOpen(false);
    }
  };

  const getSignalIcon = (signal) => {
    if (signal > 75) return <SignalHigh className="text-green-500" />;
    if (signal > 50) return <SignalMedium className="text-yellow-500" />;
    if (signal > 25) return <SignalLow className="text-orange-500" />;
    return <SignalZero className="text-red-500" />;
  };

  // Theme persistence and application
  useEffect(() => {
    if (isClient) {
      const savedTheme = localStorage.getItem("theme") || "system";
      setTheme(savedTheme);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      const effectiveTheme = theme === "system" ? systemTheme : theme;

      document.body.classList.toggle("dark", effectiveTheme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme, isClient]);

  // Fetch networks and connection on component mount
  useEffect(() => {
    if (isClient) {
      fetchNetworks();
      fetchCurrentConnection();
    }
  }, [isClient]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // Fetch networks and connection on component mount
  useEffect(() => {
    fetchNetworks();
    fetchCurrentConnection();
  }, []);

  const refreshNetworkAPIs = async () => {
    setIsLoadingNetworks(true);
    setIsLoadingConnection(true);
    try {
      await Promise.all([fetchNetworks(), fetchCurrentConnection()]);
      toast({
        title: "Refresh Successful",
        description: "Network information has been updated.",
      });
    } catch (error) {
      console.error("Error refreshing network APIs:", error);
      toast({
        title: "Refresh Failed",
        description: "Failed to update network information.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNetworks(false);
      setIsLoadingConnection(false);
    }
  };

  // Prevent rendering on server
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hover:bg-accent">
            <Settings className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[85vw] h-[90vh] flex flex-col w-full justify-start items-start overflow-hidden">
          <DialogHeader className="w-full flex flex-row justify-between items-center mb-4">
            <DialogTitle>System Settings</DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue="network"
            className="w-full flex-grow overflow-hidden flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            <div className="flex-grow overflow-auto">
              <TabsContent value="network" className="space-y-4">
                {error && (
                  <div className="bg-destructive/15 text-destructive p-3 rounded-lg mb-4 flex items-center">
                    <X className="mr-2" /> {error}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>  
                    <CardHeader >
                      <CardTitle className="flex flex-row justify-between items-center">WiFi Status <Button
                          variant="outline"
                          size="sm"
                          onClick={refreshNetworkAPIs}
                          disabled={isLoadingNetworks || isLoadingConnection}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button></CardTitle>
                        
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {isWiFiEnabled ? (
                            <Wifi className="text-primary" />
                          ) : (
                            <WifiOff className="text-destructive" />
                          )}
                          <Label>WiFi</Label>
                        </div>
                        <Switch
                          checked={isWiFiEnabled}
                          onCheckedChange={handleWiFiToggle}
                          disabled={isWiFiToggling}
                          className={
                            isWiFiToggling
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {currentConnection?.connected && (
                    <Card>  
                      <CardHeader>
                        <CardTitle>Current Connection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Wifi className="text-primary" />
                              <span className="font-semibold">
                                {currentConnection.ssid}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Connected on {currentConnection.device}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDisconnect}
                            disabled={isDisconnecting}
                          >
                            {isDisconnecting
                              ? "Disconnecting..."
                              : "Disconnect"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Card>  
                  <CardHeader>
                    <CardTitle>Available Networks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[40vh] w-full rounded-md">
                      <div className="space-y-2">
                        {isLoadingNetworks ? (
                          <div className="flex items-center justify-center h-20">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : (
                          networks.map((network) => (
                            <div
                              key={network.uniqueKey}
                              className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                {getSignalIcon(network.signal)}
                                <div>
                                  <div className="font-medium">
                                    {network.ssid}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {network.security} | Signal:{" "}
                                    {network.signal}%
                                  </div>
                                </div>
                              </div>
                              {!network.connected && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setConnectingNetwork(network)}
                                >
                                  Connect
                                </Button>
                              )}
                              {network.connected && (
                                <Badge variant="secondary">Connected</Badge>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="p-4 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <Label className="mb-2 block">Theme Selection</Label>
                  <div className="flex space-x-2">
                    {["light", "dark", "system"].map((themeOption) => (
                      <Button
                        key={themeOption}
                        variant={theme === themeOption ? "default" : "outline"}
                        className="capitalize"
                        onClick={() => handleThemeChange(themeOption)}
                      >
                        {themeOption === "light" && (
                          <Sun className="mr-2 h-4 w-4" />
                        )}
                        {themeOption === "dark" && (
                          <Moon className="mr-2 h-4 w-4" />
                        )}
                        {themeOption === "system" && (
                          <Monitor className="mr-2 h-4 w-4" />
                        )}
                        {themeOption}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg  space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center ">Edit Mode</Label>
                    <Switch
                      checked={isEditModeEnabled}
                      onCheckedChange={toggleEditMode}
                      aria-label="Toggle Edit Mode"
                      className="transition-transform hover:scale-105"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isEditModeEnabled ? "Edit Mode is ON" : "Edit Mode is OFF"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="system" className="p-4 space-y-4">
                <div className=" bg-muted/50  rounded-lg  p-4  space-y-2 ">
                  <Label className="flex items-center ">Power Options</Label>
                  <div className="flex gap-4">
                    <Button
                      variant="destructive"
                      className="w-full flex items-center justify-center py-3 hover:bg-red-600 transition-all"
                      onClick={() => setIsShutdownDialogOpen(true)}
                    >
                      <Power className="mr-2 h-5 w-5" /> Shutdown
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center py-3 border-gray-300 hover:bg-gray-100 transition-all"
                      onClick={() => setIsRebootDialogOpen(true)}
                    >
                      <RotateCcw className="mr-2 h-5 w-5" /> Reboot
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Network Connection Modal */}
          {connectingNetwork && (
            <Dialog
              open={!!connectingNetwork}
              onOpenChange={() => setConnectingNetwork(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect to {connectingNetwork.ssid}</DialogTitle>
                  <DialogDescription>
                    Enter the password for the selected network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Label>Network Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter WiFi password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setConnectingNetwork(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConnectNetwork}
                    disabled={!wifiPassword || isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogContent>
      </Dialog>

      {/* Shutdown Confirmation Dialog */}
      <AlertDialog
        open={isShutdownDialogOpen}
        onOpenChange={setIsShutdownDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Shutdown</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to shutdown the system? All unsaved work
              will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => handleSystemAction("shutdown")}
              disabled={isSystemActionLoading}
            >
              {isSystemActionLoading ? (
                <>
                  {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                  Shutting Down...
                </>
              ) : (
                "Shutdown"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reboot Confirmation Dialog */}
      <AlertDialog
        open={isRebootDialogOpen}
        onOpenChange={setIsRebootDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reboot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restart the system? All unsaved work will
              be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="outline"
              onClick={() => handleSystemAction("reboot")}
              disabled={isSystemActionLoading}
            >
              {isSystemActionLoading ? (
                <>
                  {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                  Rebooting...
                </>
              ) : (
                "Reboot"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SystemSettingsDialog;

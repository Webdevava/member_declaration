'use client'
import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Topbar = () => {
  const [wifiStatus, setWifiStatus] = useState({
    connected: false,
    ssid: null,
    device: null
  });

  useEffect(() => {
    const fetchWiFiStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/wifi/status');
        if (!response.ok) {
          throw new Error('Failed to fetch WiFi status');
        }
        const data = await response.json();
        setWifiStatus(data);
      } catch (error) {
        console.error('Error fetching WiFi status:', error);
        setWifiStatus({ connected: false, ssid: null, device: null });
      }
    };

    // Fetch initial status
    fetchWiFiStatus();

    // Optional: Set up periodic checking (e.g., every 30 seconds)
    const intervalId = setInterval(fetchWiFiStatus, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 bg-background border-b shadow-sm flex-1">
      <div className="flex items-center">
        {/* Logo placeholder - replace with your actual logo */}
        <div className="text-xl font-bold">INDITRONICS</div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          className={wifiStatus.connected ? 'text-green-500' : 'text-gray-500'}
        >
          <Wifi 
            className="h-8 w-8"
            fill={wifiStatus.connected ? 'currentColor' : 'none'}
          />
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
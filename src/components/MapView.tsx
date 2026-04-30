"use client";

import { useUser } from "../hooks/useUser";
import { useLanguage } from "../context/LanguageContext";
import { mockPollingBooth } from "../utils/mockData";
import { MapPin, Navigation, Clock, Compass } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useState, useCallback, useMemo } from "react";
import { logger } from "../utils/logger";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export const MapView = () => {
  const { decisionState } = useUser();
  const { t } = useLanguage();

  const [locationInput, setLocationInput] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Only show the map strongly if the user is at the "Find Polling Booth" step or later
  const isRelevant = decisionState.roadmapStep >= 4;

  const calculateDistance = useCallback((pos: {lat: number, lng: number}) => {
    // Simple Haversine formula
    const R = 6371; // km
    const dLat = (mockPollingBooth.lat - pos.lat) * Math.PI / 180;
    const dLon = (mockPollingBooth.lng - pos.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos.lat * Math.PI / 180) * Math.cos(mockPollingBooth.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    
    // Replace {dist} with the actual distance in the translated string
    const distStr = d.toFixed(1);
    const msg = t.nearestBoothDistance ? t.nearestBoothDistance.replace("{dist}", distStr) : `Nearest polling booth is ${distStr} km away`;
    setDistanceInfo(msg);
    logger.event("MAP_DISTANCE_CALCULATED", { distance: d });
  }, [t.nearestBoothDistance]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(pos);
        setLocationInput("Current Location");
        calculateDistance(pos);
        setIsLocating(false);
        logger.event("USER_LOCATION_DETECTED", { source: "geolocation" });
      },
      (error) => {
        logger.error("GEOLOCATION_FAILED", error);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  }, [calculateDistance]);

  const handleManualLocationSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      // Mock geocoding: just put the user slightly offset from the polling booth
      const mockPos = { 
        lat: mockPollingBooth.lat - 0.015, 
        lng: mockPollingBooth.lng - 0.015 
      };
      setUserLocation(mockPos);
      calculateDistance(mockPos);
      logger.event("USER_LOCATION_DETECTED", { source: "manual" });
    }
  }, [locationInput, calculateDistance]);

  const handleDirections = useCallback(() => {
    logger.event("MAP_DIRECTIONS_CLICKED");
    const origin = userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : "";
    window.open(`https://www.google.com/maps/dir/?api=1${origin}&destination=${mockPollingBooth.lat},${mockPollingBooth.lng}`, "_blank");
  }, [userLocation]);

  const mapCenter = useMemo(() => userLocation ? {
    lat: (userLocation.lat + mockPollingBooth.lat) / 2,
    lng: (userLocation.lng + mockPollingBooth.lng) / 2
  } : { lat: mockPollingBooth.lat, lng: mockPollingBooth.lng }, [userLocation]);

  const StaticFallback = () => (
    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t.mapViewAvailable || "Map view available with API Key"}</p>
        <p className="text-xs">{t.locationLabel}: {mockPollingBooth.name}</p>
      </div>
    </div>
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md transition-opacity duration-500 ${isRelevant ? 'opacity-100' : 'opacity-60 grayscale-[50%]'}`}>
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-red-500" />
        {t.nearestPollingBooth}
      </h3>

      {/* Location Input */}
      <div className="mb-4 space-y-2">
        <form onSubmit={handleManualLocationSubmit} className="flex gap-2">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder={t.enterLocation || "Enter your location"}
            className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Enter your location"
          />
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
            aria-label="Use my location"
          >
            <Compass className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t.useMyLocation || "Use My Location"}</span>
          </button>
        </form>
        {distanceInfo && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            {distanceInfo}
          </p>
        )}
      </div>

      <div className="mb-4">
        {apiKey ? (
          <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <APIProvider apiKey={apiKey}>
              <Map
                defaultZoom={13}
                center={mapCenter}
                mapId="DEMO_MAP_ID"
                disableDefaultUI={true}
              >
                {userLocation && (
                  <AdvancedMarker position={userLocation}>
                    <Pin background={"#3B82F6"} borderColor={"#1D4ED8"} glyphColor={"#FFFFFF"} />
                  </AdvancedMarker>
                )}
                <AdvancedMarker position={{ lat: mockPollingBooth.lat, lng: mockPollingBooth.lng }}>
                  <Pin background={"#EF4444"} borderColor={"#B91C1C"} glyphColor={"#FFFFFF"} />
                </AdvancedMarker>
              </Map>
            </APIProvider>
          </div>
        ) : (
          <StaticFallback />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{mockPollingBooth.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{mockPollingBooth.address}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
          <Clock className="h-4 w-4 text-blue-500" />
          <span><span className="font-medium">{t.bestTime}:</span> {mockPollingBooth.bestTime}</span>
        </div>

        <button
          onClick={handleDirections}
          className="w-full mt-2 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          aria-label="Get directions to polling booth"
        >
          <Navigation className="h-4 w-4" /> {t.getDirections}
        </button>
      </div>
    </div>
  );
};


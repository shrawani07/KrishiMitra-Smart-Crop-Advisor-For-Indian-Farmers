"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Droplets, Thermometer, Leaf, Bug, Calendar, MapPin, AlertTriangle, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import indianCities from '@/data/Indian-Cities-Geo-Data.json';
// Import your converted JSON data
import allCropDataImport from '@/data/crop_yield_data.json'; // Renamed import to avoid conflict with state variable

// Import the FarmMap component dynamically to prevent SSR issues
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/language-context';

const DynamicFarmMap = dynamic(
  () => import('./farm-map'),
  {
    ssr: false, // This is the crucial part: disable server-side rendering for this component
    loading: () => (
      <div className="flex justify-center items-center h-[300px] border rounded-lg bg-gray-50 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-muted-foreground">Loading map component...</span>
      </div>
    ),
  }
);


// Define types for your data
interface CropYieldEntry {
  Crop: string;
  Crop_Year: number;
  Season: string;
  State: string;
  Area: number;
  Production: number;
  Annual_Rainfall: number;
  Fertilizer: number;
  Pesticide: number;
  Yield: number;
  N_SOIL: number;
  P_SOIL: number;
  K_SOIL: number;
  TEMPERATURE: number;
  HUMIDITY: number;
  ph: number;
  RAINFALL: number;
  CROP_PRICE: number;
}

interface FarmData {
  totalArea: number;
  cropsGrown: number;
  diseasesPredicted: number;
  recommendationsGiven: number;
  currentSeason: string;
  location: string;
}

interface SoilHealthData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
}

interface WeatherData {
  temperature: number | string;
  humidity: number | string;
  rainfall: number | string;
  forecast: string;
  latitude?: number;
  longitude?: number;
}

interface Activity {
  type: string;
  message: string;
  time: string;
}

interface Alert {
  type: string;
  message: string;
  severity: "info" | "warning" | "error";
  icon?: React.ElementType;
}
const stateCityMap: { [state: string]: { city: string; lat: number; lon: number }[] } = {}; // make sure it's not {}
// Fill map:
indianCities.forEach(entry => {
  if (!stateCityMap[entry.State]) stateCityMap[entry.State] = [];
  stateCityMap[entry.State].push({
    city: entry.Location,
    lat: entry.Latitude,
    lon: entry.Longitude
  });
});

const states = Object.keys(stateCityMap);
export default function Dashboard() {
// Assume: indianCities is an array from your JSON file above
const [selectedState, setSelectedState] = useState(states[0]);
  const [selectedCity, setSelectedCity] = useState(stateCityMap[states[0]][0].city);
  const [cityLatLon, setCityLatLon] = useState(stateCityMap[states[0]][0]);
  //...other state for farm, weather, alerts, etc.
  const [currentFarmDataEntry, setCurrentFarmDataEntry] = useState<CropYieldEntry | null>(null);

  // When dropdowns change
useEffect(() => {
  const arr = stateCityMap[selectedState] ?? [];
  const latLon = arr.find(c => c.city === selectedCity) || arr[0]; // fallback
  setCityLatLon(latLon);

  const match = allCropDataImport.find(d => d.State === selectedState);
  setCurrentFarmDataEntry(match);

  // fetchWeatherData(cityLatLon?.city, selectedState, cityLatLon?.lat, cityLatLon?.lon)
  // ... other state updates as needed
}, [selectedState, selectedCity]);

// Defensive: always check for undefined before using cityLatLon
if (!cityLatLon) {
  // Show an error or fallback for UI
}
useEffect(() => {
  const arr = stateCityMap[selectedState] ?? [];
  const latLon = arr.find(c => c.city === selectedCity) || arr[0]; // fallback
  setCityLatLon(latLon);

  const match = allCropDataImport.find(d => d.State === selectedState);
  setCurrentFarmDataEntry(match);

  // fetchWeatherData(cityLatLon?.city, selectedState, cityLatLon?.lat, cityLatLon?.lon)
  // ... other state updates as needed
}, [selectedState, selectedCity]);

// ...component logic and dropdown mapping

  
  const [allFarmsData, setAllFarmsData] = useState<CropYieldEntry[]>([]);
  const [currentFarmIndex, setCurrentFarmIndex] = useState(0);

  const [farmData, setFarmData] = useState<FarmData>({
    totalArea: 0,
    cropsGrown: 0,
    diseasesPredicted: 0,
    recommendationsGiven: 0,
    currentSeason: "Loading...",
    location: "Loading...",
  });

  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [soilHealth, setSoilHealth] = useState<SoilHealthData>({
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    ph: 0,
    moisture: 0,
  });
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    forecast: "Loading weather...",
    latitude: undefined, // Explicitly undefined initially
    longitude: undefined, // Explicitly undefined initially
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Loading states
  const [loadingFarm, setLoadingFarm] = useState(true);
  const [loadingSoil, setLoadingSoil] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  // Error states
  const [errorFarm, setErrorFarm] = useState<string | null>(null);
  const [errorSoil, setErrorSoil] = useState<string | null>(null);
  const [errorWeather, setErrorWeather] = useState<string | null>(null);
  const [errorActivities, setErrorActivities] = useState<string | null>(null);
  const [errorAlerts, setErrorAlerts] = useState<string | null>(null);

  const stateToCityMap: { [key: string]: { city: string; lat: number; lon: number } } = {
    "Andhra Pradesh": { city: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
    "Arunachal Pradesh": { city: "Itanagar", lat: 27.1099, lon: 93.6247 },
    "Assam": { city: "Guwahati", lat: 26.1445, lon: 91.7362 },
    "Bihar": { city: "Patna", lat: 25.5941, lon: 85.1376 },
    "Chhattisgarh": { city: "Raipur", lat: 21.2514, lon: 81.6296 },
    "Goa": { city: "Panaji", lat: 15.4989, lon: 73.8278 },
    "Gujarat": { city: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
    "Haryana": { city: "Chandigarh", lat: 30.7333, lon: 76.7794 },
    "Himachal Pradesh": { city: "Shimla", lat: 31.1048, lon: 77.1734 },
    "Jammu and Kashmir": { city: "Srinagar", lat: 34.0837, lon: 74.7973 },
    "Jharkhand": { city: "Ranchi", lat: 23.3441, lon: 85.3096 },
    "Karnataka": { city: "Bengaluru", lat: 12.9716, lon: 77.5946 },
    "Kerala": { city: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
    "Madhya Pradesh": { city: "Bhopal", lat: 23.2599, lon: 77.4126 },
    "Maharashtra": { city: "Mumbai", lat: 19.0760, lon: 72.8777 }, // Nagpur is ~21.1466, 79.0888
    "Manipur": { city: "Imphal", lat: 24.8170, lon: 93.9368 },
    "Meghalaya": { city: "Shillong", lat: 25.5788, lon: 91.8933 },
    "Mizoram": { city: "Aizawl", lat: 23.7271, lon: 92.7176 },
    "Nagaland": { city: "Kohima", lat: 25.6660, lon: 94.1064 },
    "Odisha": { city: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
    "Punjab": { city: "Chandigarh", lat: 30.7333, lon: 76.7794 },
    "Rajasthan": { city: "Jaipur", lat: 26.9124, lon: 75.7873 },
    "Tamil Nadu": { city: "Chennai", lat: 13.0827, lon: 80.2707 },
    "Telangana": { city: "Hyderabad", lat: 17.3850, lon: 78.4867 },
    "Tripura": { city: "Agartala", lat: 23.8315, lon: 91.2868 },
    "Uttar Pradesh": { city: "Lucknow", lat: 26.8467, lon: 80.9462 },
    "Uttarakhand": { city: "Dehradun", lat: 30.3165, lon: 78.0322 },
    "West Bengal": { city: "Kolkata", lat: 22.5726, lon: 88.3639 },
  };

  const fetchWeatherData = useCallback(async (locationName: string) => {
    if (!locationName || locationName === "Loading...") {
      console.warn("Location not provided for weather fetch.");
      setLoadingWeather(false);
      return;
    }

    setLoadingWeather(true);
    setErrorWeather(null);
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    const locationInfo = stateToCityMap[locationName] || { city: "New Delhi", lat: 28.6139, lon: 77.2090 };
    const CITY_FOR_WEATHER_API = locationInfo.city;
    const { lat: WEATHER_LAT, lon: WEATHER_LON } = locationInfo;

    const COUNTRY_CODE = "IN";

    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_FOR_WEATHER_API},${COUNTRY_CODE}&appid=${API_KEY}&units=metric`;
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY_FOR_WEATHER_API},${COUNTRY_CODE}&appid=${API_KEY}&units=metric`;

    try {
      const [currentWeatherRes, forecastRes] = await Promise.all([
        axios.get(WEATHER_URL),
        axios.get(FORECAST_URL)
      ]);

      const current = currentWeatherRes.data;
      const forecast = forecastRes.data.list;

      const weeklyRainfall = forecast
        .filter(item => item.dt_txt.includes("12:00:00"))
        .reduce((sum, item) => sum + (item.rain?.["3h"] || 0), 0);

      setWeatherData({
        temperature: Math.round(current.main.temp),
        humidity: current.main.humidity,
        rainfall: weeklyRainfall > 0 ? parseFloat(weeklyRainfall.toFixed(1)) : 0,
        forecast: forecast[0]?.weather[0]?.description || "No forecast available",
        latitude: WEATHER_LAT,
        longitude: WEATHER_LON,
      });
    } catch (err) {
      console.error("Error fetching weather data for", locationName, ":", err);
      setErrorWeather(`Failed to fetch weather for ${locationName}.`);
      setWeatherData({
        temperature: "--",
        humidity: "--",
        rainfall: "--",
        forecast: "Failed to load forecast.",
        latitude: undefined, // Clear coords on error
        longitude: undefined,
      });
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const fetchSimulatedBackendData = useCallback(async () => {
    setLoadingActivities(true);
    setLoadingAlerts(true);
    setErrorActivities(null);
    setErrorAlerts(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const activities = [
        { type: "crop", message: "New AI recommendation generated.", time: "Just now" },
        { type: "disease", message: "Checking for early blight symptoms.", time: "10 minutes ago" },
        { type: "chat", message: "User inquired about fertilizer prices.", time: "1 hour ago" },
        { type: "system", message: `Dashboard data refreshed.`, time: "Now" },
      ];
      setRecentActivities(activities); // or merge safely below

    } catch (err) {
      setErrorActivities("Failed to load recent activities.");
    } finally {
      setLoadingActivities(false);
    }

    try {
      const newAlerts: Alert[] = [];
      if (soilHealth.potassium < 50 && currentFarmDataEntry) {
        newAlerts.push({
          type: "soil",
          message: `Low potassium levels (${soilHealth.potassium}%) detected in ${currentFarmDataEntry.State}.`,
          severity: "warning",
          icon: AlertTriangle
        });
      }
      if (weatherData.rainfall && typeof weatherData.rainfall === 'number' && weatherData.rainfall > 50) {
        newAlerts.push({
          type: "weather",
          message: `High rainfall (${weatherData.rainfall}mm) expected. Monitor drainage.`,
          severity: "info",
          icon: Droplets
        });
      }
      // Combine new alerts with existing ones, filtering by message for simple uniqueness
      // This directly addresses the 'unknown' type error during merging SetStateAction<Alert[]>
      setAlerts(prev => {
        const existingAlertMessages = new Set(prev.map(alert => alert.message));
        const uniqueNewAlerts = newAlerts.filter(alert => !existingAlertMessages.has(alert.message));
        return [...prev, ...uniqueNewAlerts];
      });

    } catch (err) {
      setErrorAlerts("Failed to load alerts.");
    } finally {
      setLoadingAlerts(false);
    }
  }, [soilHealth.potassium, currentFarmDataEntry, weatherData.rainfall]);


  useEffect(() => {
    // Explicitly cast allCropDataImport to CropYieldEntry[]
    const initialFarmData: CropYieldEntry[] = allCropDataImport as CropYieldEntry[];
    setAllFarmsData(initialFarmData);

    if (initialFarmData.length > 0) {
      setCurrentFarmDataEntry(initialFarmData[currentFarmIndex]);
    } else {
        setErrorFarm("No crop data found.");
        setLoadingFarm(false);
        setLoadingSoil(false);
        setLoadingWeather(false);
        setLoadingActivities(false);
        setLoadingAlerts(false);
    }
  }, [currentFarmIndex]); // Dependency added: currentFarmIndex for initial load


  useEffect(() => {
    if (currentFarmDataEntry) {
      setLoadingFarm(true);
      setLoadingSoil(true);
      setErrorFarm(null);
      setErrorSoil(null);

      setFarmData({
        totalArea: currentFarmDataEntry.Area,
        cropsGrown: currentFarmDataEntry.Crop ? 1 : 0,
        diseasesPredicted: Math.floor(Math.random() * 5),
        recommendationsGiven: Math.floor(Math.random() * 20) + 10,
        currentSeason: currentFarmDataEntry.Season,
        location: currentFarmDataEntry.State,
      });

      setSoilHealth({
        nitrogen: currentFarmDataEntry.N_SOIL,
        phosphorus: currentFarmDataEntry.P_SOIL,
        potassium: currentFarmDataEntry.K_SOIL,
        ph: currentFarmDataEntry.ph,
        moisture: currentFarmDataEntry.HUMIDITY,
      });

      setLoadingFarm(false);
      setLoadingSoil(false);

      fetchWeatherData(currentFarmDataEntry.State);
      fetchSimulatedBackendData();

    }
  }, [currentFarmDataEntry, fetchWeatherData, fetchSimulatedBackendData]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentFarmDataEntry?.State) {
        fetchWeatherData(currentFarmDataEntry.State);
      }
      fetchSimulatedBackendData();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currentFarmDataEntry, fetchWeatherData, fetchSimulatedBackendData]);


  const handleNextFarm = () => {
    setCurrentFarmIndex((prevIndex) => (prevIndex + 1) % allFarmsData.length);
  };

  const handlePrevFarm = () => {
    setCurrentFarmIndex((prevIndex) => (prevIndex - 1 + allFarmsData.length) % allFarmsData.length);
  };

  const renderDataOrStatus = (data: string | number, isLoading: boolean, error: string | null, unit = "") => {
    if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    if (error) return <span className="text-red-500 text-sm">{error}</span>;
    return `${data}${unit}`;
  };

  const renderSectionContent = (isLoading: boolean, error: string | null, children: React.ReactNode, loadingMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[100px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-muted-foreground">{loadingMessage}</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[100px] text-red-500">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <span>{error}</span>
        </div>
      );
    }
    return children;
  };
    const { t } = useLanguage()

  return (
  <div className="space-y-6">

  {/* State & City Selector */}
  <div className="space-y-6 max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    {/* State Selector */}
    <div className="flex flex-col mb-4">
      <label htmlFor="state-select" className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Select State
      </label>
      <select
        id="state-select"
        value={selectedState}
        onChange={e => {
          const nextState = e.target.value;
          setSelectedState(nextState);
          setSelectedCity(stateCityMap[nextState][0]?.city || '');
        }}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-800 dark:text-white"
      >
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
    </div>

    {/* City Selector */}
    <div className="flex flex-col">
      <label htmlFor="city-select" className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Select City
      </label>
      <select
        id="city-select"
        value={selectedCity}
        onChange={e => setSelectedCity(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-800 dark:text-white"
      >
        {stateCityMap[selectedState]?.map(c => (
          <option key={c.city} value={c.city}>{c.city}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Farm Navigation */}
  {allFarmsData.length > 0 && (
    <div className="flex items-center justify-center gap-4 mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
      <button
        onClick={handlePrevFarm}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1"
        disabled={loadingFarm || allFarmsData.length === 0}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("dashboard.previous_farm")}
      </button>
      <span className="text-md font-semibold text-gray-700 dark:text-gray-300">
        {t("dashboard.Viewing")}: 
        <span className="text-blue-600 dark:text-blue-400">
          {currentFarmDataEntry?.Crop || 'N/A'} in {currentFarmDataEntry?.State || 'N/A'} ({currentFarmDataEntry?.Crop_Year || 'N/A'})
        </span>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          ( {t("dashboard.entry")} {currentFarmIndex + 1} of {allFarmsData.length})
        </span>
      </span>
      <button
        onClick={handleNextFarm}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1"
        disabled={loadingFarm || allFarmsData.length === 0}
      >
        {t("dashboard.next_farm")}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )}

  {/* Overview Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/** Total Area Card */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("dashboard.total_area")}</CardTitle>
        <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{renderDataOrStatus(farmData.totalArea, loadingFarm, errorFarm, " acres")}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.location")}{farmData.location}</p>
      </CardContent>
    </Card>

    {/** Crops Grown Card */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("dashboard.crops_grown")}</CardTitle>
        <Leaf className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{renderDataOrStatus(farmData.cropsGrown, loadingFarm, errorFarm)}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.current_season")}{farmData.currentSeason}</p>
      </CardContent>
    </Card>

    {/** Diseases Predicted Card */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("dashboard.diseases_predicted")}</CardTitle>
        <Bug className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{renderDataOrStatus(farmData.diseasesPredicted, loadingFarm, errorFarm)}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.this_month")}</p>
      </CardContent>
    </Card>

    {/** AI Recommendations Card */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("dashboard.ai_recommendations")}</CardTitle>
        <TrendingUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{renderDataOrStatus(farmData.recommendationsGiven, loadingFarm, errorFarm)}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.total_given")}</p>
      </CardContent>
    </Card>
  </div>

  {/* Soil Health & Weather */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/** Soil Health Card */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><Leaf className="w-5 h-5" />{t("dashboard.soil_health")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderSectionContent(loadingSoil, errorSoil,
          <div className="space-y-3">
            {['nitrogen','phosphorus','potassium'].map((elem) => (
              <div key={elem}>
                <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-gray-300">
                  <span>{t(`dashboard.${elem}`)}</span>
                  <span suppressHydrationWarning>{soilHealth[elem]}%</span>
                </div>
                <Progress value={soilHealth[elem]} className="h-2" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 pt-2 text-gray-700 dark:text-gray-300">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("dashboard.ph_level")}</p>
                <p className="text-lg font-semibold" suppressHydrationWarning>{soilHealth.ph}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("dashboard.moisture_content")}</p>
                <p className="text-lg font-semibold" suppressHydrationWarning>{soilHealth.moisture}%</p>
              </div>
            </div>
          </div>,
          t("dashboard.loading_soil_health")
        )}
      </CardContent>
    </Card>

    {/** Weather Card */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><Thermometer className="w-5 h-5" />{t("dashboard.weather_information")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderSectionContent(loadingWeather, errorWeather,
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center text-gray-700 dark:text-gray-300">
                <Thermometer className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold" suppressHydrationWarning>{weatherData.temperature}°C</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("dashboard.temperature")}</p>
              </div>
              <div className="text-center text-gray-700 dark:text-gray-300">
                <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold" suppressHydrationWarning>{weatherData.humidity}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("dashboard.humidity")}</p>
              </div>
            </div>
            <div className="text-center pt-2 text-gray-700 dark:text-gray-300">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t("dashboard.weekly_rainfall")}</p>
              <p className="text-lg font-semibold" suppressHydrationWarning>{weatherData.rainfall} mm</p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-800 p-3 rounded-lg text-gray-700 dark:text-gray-300">
              <p className="text-sm font-medium">{t("dashboard.weather_forecast")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>{weatherData.forecast}</p>
            </div>
          </>,
          t("dashboard.loading_weather")
        )}
      </CardContent>
    </Card>
  </div>

  {/* Farm Location Map */}
  <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><MapPin className="w-5 h-5" />{t("dashboard.farm_location_map")}</CardTitle>
    </CardHeader>
    <CardContent>
      {loadingWeather ? (
        <div className="flex justify-center items-center h-[300px] border rounded-lg bg-gray-50 dark:bg-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-700 dark:text-gray-300">{t("dashboard.loading_map")}</span>
        </div>
      ) : errorWeather ? (
        <div className="flex justify-center items-center h-[300px] text-red-500 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <span>{t("dashboard.error_loading_map")}: {errorWeather}</span>
        </div>
      ) : (weatherData.latitude !== undefined && weatherData.longitude !== undefined) ? (
        <DynamicFarmMap position={[weatherData.latitude, weatherData.longitude]} locationName={farmData.location} zoom={9} />
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-700 dark:text-gray-300 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <MapPin className="h-6 w-6 mr-2" />
          <span>{t("dashboard.no_location_data")}</span>
        </div>
      )}
    </CardContent>
  </Card>

  {/* Recent Activities */}
  <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><Calendar className="w-5 h-5" />{t("dashboard.recent_activities")}</CardTitle>
    </CardHeader>
    <CardContent>
      {renderSectionContent(loadingActivities, errorActivities,
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">{t("dashboard.no_recent_activities")}</p>
          ) : recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-shrink-0">
                {activity.type === "crop" && <Leaf className="w-5 h-5 text-green-600" />}
                {activity.type === "disease" && <Bug className="w-5 h-5 text-red-600" />}
                {activity.type === "chat" && <TrendingUp className="w-5 h-5 text-blue-600" />}
                {activity.type === "system" && <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{activity.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
              <Badge variant={activity.type === "disease" ? "destructive" : "secondary"}>{activity.type}</Badge>
            </div>
          ))}
        </div>,
        t("dashboard.loading_recent_activities")
      )}
    </CardContent>
  </Card>

  {/* Alerts */}
  <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
        <AlertTriangle className="w-5 h-5" />{t("dashboard.alertss")}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {renderSectionContent(loadingAlerts, errorAlerts,
        alerts.length === 0 ? (
          <p className="text-sm text-yellow-700 dark:text-yellow-300">{t("dashboard.no_alerts")}</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                {alert.icon ? <alert.icon className={`w-4 h-4 ${alert.severity === "warning" ? "text-yellow-600" : (alert.severity === "error" ? "text-red-600" : "text-blue-600")}`} /> : <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                <span className="text-sm">{alert.message}</span>
              </div>
            ))}
          </div>
        ),
        t("dashboard.loading_alerts")
      )}
    </CardContent>
  </Card>
</div>

  );
}
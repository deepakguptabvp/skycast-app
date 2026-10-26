"use client";
import React from "react";
import {
  Compass,
  Shirt,
  Car,
  Sun,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const LifestyleIndex = ({ currentWeatherData }) => {
  const data = currentWeatherData?.data;
  if (!data) return null;

  const temp = data.main?.temp ?? 25;
  const weatherId = data.weather?.[0]?.id || 800;
  const visibility = (data.visibility || 10000) / 1000; // km
  const isRain = weatherId >= 200 && weatherId < 600;
  const isStorm = weatherId >= 200 && weatherId < 300;

  // 1. Running & Outdoor Exercise
  let outdoorScore = "Excellent";
  let outdoorColor = "text-emerald-300";
  let outdoorDesc = "Optimal temperature and clear air for jogging or cycling.";
  if (isStorm || isRain) {
    outdoorScore = "Not Recommended";
    outdoorColor = "text-rose-400";
    outdoorDesc = "Wet surfaces and rain. Prefer indoor workout sessions.";
  } else if (temp >= 36) {
    outdoorScore = "Caution - Hot";
    outdoorColor = "text-amber-400";
    outdoorDesc = "High heat risk. Run early morning or evening; hydrate heavily.";
  } else if (temp <= 6) {
    outdoorScore = "Cold Conditions";
    outdoorColor = "text-cyan-300";
    outdoorDesc = "Chilly air. Wear insulated thermal workout gear.";
  }

  // 2. Attire & Dressing Advice
  let attireTitle = "Light & Breathable";
  let attireDesc = "Wear comfortable cotton fabrics, t-shirts, and sunglasses.";
  if (isRain) {
    attireTitle = "Waterproof Gear";
    attireDesc = "Raincoat or umbrella is mandatory. Wear water-resistant shoes.";
  } else if (temp >= 34) {
    attireTitle = "Summer Cottons";
    attireDesc = "Loose linen/cotton wear, wide-brim hat, and UV sunglasses.";
  } else if (temp <= 12) {
    attireTitle = "Warm Layering";
    attireDesc = "Sweater, fleece jacket, and warm footwear advised.";
  }

  // 3. Driving & Travel
  let travelStatus = "Smooth Driving";
  let travelColor = "text-emerald-300";
  let travelDesc = "Clear roads with excellent visibility across all routes.";
  if (isStorm) {
    travelStatus = "Storm Alert";
    travelColor = "text-rose-400";
    travelDesc = "Slow down. Severe rain may cause hydroplaning and low visibility.";
  } else if (visibility < 3) {
    travelStatus = "Fog / Low Visibility";
    travelColor = "text-amber-400";
    travelDesc = "Dense mist or smog reported. Use fog lights and keep distance.";
  } else if (isRain) {
    travelStatus = "Wet Roadways";
    travelColor = "text-amber-300";
    travelDesc = "Slick roads. Avoid sudden braking and allow extra travel time.";
  }

  // 4. UV Protection
  let uvLevel = "Moderate";
  let uvColor = "text-amber-300";
  let uvDesc = "Apply SPF 30 sunscreen if staying outdoors over 30 minutes.";
  if (temp >= 33 && weatherId === 800) {
    uvLevel = "Very High";
    uvColor = "text-rose-400";
    uvDesc = "Intense solar radiation. Apply SPF 50+, seek shade midday.";
  } else if (isRain || weatherId > 802) {
    uvLevel = "Low";
    uvColor = "text-emerald-300";
    uvDesc = "Cloud cover provides natural shade. Minimal sun hazard.";
  }

  const indices = [
    {
      title: "Outdoor Sports",
      status: outdoorScore,
      color: outdoorColor,
      desc: outdoorDesc,
      icon: Compass,
      badge: outdoorScore === "Excellent" ? CheckCircle2 : AlertCircle,
    },
    {
      title: "Attire Advice",
      status: attireTitle,
      color: "text-cyan-300",
      desc: attireDesc,
      icon: Shirt,
      badge: Sparkles,
    },
    {
      title: "Travel & Commute",
      status: travelStatus,
      color: travelColor,
      desc: travelDesc,
      icon: Car,
      badge: travelStatus.includes("Smooth") ? CheckCircle2 : AlertCircle,
    },
    {
      title: "UV & Sun Exposure",
      status: uvLevel,
      color: uvColor,
      desc: uvDesc,
      icon: Sun,
      badge: uvLevel === "Low" ? CheckCircle2 : AlertCircle,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Daily Lifestyle & Travel Activity Index
        </h3>
        <span className="text-xs text-slate-400">Contextual Recommendations</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {indices.map((idx) => {
          const Icon = idx.icon;
          const BadgeIcon = idx.badge;

          return (
            <div
              key={idx.title}
              className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-white/10"
            >
              <div>
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    {idx.title}
                  </span>
                  <BadgeIcon className={`w-3.5 h-3.5 ${idx.color}`} />
                </div>
                <h4 className={`text-base font-extrabold ${idx.color} mt-1`}>
                  {idx.status}
                </h4>
              </div>

              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {idx.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LifestyleIndex;

"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

// Standard Geohash encoding
function encodeGeohash(latitude: number, longitude: number, precision = 9): string {
  const BITS = [16, 8, 4, 2, 1];
  const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
  let isEven = true;
  const lat = [-90.0, 90.0];
  const lon = [-180.0, 180.0];
  let geohash = "";
  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    if (isEven) {
      const mid = (lon[0] + lon[1]) / 2;
      if (longitude >= mid) {
        ch |= BITS[bit];
        lon[0] = mid;
      } else {
        lon[1] = mid;
      }
    } else {
      const mid = (lat[0] + lat[1]) / 2;
      if (latitude >= mid) {
        ch |= BITS[bit];
        lat[0] = mid;
      } else {
        lat[1] = mid;
      }
    }
    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}

function toDms(deg: number, isLat: boolean): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  const direction = isLat ? (deg >= 0 ? "N" : "S") : deg >= 0 ? "E" : "W";
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

export function CoordinateConverterTool() {
  const [lat, setLat] = useState("40.7128");
  const [lng, setLng] = useState("-74.0060");
  const [hasConverted, setHasConverted] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  const results = useMemo(() => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      return { valid: false, error: "Coordinates out of valid range (-90 to 90 for Lat, -180 to 180 for Long)." };
    }

    const dmsLat = toDms(latNum, true);
    const dmsLng = toDms(lngNum, false);
    const geohash = encodeGeohash(latNum, lngNum, 9);
    const dd = `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`;
    const osmUrl = `https://www.openstreetmap.org/?mlat=${latNum}&mlon=${lngNum}#map=14/${latNum}/${lngNum}`;

    return {
      valid: true,
      dd,
      dms: `${dmsLat}, ${dmsLng}`,
      dmsLat,
      dmsLng,
      geohash,
      osmUrl,
    };
  }, [lat, lng]);

  const handleConvert = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!results || !results.valid || limitReached) return;
    setHasConverted(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleConvert} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="coord-lat" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Latitude (-90.0 to 90.0)
            </label>
            <input
              id="coord-lat"
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 40.7128"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="coord-lng" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Longitude (-180.0 to 180.0)
            </label>
            <input
              id="coord-lng"
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="e.g. -74.0060"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
            <span>Landmarks:</span>
            {[
              { label: "New York City", lat: "40.7128", lng: "-74.0060" },
              { label: "London", lat: "51.5074", lng: "-0.1278" },
              { label: "Tokyo", lat: "35.6762", lng: "139.6503" },
              { label: "Dhaka", lat: "23.8103", lng: "90.4125" },
              { label: "Sydney", lat: "-33.8688", lng: "151.2093" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={limitReached}
                onClick={() => {
                  setLat(item.lat);
                  setLng(item.lng);
                }}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={limitReached}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Convert coordinates</span>
          </button>
        </div>
      </form>

      {results && !results.valid && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {results.error}
        </div>
      )}

      {results && results.valid && (hasConverted || !limitReached) && (
        <ResultCard
          title="Geographic Coordinate Conversions"
          items={[
            { label: "Decimal Degrees (DD)", value: results.dd, copyValue: results.dd, mono: true },
            { label: "Degrees Minutes Seconds (DMS)", value: results.dms, copyValue: results.dms, mono: true },
            { label: "Geohash (Precision 9)", value: results.geohash, copyValue: results.geohash, mono: true },
            {
              label: "OpenStreetMap Mapping",
              value: (
                <a
                  href={results.osmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0071e3] dark:text-blue-400 hover:underline font-mono text-xs sm:text-sm"
                >
                  View coordinate on OpenStreetMap &rarr;
                </a>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}

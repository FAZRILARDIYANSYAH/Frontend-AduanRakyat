"use client";

import {
  useState,
  useEffect,
} from "react";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

type Props = {
  onSelectLocation: (
    location: string
  ) => void;
};

function ChangeMapView({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

function LocationMarker({
  onSelectLocation,
  position,
  setPosition,
}: {
  onSelectLocation: (
    location: string
  ) => void;

  position: [
    number,
    number
  ];

  setPosition: (
    pos: [number, number]
  ) => void;
}) {
  useMapEvents({
    async click(e: any) {
      const lat =
        e.latlng.lat;

      const lng =
        e.latlng.lng;

      setPosition([
        lat,
        lng,
      ]);

      try {
        // reverse geocoding
        const res =
          await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

        const data =
          await res.json();

        const address =
          data.display_name ||
          `${lat}, ${lng}`;

        onSelectLocation(
          address
        );
      } catch (err) {
        console.log(err);

        // fallback koordinat
        onSelectLocation(
          `${lat}, ${lng}`
        );
      }
    },
  });

  return (
    <Marker
      position={position}
    />
  );
}

export default function MapPicker({
  onSelectLocation,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [position, setPosition] =
    useState<
      [number, number]
    >([
      -6.914744,
      107.60981,
    ]);

  const searchLocation =
    async () => {
      if (!search.trim())
        return;

      try {
        const res =
          await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              search
            )}`
          );

        const data =
          await res.json();

        if (
          data &&
          data.length > 0
        ) {
          const lat =
            parseFloat(
              data[0].lat
            );

          const lon =
            parseFloat(
              data[0].lon
            );

          setPosition([
            lat,
            lon,
          ]);

          // simpan alamat
          onSelectLocation(
            data[0]
              .display_name
          );
        }
      } catch (err) {
        console.log(
          "Search error:",
          err
        );
      }
    };

  return (
    <div className="space-y-4">
      {/* Search lokasi */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari lokasi (contoh: Jakarta, Bandung, Monas)"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            onKeyDown={(
              e
            ) => {
              if (
                e.key ===
                "Enter"
              ) {
                searchLocation();
              }
            }}
            className="
              w-full
              px-4
              py-3.5
              rounded-xl
              border
              border-slate-200
              bg-slate-50/50
              text-slate-800
              placeholder:text-slate-400
              focus:border-indigo-400
              focus:bg-white
              focus:ring-4
              focus:ring-indigo-100/60
              outline-none
              transition-all
              text-sm
              font-medium
            "
          />
        </div>

        <button
          type="button"
          onClick={
            searchLocation
          }
          className="
            px-5
            rounded-xl
            bg-gradient-to-r
            from-indigo-600
            to-blue-600
            hover:from-indigo-700
            hover:to-blue-700
            text-white
            font-bold
            text-sm
            transition-all
            shadow-lg
            shadow-indigo-200/70
          "
        >
          Cari
        </button>
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <MapContainer
          center={position}
          zoom={13}
          className="z-0"
          style={{
            height: "320px",
            width: "100%",
          }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ChangeMapView
            center={position}
          />


          <LocationMarker
            position={position}
            setPosition={
              setPosition
            }
            onSelectLocation={
              onSelectLocation
            }
          />
        </MapContainer>
      </div>
    </div>
  );
}
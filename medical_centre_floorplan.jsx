import { useState } from "react";
import { Building2, Ruler, LayoutGrid, Info } from "lucide-react";

const ZONE_COLORS = {
  public: { bg: "rgba(16,185,129,0.25)", hover: "rgba(16,185,129,0.45)", stroke: "#10b981", label: "Public", gradient: "from-emerald-500 to-cyan-500" },
  clinical: { bg: "rgba(59,130,246,0.25)", hover: "rgba(59,130,246,0.45)", stroke: "#3b82f6", label: "Clinical", gradient: "from-blue-500 to-cyan-500" },
  staff: { bg: "rgba(245,158,11,0.25)", hover: "rgba(245,158,11,0.45)", stroke: "#f59e0b", label: "Staff", gradient: "from-amber-500 to-orange-500" },
  admin: { bg: "rgba(139,92,246,0.25)", hover: "rgba(139,92,246,0.45)", stroke: "#8b5cf6", label: "Meetings & Admin", gradient: "from-purple-500 to-violet-500" },
  service: { bg: "rgba(107,114,128,0.25)", hover: "rgba(107,114,128,0.45)", stroke: "#6b7280", label: "Service", gradient: "from-gray-500 to-gray-600" },
  circulation: { bg: "rgba(71,85,105,0.25)", hover: "rgba(71,85,105,0.45)", stroke: "#475569", label: "Circulation", gradient: "from-slate-500 to-slate-600" },
};

const GROUND_FLOOR_ROOMS = [
  // Public Zone
  { id: "entrance", name: "Entrance Lobby", zone: "public", area: 12, x: 0, y: 0, w: 15, h: 10 },
  { id: "reception", name: "Reception Desk", zone: "public", area: 20, x: 15, y: 0, w: 20, h: 10 },
  { id: "waiting", name: "Waiting Area", zone: "public", area: 29, x: 35, y: 0, w: 25, h: 12 },
  { id: "childrens", name: "Children's Play Area", zone: "public", area: 11, x: 60, y: 0, w: 15, h: 8 },
  { id: "pharmacy", name: "Pharmacy", zone: "public", area: 35, x: 75, y: 0, w: 30, h: 12 },
  { id: "pharmacy-store", name: "Pharmacy Store", zone: "public", area: 12, x: 75, y: 12, w: 15, h: 8 },
  { id: "wc-std", name: "Standard WC", zone: "public", area: 4, x: 60, y: 8, w: 7, h: 6 },
  { id: "wc-access", name: "Accessible WC", zone: "public", area: 6, x: 67, y: 8, w: 8, h: 6 },
  // Clinical Zone
  { id: "consult-1", name: "Consulting Room 1", zone: "clinical", area: 16, x: 0, y: 20, w: 17, h: 13 },
  { id: "consult-2", name: "Consulting Room 2", zone: "clinical", area: 16, x: 17, y: 20, w: 17, h: 13 },
  { id: "consult-3", name: "Consulting Room 3", zone: "clinical", area: 16, x: 34, y: 20, w: 17, h: 13 },
  { id: "consult-4", name: "Consulting Room 4", zone: "clinical", area: 16, x: 51, y: 20, w: 17, h: 13 },
  { id: "store-1", name: "Consulting Store 1", zone: "clinical", area: 5, x: 0, y: 33, w: 8, h: 7 },
  { id: "store-2", name: "Consulting Store 2", zone: "clinical", area: 5, x: 8, y: 33, w: 8, h: 7 },
  { id: "store-3", name: "Consulting Store 3", zone: "clinical", area: 5, x: 16, y: 33, w: 8, h: 7 },
  { id: "store-4", name: "Consulting Store 4", zone: "clinical", area: 5, x: 24, y: 33, w: 8, h: 7 },
  { id: "nurse-1", name: "Nurses' Consulting 1", zone: "clinical", area: 17, x: 68, y: 20, w: 18, h: 14 },
  { id: "nurse-2", name: "Nurses' Consulting 2", zone: "clinical", area: 17, x: 86, y: 20, w: 19, h: 14 },
  { id: "physio", name: "Physiotherapy Room", zone: "clinical", area: 48, x: 68, y: 34, w: 37, h: 13 },
  // Corridor / Circulation
  { id: "corridor-gf", name: "Corridor", zone: "circulation", area: 18, x: 0, y: 10, w: 105, h: 10 },
  // Service Zone
  { id: "cleaner", name: "Cleaners' Store", zone: "service", area: 6, x: 0, y: 40, w: 12, h: 7 },
  { id: "plant-gf", name: "Plant Room", zone: "service", area: 50, x: 12, y: 40, w: 40, h: 14 },
  // First floor access
  { id: "stair-a", name: "Staircase A", zone: "circulation", area: 9, x: 52, y: 40, w: 12, h: 14 },
  { id: "lift", name: "Lift Shaft", zone: "circulation", area: 11, x: 64, y: 40, w: 13, h: 14 },
  { id: "stair-b", name: "Staircase B", zone: "circulation", area: 9, x: 77, y: 40, w: 12, h: 14 },
  { id: "ext-store", name: "External Store", zone: "service", area: 15, x: 89, y: 40, w: 16, h: 14 },
];

const FIRST_FLOOR_ROOMS = [
  { id: "staffroom", name: "Staffroom", zone: "staff", area: 30, x: 0, y: 0, w: 30, h: 20 },
  { id: "changing-1", name: "Changing Room 1", zone: "staff", area: 22, x: 30, y: 0, w: 20, h: 20 },
  { id: "changing-2", name: "Changing Room 2", zone: "staff", area: 22, x: 50, y: 0, w: 20, h: 20 },
  { id: "meeting-1", name: "Meeting Room 1", zone: "admin", area: 20, x: 0, y: 30, w: 22, h: 18 },
  { id: "meeting-2", name: "Meeting Room 2", zone: "admin", area: 20, x: 22, y: 30, w: 22, h: 18 },
  { id: "clinical-store", name: "General Clinical Storage", zone: "service", area: 40, x: 44, y: 30, w: 35, h: 18 },
  { id: "it-room", name: "IT / Comms Room", zone: "service", area: 6, x: 79, y: 30, w: 12, h: 9 },
  { id: "plant-ff", name: "Plant Room", zone: "service", area: 9, x: 79, y: 39, w: 12, h: 9 },
  { id: "corridor-ff", name: "Corridor", zone: "circulation", area: 14, x: 0, y: 20, w: 91, h: 10 },
  { id: "stair-a-ff", name: "Staircase A", zone: "circulation", area: 9, x: 91, y: 0, w: 14, h: 24 },
  { id: "lift-ff", name: "Lift Shaft", zone: "circulation", area: 11, x: 91, y: 24, w: 14, h: 24 },
];

function Room({ room, hovered, onEnter, onLeave }) {
  const zone = ZONE_COLORS[room.zone];
  const isHovered = hovered === room.id;
  const fill = isHovered ? zone.hover : zone.bg;
  const stroke = isHovered ? "#34d399" : zone.stroke;
  const strokeWidth = isHovered ? 0.6 : 0.3;

  const cx = room.x + room.w / 2;
  const cy = room.y + room.h / 2;
  const fontSize = Math.min(room.w, room.h) < 10 ? 1.6 : 2;

  const words = room.name.split(" ");
  const lines = [];
  let current = "";
  const maxChars = Math.floor(room.w / 1.3);
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current.trim());

  return (
    <g
      onMouseEnter={() => onEnter(room.id)}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer", transition: "all 0.3s" }}
    >
      <rect
        x={room.x}
        y={room.y}
        width={room.w}
        height={room.h}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        rx={0.4}
        style={{ transition: "fill 0.3s, stroke 0.3s, stroke-width 0.3s" }}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={cy + (i - (lines.length - 1) / 2) * (fontSize + 0.6)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fill={isHovered ? "#f0fdf4" : "#cbd5e1"}
          fontFamily="system-ui, sans-serif"
          fontWeight={isHovered ? "600" : "400"}
          style={{ transition: "fill 0.3s, font-weight 0.3s", pointerEvents: "none", userSelect: "none" }}
        >
          {line}
        </text>
      ))}
      {isHovered && (
        <text
          x={cx}
          y={cy + (lines.length / 2) * (fontSize + 0.6) + 1.2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize - 0.2}
          fill="#34d399"
          fontFamily="system-ui, sans-serif"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {room.area} m²
        </text>
      )}
    </g>
  );
}

function FloorPlan({ rooms, hoveredRoom, onRoomEnter, onRoomLeave, viewBox }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-900/80">
      <svg
        viewBox={viewBox}
        className="w-full min-w-[600px]"
        style={{ display: "block" }}
        aria-label="Medical centre floor plan"
      >
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(148,163,184,0.07)" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {rooms.map((room) => (
          <Room
            key={room.id}
            room={room}
            hovered={hoveredRoom}
            onEnter={onRoomEnter}
            onLeave={onRoomLeave}
          />
        ))}
      </svg>
    </div>
  );
}

function RoomDetailPanel({ room }) {
  if (!room) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-center">
        <Info size={28} className="mb-3 text-slate-600" />
        <p className="text-sm font-medium text-slate-500">Hover over a room</p>
        <p className="mt-1 text-xs text-slate-600">to view details</p>
      </div>
    );
  }

  const zone = ZONE_COLORS[room.zone];

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/70 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-start gap-3">
        <span
          className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-br ${zone.gradient}`}
        />
        <div>
          <h3 className="text-base font-semibold leading-tight text-slate-100">{room.name}</h3>
          <span className="mt-1 inline-block rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-400">
            {zone.label} Zone
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="rounded-lg bg-slate-900/60 p-3">
          <p className="text-xs text-slate-500">Area</p>
          <p className="mt-0.5 text-xl font-bold text-emerald-400">{room.area}</p>
          <p className="text-xs text-slate-500">m²</p>
        </div>
        <div className="rounded-lg bg-slate-900/60 p-3">
          <p className="text-xs text-slate-500">Zone</p>
          <p className={`mt-0.5 text-sm font-semibold bg-gradient-to-r ${zone.gradient} bg-clip-text text-transparent`}>
            {zone.label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MedicalCentreFloorPlan() {
  const [activeFloor, setActiveFloor] = useState("ground");
  const [hoveredRoomId, setHoveredRoomId] = useState(null);

  const rooms = activeFloor === "ground" ? GROUND_FLOOR_ROOMS : FIRST_FLOOR_ROOMS;
  const hoveredRoom = rooms.find((r) => r.id === hoveredRoomId) || null;

  const totalArea = rooms.reduce((sum, r) => sum + r.area, 0);
  const viewBox = activeFloor === "ground" ? "0 0 105 56" : "0 0 105 50";

  const groundGIFA = 425;
  const firstGIFA = 115;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
            <Building2 size={13} />
            Medical Facility Design
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            Bare Minimum Medical Centre
          </h1>
          <p className="mt-2 text-slate-400">Interactive Architectural Floor Plan</p>
        </div>

        {/* Floor Selector */}
        <div className="mb-6 flex justify-center gap-3">
          {[
            { key: "ground", label: "Ground Floor", area: `${groundGIFA} m²` },
            { key: "first", label: "First Floor", area: `${firstGIFA} m²` },
          ].map(({ key, label, area }) => (
            <button
              key={key}
              onClick={() => { setActiveFloor(key); setHoveredRoomId(null); }}
              className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeFloor === key
                  ? "scale-105 border-emerald-500/50 bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 text-emerald-300 shadow-lg shadow-emerald-900/30"
                  : "border-slate-700/60 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              <LayoutGrid size={15} />
              <span>{label}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${activeFloor === key ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700/60 text-slate-500"}`}>
                {area}
              </span>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_220px]">
          {/* Floor Plan */}
          <div>
            <FloorPlan
              rooms={rooms}
              hoveredRoom={hoveredRoomId}
              onRoomEnter={setHoveredRoomId}
              onRoomLeave={() => setHoveredRoomId(null)}
              viewBox={viewBox}
            />
          </div>

          {/* Side Panel */}
          <div className="flex flex-col gap-4">
            <RoomDetailPanel room={hoveredRoom} />

            {/* Zone Legend */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Zone Legend
              </p>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {Object.entries(ZONE_COLORS).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm bg-gradient-to-br ${val.gradient}`} />
                    <span className="text-xs text-slate-400">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: <Ruler size={18} className="text-emerald-400" />,
              label: "Ground Floor GIFA",
              value: `${groundGIFA} m²`,
              sub: "Including circulation",
              gradient: "from-emerald-600/20 to-cyan-600/20",
              border: "border-emerald-500/20",
            },
            {
              icon: <Building2 size={18} className="text-blue-400" />,
              label: "First Floor GIFA",
              value: `${firstGIFA} m²`,
              sub: "Including circulation",
              gradient: "from-blue-600/20 to-cyan-600/20",
              border: "border-blue-500/20",
            },
            {
              icon: <LayoutGrid size={18} className="text-purple-400" />,
              label: "Total GIFA",
              value: `${groundGIFA + firstGIFA} m²`,
              sub: "Both floors combined",
              gradient: "from-purple-600/20 to-violet-600/20",
              border: "border-purple-500/20",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border ${stat.border} bg-gradient-to-br ${stat.gradient} p-4 backdrop-blur-sm`}
            >
              <div className="mb-2 flex items-center gap-2">
                {stat.icon}
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

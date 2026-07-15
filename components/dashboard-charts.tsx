"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const SOURCE_COLORS: Record<string, string> = {
  求人媒体: "#2563eb",
  人材紹介: "#9333ea",
  リファラル: "#16a34a",
  直接応募: "#d97706",
};

const STAGE_COLORS: Record<string, string> = {
  応募: "#94a3b8",
  書類選考: "#0ea5e9",
  一次面接: "#6366f1",
  最終面接: "#8b5cf6",
  内定: "#10b981",
  入社: "#0d9488",
};

export function SourcePieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={SOURCE_COLORS[entry.name] ?? "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}名`, "応募数"]} />
        <Legend
          iconType="circle"
          formatter={(value: string) => (
            <span className="text-xs text-slate-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StageFunnelChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="name"
          width={64}
          tick={{ fontSize: 12 }}
        />
        <Tooltip formatter={(value) => [`${value}名`, "人数"]} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={STAGE_COLORS[entry.name] ?? "#94a3b8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

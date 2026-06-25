import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const statsRes = await api.get(
          "/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(statsRes.data);

        const leaderboardRes = await api.get(
          "/admin/leaderboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLeaderboard(
          leaderboardRes.data.leaderboard
        );

        const analyticsRes = await api.get(
          "/admin/waste-analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAnalytics(
          analyticsRes.data.analytics
        );

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-400">
            WasteConnect
          </h1>

          <p className="text-slate-400">
            Smart Waste Management Platform
          </p>
        </div>

        <button className="bg-green-500 px-4 py-2 rounded-lg font-semibold">
          Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8">

  <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
    <p className="text-sm opacity-80">
      📦 Total Requests
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {stats.totalRequests}
    </h2>
  </div>

  <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
    <p className="text-sm opacity-80">
      🚚 Collectors
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {stats.totalCollectors}
    </h2>
  </div>

  <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
    <p className="text-sm opacity-80">
      ✅ Completed
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {stats.completedRequests}
    </h2>
  </div>

  <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
    <p className="text-sm opacity-80">
      👥 Users
    </p>

    <h2 className="text-5xl font-bold mt-3">
      {stats.totalUsers}
    </h2>
  </div>

</div>

      {/* Leaderboard */}
      <div className="grid md:grid-cols-2 gap-8 p-8 pt-0">

  {/* Leaderboard */}

  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

    <h2 className="text-2xl font-bold mb-6 text-green-400">
      🏆 Collector Leaderboard
    </h2>

    <div className="space-y-4">

      {leaderboard.map(
        (collector, index) => (

          <div
            key={collector.email}
            className="bg-slate-800 p-5 rounded-xl hover:bg-slate-700 transition"
          >

            <div className="flex justify-between">

              <div>
                <p className="font-bold text-lg">
                  #{index + 1} {collector.name}
                </p>

                <p className="text-slate-400 text-sm">
                  {collector.email}
                </p>
              </div>

              <div className="text-right">
                <p>
                  ✅ {collector.completed}
                </p>

                <p>
                  📦 {collector.assigned}
                </p>

                <p className="text-green-400 font-semibold">
                  {collector.completionRate}%
                </p>
              </div>

            </div>

          </div>

        )
      )}

    </div>

  </div>


  {/* Chart */}

  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

    <h2 className="text-2xl font-bold mb-6 text-green-400">
      📊 Waste Distribution
    </h2>

    <div
      style={{
        width: "100%",
        height: 350,
      }}
    >

      <ResponsiveContainer>

        <PieChart>

          <Pie
            data={analytics}
            dataKey="count"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name }) => name}
          >

            {analytics.map(
              (entry, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />

              )
            )}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

      </div>

    </div>

  </div>

</div>
  );
}

export default AdminDashboard;
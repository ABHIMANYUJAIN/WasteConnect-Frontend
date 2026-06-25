import { useEffect, useState } from "react";
import api from "../services/api";

function CollectorDashboard() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(
          "/collector/my-assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignments(res.data.requests);

      } catch (error) {
        console.error(error);
      }
    };

    fetchAssignments();
  }, []);

  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/collector/complete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments(
        assignments.filter(
          (request) => request._id !== id
        )
      );

      alert("Pickup Completed");

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to complete pickup"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-400">
          Collector Dashboard 🚚
        </h1>

        <p className="text-slate-400 mt-2">
          Manage assigned pickups efficiently
        </p>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 mb-8">
        <p className="text-sm opacity-80">
          Assigned Pickups
        </p>

        <h2 className="text-5xl font-bold mt-3">
          {assignments.length}
        </h2>
      </div>

      {/* Pickup Cards */}
      <div className="grid md:grid-cols-2 gap-6">

        {assignments.length === 0 ? (
          <div className="bg-slate-900 p-6 rounded-2xl">
            No assigned pickups.
          </div>
        ) : (
          assignments.map((request) => (
            <div
              key={request._id}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
            >
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                {request.wasteType}
              </h2>

              <div className="space-y-2">
                <p>
                  📦 Weight: {request.weight} kg
                </p>

                <p>
                  📍 Address: {request.address}
                </p>

                <p>
                  📅 Pickup Date:{" "}
                  {new Date(
                    request.pickupDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() =>
                  handleComplete(request._id)
                }
                className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold transition"
              >
                Mark as Completed
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default CollectorDashboard;
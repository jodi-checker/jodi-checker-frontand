"use client";
import { useState } from "react";
import {
  FaUser, FaHeart, FaStar, FaFire,
  FaHandshake, FaSmile, FaHome, FaHeartbeat
} from "react-icons/fa";

export default function MatchMaking() {
  // Use NEXT_PUBLIC_API_URL for production (set this in Vercel).
  // Falls back to localhost for local development.
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [formData, setFormData] = useState({
    m_name: "", m_city: "", m_dob: "", m_time: "",
    f_name: "", f_city: "", f_dob: "", f_time: "",
  });

  const [loading, setLoading] = useState(false);
  const [fact, setFact] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const funFacts = [
    "Do you know? Gun Milan analyzes 8 aspects of compatibility called Kootas.",
    "A score above 18 is considered a good match in traditional astrology.",
    "Nadi Koota is crucial for health and genetic harmony.",
    "Gana Koota shows your temperament compatibility.",
    "Graha Maitri reflects your emotional and mental connection.",
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");
    setFact(funFacts[Math.floor(Math.random() * funFacts.length)]);

    try {
      const [m_hour, m_minute] = formData.m_time.split(":").map(Number);
      const [f_hour, f_minute] = formData.f_time.split(":").map(Number);
      const [m_year, m_month, m_day] = formData.m_dob.split("-").map(Number);
      const [f_year, f_month, f_day] = formData.f_dob.split("-").map(Number);

      const payload = {
        male: { name: formData.m_name, city: formData.m_city, year: m_year, month: m_month, day: m_day, hour: m_hour, minute: m_minute },
        female: { name: formData.f_name, city: formData.f_city, year: f_year, month: f_month, day: f_day, hour: f_hour, minute: f_minute },
      };

      const res = await fetch(`${API_BASE}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scorePercent = result ? Math.round((result.total / 36) * 100) : 0;

  const kootaIcons = {
    Varna: <FaUser className="mx-auto text-red-600" />,
    Vashya: <FaHeart className="mx-auto text-red-600" />,
    Tara: <FaStar className="mx-auto text-red-600" />,
    Yoni: <FaFire className="mx-auto text-red-600" />,
    "Graha Maitri": <FaHandshake className="mx-auto text-red-600" />,
    Gana: <FaSmile className="mx-auto text-red-600" />,
    Bhakoot: <FaHome className="mx-auto text-red-600" />,
    Nadi: <FaHeartbeat className="mx-auto text-red-600" />,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex flex-col items-center justify-center p-4 relative">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50 text-white text-lg font-medium">
          <div className="w-16 h-16 border-4 border-red-300 border-t-red-600 rounded-full animate-spin mb-4"></div>
          <p className="text-center px-6 text-pink-100 italic">{fact}</p>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 z-10">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-2">💖 Vedic Matchmaking</h1>
        <p className="text-center text-red-500 mb-8 text-lg font-medium">Check Compatibility</p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-5 rounded-xl shadow-inner">
            <h2 className="font-semibold text-xl text-red-700 mb-4">Male</h2>
            <input type="text" name="m_name" placeholder="Name" onChange={handleChange} className="input" required />
            <input type="text" name="m_city" placeholder="Birth City" onChange={handleChange} className="input" required />
            <input type="date" name="m_dob" onChange={handleChange} className="input" required />
            <input type="time" name="m_time" onChange={handleChange} className="input" required />
          </div>

          <div className="bg-red-50 p-5 rounded-xl shadow-inner">
            <h2 className="font-semibold text-xl text-red-700 mb-4">Female</h2>
            <input type="text" name="f_name" placeholder="Name" onChange={handleChange} className="input" required />
            <input type="text" name="f_city" placeholder="Birth City" onChange={handleChange} className="input" required />
            <input type="date" name="f_dob" onChange={handleChange} className="input" required />
            <input type="time" name="f_time" onChange={handleChange} className="input" required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition text-lg mt-2"
          >
            {loading ? "Calculating..." : "Check Compatibility"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4 text-lg font-medium">{error}</p>}

        {result && (
          <div className="mt-8 bg-red-50 p-6 rounded-2xl shadow-inner">
            <h2 className="text-2xl font-bold text-red-700 mb-3 text-center">Results</h2>
            <p className="font-bold text-center text-lg text-red-600">
              Total Score: {result.total}/36
            </p>
            <div className="w-full bg-gray-200 rounded-full h-6 mt-2">
              <div
                className="h-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 transition-all"
                style={{ width: `${scorePercent}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-red-600 mt-1">{scorePercent}% Match</p>

            <ul className="mt-5 text-gray-700 grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(result.kootas || {}).map(([key, value]) => (
                <li key={key} className="bg-white p-3 rounded-lg shadow text-center flex flex-col items-center">
                  {kootaIcons[key]}
                  <p className="font-semibold text-red-700 mt-1">{key}</p>
                  <p className="text-lg text-red-600">{value}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-5 bg-white rounded-xl shadow-inner">
              <h3 className="font-semibold mb-2 text-red-600 text-lg">Explanation:</h3>
              <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .input {
          border: 1px solid #ddd;
          border-radius: 0.75rem;
          padding: 10px;
          font-size: 14px;
          outline: none;
          width: 100%;
          color: #111;
        }
        .input:focus {
          border-color: #f43f5e;
          box-shadow: 0 0 0 2px rgba(244,63,94,0.2);
        }
      `}</style>
    </main>
  );
}

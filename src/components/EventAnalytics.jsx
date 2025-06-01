import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EventAnalytics = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://4f6b-49-36-144-50.ngrok-free.app/events/${eventId}/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          toast.error("Unauthorized. Please log in again.");
          navigate("/login");
          return;
        }

        const json = await response.json();
        if (json.status === "success") {
          setEventData(json.data);
        } else {
          toast.error("Failed to load analytics data");
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        toast.error("Network error while loading analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [eventId, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Loading analytics...</div>;
  }

  if (!eventData) {
    return <div className="p-6 text-center">No analytics data available</div>;
  }

  // Prepare data for the line chart
  const feedbackChartData = {
    labels: eventData.feedbackVolume.map(item => 
      new Date(item.minute).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [{
      label: 'Feedback Volume',
      data: eventData.feedbackVolume.map(item => parseInt(item.count)),
      fill: false,
      borderColor: 'rgb(124, 58, 237)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Feedback Volume Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Analytics</h2>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance Overview</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-purple-600">{eventData.totalRsvps}</p>
              <p className="text-sm text-gray-500">Total RSVPs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{eventData.totalCheckIns}</p>
              <p className="text-sm text-gray-500">Actual Check-ins</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {Math.round((eventData.totalCheckIns / eventData.totalRsvps) * 100)}%
              </p>
              <p className="text-sm text-gray-500">Attendance Rate</p>
            </div>
          </div>
        </div>

        {/* Top Emojis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Emoji Reactions</h3>
          <div className="flex justify-around items-center">
            {eventData.topEmojis.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl mb-2">{item.emoji}</p>
                <p className="text-sm text-gray-500">{item.count} reactions</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Volume Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <Line data={feedbackChartData} options={chartOptions} />
      </div>

      {/* Keywords Cloud */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Common Feedback Keywords</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {eventData.topKeywords.map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full"
              style={{
                fontSize: `${Math.max(1, Math.min(2, 1 + keyword.count / 10))}rem`
              }}
            >
              {keyword.word} ({keyword.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
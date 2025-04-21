import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

interface CompletedJob {
  id: number;
  sitter: number; 
  sitter_name: string;
  job_date: string;
  duration: number;
  rate: number;
  status: string;
  payment_status: string;
}

const CompletedJobsPage: React.FC = () => {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingJobId, setPayingJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("You need to be logged in to view your completed jobs.");
          return;
        }

        const { data } = await axios.get(`${BASE_URL}/api/bookings/parent/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 Raw bookings received:", data); 
        console.log("✅ Checking job statuses:", data.map((j: any) => ({ id: j.id, status: j.status, payment: j.payment_status })));

        const completedWithSitterNames = await Promise.all(
          data
            .filter((job: CompletedJob) => job.status === "completed")
            .map(async (job: CompletedJob) => {
              try {
                const sitterResponse = await axios.get(
                  `${BASE_URL}/api/sitters/${job.sitter}/`, 
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                const sitterName = sitterResponse.data.name; 
                return { ...job, sitter_name: sitterName }; 
              } catch (err) {
                return { ...job, sitter_name: "Unknown" }; 
              }
            })
        );

        setCompletedJobs(completedWithSitterNames);
      } catch (err) {
        setError("Failed to load completed jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, [BASE_URL]);

  useEffect(() => {
    console.log("Completed jobs loaded:", completedJobs);
  }, [completedJobs]);

  const handlePayment = async (bookingId: number) => {
    if (payingJobId !== null && payingJobId === bookingId) {
      return; 
    }

    setPayingJobId(bookingId);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You need to be logged in to make a payment.");
        return;
      }

      await axios.post(
        `${BASE_URL}/api/pay-mpesa/`,
        { booking_id: bookingId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Payment initiated successfully! You will receive an M-Pesa prompt.");
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setPayingJobId(null);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-[#F1FAEE]">
      <Layout>
        <h2 className="text-2xl font-bold text-center text-cyan-500 mb-6">
          Completed Jobs – Pay with M-Pesa
        </h2>
      </Layout>

      <div className="max-w-4xl mx-auto space-y-6">
        {completedJobs.length === 0 ? (
          <p className="text-center text-cyan-500">No completed jobs available.</p>
        ) : (
          completedJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 bg-white text-cyan-500 rounded-lg shadow-md border border-gray-200"
            >
              <p><strong>Sitter:</strong> {job.sitter_name || "Unknown"}</p>
              <p><strong>Date:</strong> {new Date(job.job_date).toLocaleString()}</p>
              <p><strong>Duration:</strong> {job.duration} hrs</p>
              <p><strong>Rate:</strong> KSH {job.rate} /hr</p>
              <p><strong>Total:</strong> KSH {job.duration * job.rate}</p>
              <p className="text-green-600 font-medium mt-1">Status: {job.status}</p>

              <button
                onClick={() => handlePayment(job.id)}
                disabled={payingJobId === job.id || job.payment_status === "paid"}
                className="mt-4 px-4 py-2 !bg-cyan-500 hover:!bg-pink-500 text-white rounded"
              >
                {payingJobId === job.id
                  ? "Processing..."
                  : job.payment_status === "paid"
                    ? "Paid"
                    : "Pay with M-Pesa"}
              </button>
              {job.payment_status === "paid" && (
                <div className="mt-2 !text-green-600 font-semibold">
                  ✅ Payment confirmed for this job.
                </div>
              )}
            </div>
          ))
        )}

        {successMessage && (
          <p className="text-green-600 text-center mt-4">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CompletedJobsPage;

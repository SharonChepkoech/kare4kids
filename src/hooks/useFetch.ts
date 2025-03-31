import { useState, useEffect } from "react";

export const useFetch = <T,>(url: string, initialState: T) => {
  const [data, setData] = useState<T>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("User not authenticated.");
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000${url}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const textResponse = await response.text(); // Log raw response
        if (!response.ok || textResponse.startsWith("<!DOCTYPE")) {
          throw new Error(`Unexpected response: ${textResponse}`);
        }

        setData(JSON.parse(textResponse));
      } catch (err) {
        setError((err as Error).message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

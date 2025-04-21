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

        const BASE_URL = import.meta.env.VITE_API_BASE_URL; 
        const response = await fetch(`${BASE_URL}${url}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const textResponse = await response.text(); 
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

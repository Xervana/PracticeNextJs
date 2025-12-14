
import { useState } from "react";


export function useInsertTenant() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const insertTenant = async (tenant) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tenant),
      });
      const data = await response.json();
      console.log("Insert successful:", data);
      setData(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      console.error("Error inserting tenant:", error);
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  };

  return [insertTenant, data, error, loading];
}

export default useInsertTenant;
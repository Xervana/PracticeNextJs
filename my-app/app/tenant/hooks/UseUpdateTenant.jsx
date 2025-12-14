
import { useState } from "react";

export function useUpdateTenant({ onSuccess }, tenantId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const updateTenant = async (tenant) => {
    setLoading(true);
    setError(null);
    if (onSuccess) {
      onSuccess();
    }
    try {
      const response = await fetch(`/api/tenant/${tenantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tenant),
      });
      const data = await response.json();
      console.log("Update successful:", data);
      setData(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      console.error("Error updating tenant:", error);
      setError(error);
      setLoading(false);
      return { success: true, data };
    }
  };

  return [updateTenant, data, error, loading];
}

export default useUpdateTenant;
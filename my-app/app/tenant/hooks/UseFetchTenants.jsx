
import { useState } from "react";

import { useEffect } from "react";

export function useFetchTenants() {
  const [tenants, setTenants] = useState([]);

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/tenant");
      const data = await response.json();
      setTenants(data);
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to fetch tenants");
      }
      return data;
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchTenants();
  }, []);

  return [tenants, fetchTenants];
}

export default useFetchTenants;
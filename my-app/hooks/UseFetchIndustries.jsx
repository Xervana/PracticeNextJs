
import { useState } from "react";

import { useEffect } from "react";


export function useFetchIndustries(industryId) {
  const [industries, setIndustries] = useState([]);

  const fetchIndustries = async () => {
    try {
      const response = await fetch(`/api/industry/${industryId}`);
      const data = await response.json();
      setIndustries(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchIndustries();
  }, []);

  return [industries, fetchIndustries];
}



export default useFetchIndustries;
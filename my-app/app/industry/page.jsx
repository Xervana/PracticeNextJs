"use client";
import { use, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function IndustryPage() {
  const [industries, refetch] = useFetchIndustries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <div>
        <Button onClick={() => setIsModalOpen(true)}>Insert Industry</Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <IndustryForm
            onSuccess={() => {
              refetch();
              setIsModalOpen(false);
            }}
          />
        </Modal>
      </div>
      {industries.map((industry) => (
        <IndustryCard key={industry.v_industryid} industry={industry} />
      ))}
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Industry</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  ) : null;
}

function IndustryCard({ industry }) {
  return (
    <Card className="industry-card">
      <CardHeader>
        <CardTitle>{industry.v_industryname}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{industry.v_description}</p>
        <p>{industry.v_isactive}</p>
      </CardContent>
    </Card>
  );
}

function useFetchIndustries() {
  const [industries, setIndustries] = useState([]);

  const fetchIndustries = async () => {
    try {
      const response = await fetch("/api/industry");
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

// INSERT AREA

function useInsertIndustry() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const insertIndustry = async (industry) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/industry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(industry),
      });
      const data = await response.json();
      console.log("Insert successful:", data);
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error inserting industry:", error);
      setError(error);
      setLoading(false);
    }
  };

  return [insertIndustry, data, error, loading];
}

// USAGE EXAMPLE

function IndustryForm({ onSuccess }) {
  const [industryName, setIndustryName] = useState("");
  const [industryDescription, setIndustryDescription] = useState("");
  const [insertIndustry, data, error, loading] = useInsertIndustry();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const industry = {
      industryname: industryName,
      description: industryDescription,
    };
    await insertIndustry(industry);
    setIndustryName("");
    setIndustryDescription("");
    if (onSuccess) {
      onSuccess();
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="industry-form">
        <Input
          type="text"
          placeholder="Industry Name"
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Industry Description"
          value={industryDescription}
          onChange={(e) => setIndustryDescription(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Inserting..." : "Insert Industry"}
        </Button>
        {error && <p className="error">Error: {error.message}</p>}
        {data && <p className="success">Industry inserted successfully!</p>}
      </form>
    </div>
  );
}

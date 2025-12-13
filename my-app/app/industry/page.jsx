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

import { TextArea } from "@/components/ui/textarea";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

export default function IndustryPage() {
  const [industries, refetch] = useFetchIndustries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("All");

  const uniqueStatuses = [...new Set(industries.map((ind) => ind.v_isactive))];

  // Filter programs based on category
  const filteredByIsActive =
    filterActive === "All"
      ? industries
      : industries.filter(
          (industry) => String(industry.v_isactive) === filterActive
        );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Industries</h1>
        <Button className="mb-4" onClick={() => setIsModalOpen(true)}>
          Insert Industry
        </Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <IndustryForm
            onSuccess={() => {
              refetch();
              setIsModalOpen(false);
            }}
          />
        </Modal>
      </div>

      <div className="px-4">
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
        >
          {uniqueStatuses.length > 1 && (
            <option value="All">All Statuses</option>
          )}
          {uniqueStatuses.map((status) => (
            <option key={String(status)} value={String(status)}>
              {String(status ? "Active" : "Inactive")}
            </option>
          ))}
        </select>
      </div>

      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search industries..."
        className="mb-4"
      />
      {filteredByIsActive
        .filter((industry) =>
          industry.v_industryname
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
        .map((industry) => (
          <IndustryCard
            key={industry.v_industryid}
            industry={industry}
            onSuccess={() => refetch()}
          />
        ))}
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={onClose} className="max-w-lg">
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Insert Industry
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  ) : null;
}

function IndustryCard({ industry, onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Card className="mb-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold">
          {industry.v_industryname}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {industry.v_description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {industry.v_isactive ? (
          <p className="text-sm text-green-600 font-medium">Status: Active</p>
        ) : (
          <p className="text-sm text-red-600 font-medium">Status: Inactive</p>
        )}
        <p>
          Since{" "}
          {new Date(industry.v_createdat).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
          })}
        </p>
      </CardContent>
      <Button
        className="m-4"
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
      >
        View Details
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <IndustryUpdateForm
          onSuccess={() => {
            setIsModalOpen(false);
            onSuccess();
          }}
          industry={industry}
        />
      </Modal>
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
      createdby: 1,
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
          className="mb-4"
          type="text"
          placeholder="Industry Name"
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
        />
        <TextArea
          className="mb-4 resize-none overflow-hidden"
          type="text"
          placeholder="Industry Description"
          value={industryDescription}
          onChange={(e) => setIndustryDescription(e.target.value)}
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Inserting..." : "Insert Industry"}
        </Button>
        {error && <p className="error">Error: {error.message}</p>}
        {data && <p className="success">Industry inserted successfully!</p>}
      </form>
    </div>
  );
}

function IndustryUpdateForm({ onSuccess, industry }) {
  const [industryName, setIndustryName] = useState(industry.v_industryname);
  const [industryDescription, setIndustryDescription] = useState(
    industry.v_description
  );
  const [industryIsActive, setIndustryIsActive] = useState(industry.v_isactive);

  const [updateIndustry, data, error, loading] = useUpdateIndustry(
    { onSuccess },
    industry.v_industryid
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const industry = {
      industryname: industryName,
      description: industryDescription,
      isactive: industryIsActive,
      modifiedby: 1,
    };
    await updateIndustry(industry);
    setIndustryName("");
    setIndustryDescription("");
    setIndustryIsActive(true);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="industry-form">
        <Input
          className="mb-4"
          type="text"
          placeholder="Industry Name"
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
        />
        <TextArea
          className="mb-4 resize-none overflow-hidden"
          type="text"
          placeholder="Industry Description"
          value={industryDescription}
          onChange={(e) => setIndustryDescription(e.target.value)}
        />
        <select
          className="mb-4 w-full p-2 border border-gray-300 rounded-md"
          value={industryIsActive ? "active" : "inactive"}
          onChange={(e) => setIndustryIsActive(e.target.value === "active")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Industry"}
        </Button>
        {error && <p className="error">Error: {error.message}</p>}
        {data && <p className="success">Industry updated successfully!</p>}
      </form>
    </div>
  );
}

function useUpdateIndustry({ onSuccess }, industryId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const updateIndustry = async (industry) => {
    setLoading(true);
    setError(null);
    if (onSuccess) {
      onSuccess();
    }
    try {
      const response = await fetch(`/api/industry/${industryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(industry),
      });
      const data = await response.json();
      console.log("Update successful:", data);
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error updating industry:", error);
      setError(error);
      setLoading(false);
    }
  };

  return [updateIndustry, data, error, loading];
}

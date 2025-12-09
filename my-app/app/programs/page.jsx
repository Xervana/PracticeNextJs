"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useCallback } from "react";

export default function ProgramsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [Program, setProgram] = useState(null);
  const [refetchPrograms, setRefetchPrograms] = useState(() => () => {});

  const handleRowClick = (program) => {
    console.log("Clicked program:", program);
    setProgram(program);
    setIsCreateModalOpen(true);
  };

  const handleProgramCreated = async (createdProgramCode) => {
    console.log("Program created successfully with code:", createdProgramCode);
    await refetchPrograms(); // Refetch first
    setSearchQuery(createdProgramCode || ""); // Then set search
    setIsCreateModalOpen(false);
  };
  
  return (
    <div className="p-8">
      {/* MODAL */}
      <CreateProgramFormDialog
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        Program={Program}
        onProgramCreated={handleProgramCreated}
      />
      {/* TOP COMPONENTS */}
      <div>
        {/* BUTTON */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="primary"
            onClick={() => {
              setIsCreateModalOpen(true);
              setProgram(null);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Program
          </Button>
        </div>
        {/* SEARCH BAR */}
        <div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs..."
            className="mb-4"
          />
        </div>
      </div>
      {/* TABLE with search functionality */}
      <div className="mt-8">
        <ProgramsTable
          searchQuery={searchQuery}
          onRowClick={handleRowClick}
          setRefetchCallback={setRefetchPrograms}
        />
      </div>
    </div>
  );
}

function CreateProgramFormDialog({
  isModalOpen,
  setIsModalOpen,
  Program,
  onProgramCreated,
}) {
  const {
    createProgram,
    loading: createLoading,
    message: createMessage,
  } = useCreateProgram((programCode) => {
    onProgramCreated(programCode);
  });

  const {
    updateProgram,
    loading: updateLoading,
    message: updateMessage,
  } = useUpdateProgram((programCode) => {
    onProgramCreated(programCode);
  }, Program?.v_programid);

  const handleSubmit = Program ? updateProgram : createProgram;
  const loading = Program ? updateLoading : createLoading;
  const message = Program ? updateMessage : createMessage;
  return (
    <div>
      <h1>Programs Page</h1>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {" "}
              {Program ? "Edit Program" : "Create New Program"}
            </DialogTitle>
            <DialogDescription>
              {Program
                ? `Editing Program: ${Program.v_programcode}`
                : "Fill out the form below to create a new program."}
            </DialogDescription>
          </DialogHeader>
          <CreateProgramForm
            onSubmit={handleSubmit}
            loading={loading}
            message={message}
            Program={Program}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
function CreateProgramForm({ onSubmit, loading, message, onCancel, Program }) {
  const [programcode, setProgramcode] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (Program) {
      setProgramcode(Program.v_programcode || "");
      setDescription(Program.v_description || "");
      setIsActive(Program.v_isactive ?? true);
    } else {
      setProgramcode("");
      setDescription("");
      setIsActive(true);
    }
  }, [Program]);

  const isFormValid = programcode.trim() !== "" && description.trim() !== "";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="programcode" className="block text-sm font-medium mb-1">
          Program Code
        </Label>
        <Input
          type="text"
          id="programcode"
          name="programcode"
          required
          value={programcode}
          onChange={(e) => setProgramcode(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </Label>
        <Input
          type="text"
          id="description"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {Program && (
        <div>
          <Label htmlFor="isActive" className="block text-sm font-medium mb-1">
            Status
          </Label>
          <select
            id="isActive"
            name="isActive"
            value={String(isActive)}
            onChange={(e) => setIsActive(e.target.value === "true")}
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      )}
      <Button type="submit" disabled={loading || !isFormValid}>
        {loading
          ? Program
            ? "Updating..."
            : "Creating..."
          : Program
          ? "Update Program"
          : "Create Program"}
      </Button>
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
}

// Component to display programs in a table with search functionality
function ProgramsTable({ searchQuery, onRowClick, setRefetchCallback }) {
  const { programs, loading, error, refetch } = useFetchPrograms();
  const [filterCategory, setFilterCategory] = useState("All");
  const [codeFilter, setCodeFilter] = useState("All");

  useEffect(() => {
    setRefetchCallback(() => refetch);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // SEARCH FILTER
  const searchFilteredData = programs.filter((program) => {
    // NULL safety
    const programCode = program.v_programcode || "";
    const programDescription = program.v_description || "";

    return (
      // case insensitive search
      programCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      programDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // SELECTION FILTER by Parent SearchFilteredData
  const statusDropdownOptions = [...new Set(programs.map((p) => p.v_isactive))];
  // Filter
  const filteredCategory =
    filterCategory === "All"
      ? searchFilteredData
      : searchFilteredData.filter(
          (program) => String(program.v_isactive) === filterCategory
        );

  // SELECTION FILTER by Parent SearchFilteredData
  const codeDropdownOptions = [
    ...new Set(programs.map((p) => p.v_programcode)),
  ];
  // Filter
  const newfilteredCategory =
    codeFilter === "All"
      ? filteredCategory
      : filteredCategory.filter(
          (program) => String(program.v_programcode) === codeFilter
        );

  return (
    <div>
      {/* Status Filter */}
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        {statusDropdownOptions.length > 1 && <option value="All">All</option>}
        {statusDropdownOptions.map((status) => (
          <option key={status} value={String(status)}>
            {String(status ? "Active" : "Inactive")}
          </option>
        ))}
      </select>
      {/* Code Filter */}
      <select
        value={codeFilter}
        onChange={(e) => setCodeFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        {codeDropdownOptions.length > 1 && <option value="All">All</option>}
        {codeDropdownOptions.map((code) => (
          <option key={code} value={String(code)}>
            {String(code)}
          </option>
        ))}
      </select>
      {/* table of programs */}
      <div className="space-y-4">
        {newfilteredCategory.map((program) => (
          <ProgramCard key={program.v_programid} Program={program} onRowClick={onRowClick} setRefetchCallback={setRefetchCallback} />
        ))}
      </div>
    
    </div>
  );
}

function useFetchPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/programs");
      if (!response.ok) {
        throw new Error("Failed to fetch programs");
      }
      const data = await response.json();
      setPrograms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, loading, error, refetch: fetchPrograms };
}

// Custom Hook or Component to Fetch Programs
function useCreateProgram(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const createProgram = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.target);
    try {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programcode: formData.get("programcode"),
          description: formData.get("description"),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessage("Program created successfully!");
        onSuccess?.(formData.get("programcode"));
      } else {
        setMessage("Failed to create program.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return { createProgram, loading, message };
}

function useUpdateProgram(onSuccess, programId) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateProgram = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.target);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programcode: formData.get("programcode"),
          description: formData.get("description"),
          isActive: formData.get("isActive") === "true",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessage("Program updated successfully!");
        onSuccess?.(formData.get("programcode")); // Pass the program code
      } else {
        setMessage("Failed to update program.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return { updateProgram, loading, message };
}

function ProgramCard({ Program, onRowClick}) {


  return (
    <Card>
      <CardHeader>
        <CardTitle>{Program.v_programcode}</CardTitle>
        <CardDescription>
          ID: {Program.v_programid} | Status:{" "}
          {Program.v_isactive ? "Active" : "Inactive"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {Program.v_description || "No description available"}
        </p>
        {Program.v_createdat && (
          <p className="text-xs text-muted-foreground mt-2">
            Created:{" "}
            {new Date(Program.v_createdat).toLocaleString("en-PH", {
              timeZone: "Asia/Manila",
            })}
          </p>
        )}
        {Program.v_modifiedat
          ? new Date(Program.v_modifiedat).toLocaleString("en-PH", {
              timeZone: "Asia/Manila",
            })
          : ""}
      </CardContent>
      <CardFooter>
        <Button onClick={() => onRowClick(Program)}>Edit Program</Button>
      </CardFooter>
    </Card>
  );
}

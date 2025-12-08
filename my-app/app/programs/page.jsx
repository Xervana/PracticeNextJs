"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

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

export default function ProgramsPage() {
  return (
    <div className="p-8">
      <CreateProgramFormDialog />
      <div className="mt-8">
        <ProgramsTable />
      </div>
    </div>
  );
}

function CreateProgramFormDialog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createProgram, loading, message } = useCreateProgram(() => {
    console.log("Program created successfully!");
    setIsModalOpen(false);
  });
  return (
    <div>
      <h1>Programs Page</h1>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Create New Program
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Program</DialogTitle>
            <DialogDescription>
              Fill in the form below to create a new program.
            </DialogDescription>
          </DialogHeader>
          <CreateProgramForm
            onSubmit={createProgram}
            loading={loading}
            message={message}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateProgramForm({ onSubmit, loading, message, onCancel }) {
  const [programcode, setProgramcode] = useState("");
  const [description, setDescription] = useState("");

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
      <Button type="submit" disabled={loading || !isFormValid}>
        {loading ? "Creating..." : "Create Program"}
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
      {message && <p>{message}</p>}
    </form>
  );
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
        onSuccess?.();
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

function ProgramsTable() {
  const { programs, loading, error } = useFetchPrograms();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Table>
      <TableCaption>A list of programs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Program Code</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>isActive</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Modified At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs.map((program) => (
          <TableRow key={program.v_programid}>
            <TableCell className="font-medium">
              {program.v_programcode}
            </TableCell>
            <TableCell>{program.v_description}</TableCell>
            <TableCell>{program.v_isactive ? "Active" : "Inactive"}</TableCell>
            <TableCell>
              {new Date(program.v_createdat).toLocaleString("en-PH", {
                timeZone: "Asia/Manila",
              })}
            </TableCell>
            <TableCell>
              {program.v_modifiedat
                ? new Date(program.v_modifiedat).toLocaleString("en-PH", {
                    timeZone: "Asia/Manila",
                  })
                : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function useFetchPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("/api/programs");
        if (!response.ok) {
          throw new Error("Failed to fetch programs");
        }
        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return { programs, loading, error };
}

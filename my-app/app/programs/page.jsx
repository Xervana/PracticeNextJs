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
import { useEffect} from "react";
import { Plus } from "lucide-react";

export default function ProgramsPage() {
      return (
    <div className="p-8">
      <CreateProgramFormDialog />
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateProgramForm({ onSubmit, loading, message }) {
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
      <Button type="submit" disabled={loading || !isFormValid} >
        {loading ? "Creating..." : "Create Program"}
      </Button>
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


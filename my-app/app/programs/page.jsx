// programs
"use client";
import { use, useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {Dialog, DialogContent,DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import { MoreVertical } from "lucide-react";
import { on } from "events";
function ProgramCard({ program, onEdit }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>{program.v_programcode}</CardTitle>
        </div>

        {/* DROPDOWN MENU OPTIONAL */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(program)}>
              Edit
            </DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
        {/* DROPDOWN MENU OPTIONAL */}
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {program.v_description || "No further description available."}
        </p>
        {program.v_createdat && (
          <p className="mt-2 text-xs text-muted-foreground">
            Created at: {new Date(program.v_createdat).toLocaleString()}
          </p>
        )}
        {/* modified status */ }
        {program.v_modifiedat && (
          <p className="mt-2 text-xs text-muted-foreground">
            Modified at: {new Date(program.v_modifiedat).toLocaleString()}
          </p>
        )}
        {/* active status */ }
        <p className="mt-2 text-xs">
          Status: {program.v_isactive ? "Active" : "Inactive"}
        </p>
      </CardContent>
    </Card>
  );
}

function ProgramsList({ programs, loading, onEdit }) {
  if (loading) {
    return <p>Loading programs...</p>;
  }
  if (!programs || programs.length === 0) {
    return <p>No programs available.</p>;
  }
  return (
    <div className="grid gap-4">
      {programs.map((program) => (
        <ProgramCard 
          key={program.v_programid} 
          program={program} 
          onEdit={onEdit}
         
        />
      ))}
    </div>
  );
}

//EditProgramDialog
// 1. Fetch first
function useUpdateProgram(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateProgram = async (programId, e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programcode: formData.get("programcode"),
          description: formData.get("description"),
          isactive: formData.get("isactive") === "true",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Updated program data:', data);
        setMessage(`Program updated successfully. ID: ${data.v_programid}`);
        onSuccess?.();
      } else {
        setMessage("Failed to update program");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return { updateProgram, loading, message };
}

// Create form 
function EditProgramDialog({open,onOpenChange, program, onSuccess}) {
  const { updateProgram, loading, message } = useUpdateProgram(onSuccess);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProgram(program.v_programid, e);
  };

  if (!program) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogDescription>Modify program details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="programcode">Program Code</Label>
              <Input
                type="text"
                id="programcode"
                name="programcode"
                defaultValue={program.v_programcode}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                type="text"
                id="description"
                name="description"
                defaultValue={program.v_description}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="isactive">Active</Label>
              <select
                id="isactive"
                name="isactive"
                defaultValue={program.isactive ? "true" : "false"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Update Program"}
          </Button>
          {message && <p>{message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function useFetchPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/programs");
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      } else {
        console.error("Failed to fetch programs");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPrograms();
  }, []);
  return { programs, loading, refetch: fetchPrograms };
}

export default function ProgramsPage() {
  const { programs, loading: fetchingPrograms, refetch } = useFetchPrograms();
  const {createProgram,loading: creatingProgram,message,} = useCreateProgram(refetch);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedProgram(null);
    refetch();
  }

  // PROGRAMS [localhost:3000/programs]
  return (
    <div className="mt-15">
      <h1>Programs</h1>

      <div>
        <h2>CREATE PROGRAM</h2>
        <CreateProgramForm
          onSubmit={createProgram}
          loading={creatingProgram}
          message={message}
        />
      </div>

      {/* LIST PROGRAMS */}
      <div>
        <h2>PROGRAMS LIST</h2>
        <ProgramsList 
          programs={programs} loading={fetchingPrograms} onEdit={handleEdit} />
      </div>
      
      {/* EDIT PROGRAM DIALOG */}
      <EditProgramDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      program={selectedProgram}
      onSuccess={handleEditSuccess}
    />  
    </div>

    
  );
}

function CreateProgramForm({ onSubmit, loading, message }) {
  return (
    <form onSubmit={onSubmit}>
      <Label htmlFor="programcode">Program Code</Label>
      <Input type="text" id="programcode" name="programcode" />
      <Label htmlFor="description">Description</Label>
      <Input type="text" id="description" name="description" />
      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Create Program"}
      </Button>
      {message && <p>{message}</p>}
    </form>
  );
}

// Create Hook POST

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
        setMessage(`Program created with ID: ${data.id}`);
        e.target.reset();
        onSuccess?.();
      } else {
        setMessage("Failed to create program");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return { createProgram, loading, message };
}

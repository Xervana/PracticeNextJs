"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useState, useEffect } from "react";

// ============================================================================
// DISPLAY COMPONENTS - Reusable UI components for rendering data
// ============================================================================

// 1. Single Item Card - Displays individual program details
function ProgramCard({ program }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{program.v_programcode}</CardTitle>
        <CardDescription>
          ID: {program.v_programid} | Status:{" "}
          {program.v_isactive ? "Active" : "Inactive"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {program.v_description || "No description"}
        </p>
        {program.v_createdat && (
          <p className="text-xs text-muted-foreground mt-2">
            Created: {new Date(program.v_createdat).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// 2. List Component - Handles loading states and maps through data
function ProgramsList({ programs, loading }) {
  if (loading) {
    return <p>Loading programs...</p>;
  }

  if (programs.length === 0) {
    return <p className="text-muted-foreground">No programs found</p>;
  }

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <ProgramCard key={program.v_programid} program={program} />
      ))}
    </div>
  );
}

// ============================================================================
// FORM COMPONENTS - Reusable forms for data input
// ============================================================================

// 3. Create Form - Form for creating new programs
function CreateProgramForm({ onSubmit, loading, message }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="code">Program Code</FieldLabel>
        <Input
          id="code"
          name="code"
          placeholder="e.g., PROG-001"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the program..."
          rows={5}
          required
        />
      </Field>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Program"}
        </Button>
        <Button variant="outline" type="reset">
          Cancel
        </Button>
      </div>

      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}

// ============================================================================
// CUSTOM HOOKS - Reusable logic for API operations
// ============================================================================

// 4. Fetch Hook - GET all items from API
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

// 5. Create Hook - POST new item to API
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
          programcode: formData.get("code"),
          description: formData.get("description"),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Program created successfully! ID: ${data.id}`);
        e.target.reset();
        onSuccess?.();
      } else {
        setMessage("Failed to create program");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createProgram, loading, message };
}

// ============================================================================
// MAIN PAGE COMPONENT - Composes all components together
// ============================================================================

// 6. Main Page - Layout and composition
export default function ProgramsPage() {
  const { programs, loading: fetchingPrograms, refetch } = useFetchPrograms();
  const { createProgram, loading: creatingProgram, message } = useCreateProgram(refetch);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Programs</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Form Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Program</h2>
          <CreateProgramForm
            onSubmit={createProgram}
            loading={creatingProgram}
            message={message}
          />
        </div>

        {/* List Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Programs</h2>
          <ProgramsList programs={programs} loading={fetchingPrograms} />
        </div>
      </div>
    </div>
  );
}
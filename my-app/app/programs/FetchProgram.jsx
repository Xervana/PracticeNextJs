"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";


export default function FetchProgram() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");


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

  useEffect(() => {
    fetchPrograms();
  }, []);
  
  const {
    updateProgram,
    loading: updateLoading,
    message,
  } = useUpdateProgram(selectedProgramId, code, () => {
    setIsModalOpen(false);
    setSearchQuery(code); // Set search query to updated program code
    fetchPrograms(); // Refresh the list after update
  });

  const {
    createProgram,
    loading: addLoading,
    createMessage,
  } = useCreateProgram(() => {
    setIsModalOpenAdd(false);
    setSearchQuery(code); // Set search query to updated program code
    setCode("");
    setDescription("");
    fetchPrograms(); // Refresh the list after update
  });

  


  // Get unique active status values
  const uniqueStatuses = [...new Set(programs.map((p) => p.v_isactive))];

  // Filter programs based on search query
  const filteredPrograms = programs.filter(
    (program) =>
      (program.v_programcode?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (program.v_description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  // Filter programs based on category
  const filteredByCategory =
    filterCategory === "All"
      ? filteredPrograms
      : filteredPrograms.filter(
          (program) => String(program.v_isactive) === filterCategory
        );


  const handleRowClick = (program) => {
    setSelectedProgram(program);
    setSelectedProgramId(program.v_programid);
    setCode(program.v_programcode); // Initialize state with current values
    setDescription(program.v_description);
    setIsModalOpen(true);
  };



  const isFormValid = code.trim() !== "" && description.trim() !== "";

  if (loading) return <div className="p-4">Loading programs...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button
          variant="outline"
          onClick={() => { 
            setCode("");
            setDescription("");
            setIsModalOpenAdd(true);
          }}
        >
          <Plus/>
        </Button>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by program code or description..."
          className="flex-1"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
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

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Program ID</TableHead>
            <TableHead>Program Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Active Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Modified At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredByCategory.map((program) => (
            <TableRow
              key={program.v_programid}
              onClick={() => handleRowClick(program)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell className="font-medium">
                {program.v_programid}
              </TableCell>
              <TableCell>{program.v_programcode}</TableCell>
              <TableCell>{program.v_description}</TableCell>
              <TableCell>
                {program.v_isactive ? "Active" : "Inactive"}
              </TableCell>
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>
              Update the program details below.
            </DialogDescription>
          </DialogHeader>
          {selectedProgram && (
            <form onSubmit={updateProgram} className="flex flex-col gap-4">
              <input type="hidden" name="programId" value={selectedProgramId} />
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium mb-1"
                >
                  Program Code
                </label>
                <Input
                  id="code"
                  name="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  value={description}
                  className="w-full border border-gray-300 rounded-md p-2"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="isactive"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="isactive"
                  name="isactive"
                  defaultValue={String(selectedProgram.v_isactive)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              {message && <p className="text-sm text-green-600">{message}</p>}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateLoading || !isFormValid}
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isModalOpenAdd} onOpenChange={setIsModalOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Program</DialogTitle>
            <DialogDescription>
              Add the program details below.
            </DialogDescription>
          </DialogHeader>
            <form onSubmit={createProgram} className="flex flex-col gap-4">
             
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium mb-1"
                >
                  Program Code
                </label>
                <Input
                  id="code"
                  name="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  value={description}
                  className="w-full border border-gray-300 rounded-md p-2"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            {createMessage && <p className="text-sm text-green-600">{createMessage}</p>}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={addLoading || !isFormValid}
                >
                  {addLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpenAdd(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// function to use PUT on frontend
function useUpdateProgram(programId, programCode, onSuccess) {
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
          programcode: formData.get("code"),
          description: formData.get("description"),
          isactive: formData.get("isactive") === "true",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Program updated:", data);
        setMessage(`Program updated successfully!`);
        onSuccess?.();
      } else {
        setMessage("Failed to update program.");
      }
    } catch (error) {
      setMessage("An error occurred while updating the program.");
    } finally {
      setLoading(false);
    }
  };

  return { updateProgram, loading, message };
}



function useCreateProgram(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [createMessage, setMessage] = useState("");

  const createProgram = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.target);
    try{
      const response = await fetch(`/api/programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programcode: formData.get("code"),
          description: formData.get("description"),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Program created:", data.id);
        setMessage(`Program created successfully!`);
        onSuccess?.();
      } else {
        setMessage("Failed to create program.");
      }
    } catch (error) {
      setMessage("An error occurred while creating the program.");
    } finally {
      setLoading(false);
    }
  };
  return { createProgram, loading, createMessage };
}


"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {useState} from "react";

export default function ProgramsPage() {
    const [programCode, setProgramCode] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.target);
    const programData = {
      code: formData.get("code"),
      description: formData.get("description"),
    };
    console.log("Program Data:", programData);
    
    try {
        const response = await fetch("/programs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(programData),
        });
        
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to create program");
        }
        
        setMessage("Program created successfully!");
        setProgramCode('');
        setDescription('');

        console.log("Response:", response);
      } catch (error) {
        console.error("Error creating program:", error);
      }
      finally {
        setLoading(false);
      }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Program</h1>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="program-code">
                  Program Code
                </FieldLabel>
                <Input
                  id="program-code"
                  name="code"
                  placeholder="e.g., PROG-001"
                  required
                />
                <FieldDescription>
                  Enter a unique identifier for this program
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="program-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="program-description"
                  name="description"
                  placeholder="Describe the program..."
                  className="resize-none min-h-[120px]"
                  required
                />
                <FieldDescription>
                  Provide a detailed description of the program
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal" className="mt-6">
            <Button type="submit">Create Program</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
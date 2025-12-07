"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import FetchProgram from "./FetchProgram";


export default function ProgramsPage() {

  // Insert Programs here
  return (
    <div>
      {/* <h1>Programs Page</h1>
      <Card className="w-full max-w-lg mt-6">
        <CardHeader>
          <CardTitle>Create New Program</CardTitle>
          <CardDescription>
            Fill out the form below to create a new program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProgramForm
            onSubmit={createProgram}
            loading={creatingProgram}
            message={message}
          />
        </CardContent>
      </Card> */}
      <FetchProgram />
    </div>
  );
}


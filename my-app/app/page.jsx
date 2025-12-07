'use client';
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { use } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  // ROOT [localhost:3000/]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Alert className="max-w-2xl">
        <Camera className="h-4 w-4" />
        <AlertTitle className="ml-2">Welcome to the App!</AlertTitle>
        <AlertDescription className="ml-6">
          This is a sample alert message to demonstrate the Alert component.
        </AlertDescription>
      </Alert>
      <ButtonOutline/>
    </main>
  );
}

export function ButtonOutline() {
  const router = useRouter();
  
  return (
    <Button variant="outline" onClick={() => router.push('/programs')}>
      Go to Programs
    </Button>
  );
}

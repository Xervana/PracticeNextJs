'use client';
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { use } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p className="text-lg text-center">
        Special Thanks to Daniel Keith for building this application!
      </p>
      <Button onClick={() => router.push('/industry')}>Click Me</Button>
    </div>
  );
}


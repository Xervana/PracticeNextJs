'use client';
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'


export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-4">
      <p className="text-lg text-center">
        Special Thanks to Daniel Keith for building this application!
      </p>
      <Button onClick={() => router.push('/industry')}>Click Me</Button>

      <div
        className="relative w-64 h-64 md:w-96 md:h-96"
        >
            <ThemeToggle />
        </div>
      
    </div>
  );
}



export function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <button onClick={toggleTheme} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
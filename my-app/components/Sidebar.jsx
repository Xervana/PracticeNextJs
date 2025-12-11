"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md lg:hidden hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 h-full bg-gray-800 text-white p-4 transform transition-transform duration-300 z-40 shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 mt-12 lg:mt-0">Sidebar</h2>
        <ul>
          <li className="mb-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-700 block py-2 px-2 rounded transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/industry"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-700 block py-2 px-2 rounded transition-colors"
            >
              Programs
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/tenant"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-700 block py-2 px-2 rounded transition-colors"
            >
              Client Admin
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
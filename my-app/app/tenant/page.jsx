"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ComCreateForm } from "./components/ComCreateForm";
import { ComCard } from "./components/ComCard";
import { useFetchTenants } from "./hooks/UseFetchTenants";
import { useFetchIndustries } from "./hooks/UseFetchIndustries";

import { ComModal } from "./components/ComModal";

export default function TenantPage() {
  const [tenants, refetch] = useFetchTenants();
  const [allIndustry, refetchIndustries] = useFetchIndustries("all");

  console.log("All INDUSTRIES:", allIndustry);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("All");

  const uniqueStatuses = [
    ...new Set(tenants.map((tenant) => tenant.v_isactive)),
  ];

  // Filter programs based on category
  const filteredByIsActive =
    filterActive === "All"
      ? tenants
      : tenants.filter((tenant) => String(tenant.v_isactive) === filterActive);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Tenants</h1>
        <Button className="mb-4" onClick={() => setIsModalOpen(true)}>
          Insert Tenant
        </Button>
        <ComModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ComCreateForm
            industry={allIndustry}
            onSuccess={() => {
              refetch();
              setIsModalOpen(false);
            }}
          />
        </ComModal>
      </div>
      <div className="px-4">
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
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

      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tenants..."
        className="mb-4"
      />
      {filteredByIsActive
        .filter((tenant) =>
          tenant.v_businessname
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
        .map((tenant) => (
          <ComCard
            key={tenant.v_tenantid}
            tenant={tenant}
            industry={allIndustry}
            onSuccess={() => refetch()}
          />
        ))}
    </div>
  );
}

"use client";
import { use, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TextArea } from "@/components/ui/textarea";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

export default function TenantPage() {
  const [tenants, refetch] = useFetchTenants();
  const [allIndustry, refetchIndustries] = useFetchIndustries("all");
  const [tenantIndustries, setTenantIndustries] = useFetchIndustries();

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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <TenantForm
            industry={allIndustry}
            onSuccess={() => {
              refetch();
              setIsModalOpen(false);
            }}
          />
        </Modal>
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
          <TenantCard
            key={tenant.v_tenantid}
            tenant={tenant}
            onSuccess={() => refetch()}
          />
        ))}
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={onClose} className="max-w-lg">
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Insert Tenant
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  ) : null;
}

function TenantCard({ tenant, onSuccess }) {
  console.log("JERE", tenant);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Card className="mb-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold">
          {tenant.v_businessname}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {tenant.v_contactemail}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tenant.v_isactive ? (
          <p className="text-sm text-green-600 font-medium">Status: Active</p>
        ) : (
          <p className="text-sm text-red-600 font-medium">Status: Inactive</p>
        )}
        <p>
          Since{" "}
          {new Date(tenant.v_createdat).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
          })}
        </p>
      </CardContent>
      <Button
        className="m-4"
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
      >
        View Details
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TenantUpdateForm
          onSuccess={() => {
            setIsModalOpen(false);
            onSuccess();
          }}
          tenant={tenant}
        />
      </Modal>
    </Card>
  );
}

function useFetchTenants() {
  const [tenants, setTenants] = useState([]);

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/tenant");
      const data = await response.json();
      setTenants(data);
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to fetch tenants");
      }
      return data;
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchTenants();
  }, []);

  return [tenants, fetchTenants];
}

function TenantUpdateForm({ onSuccess, tenant }) {
  const [tenantIndustryId, setTenantIndustryId] = useState(tenant.v_industryid);
  const [businessName, setBusinessName] = useState(tenant.v_businessname);
  const [contactEmail, setContactEmail] = useState(tenant.v_contactemail);
  const [website, setWebsite] = useState(tenant.v_website);

  const [tenantIsActive, setTenantIsActive] = useState(tenant.v_isactive);

  const [updateTenant, data, error, loading] = useUpdateTenant(
    { onSuccess },
    tenant.v_tenantid
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tenant = {
      businessname: businessName,
      contactemail: contactEmail,
      website: website,
      isactive: tenantIsActive,
      modifiedby: 1,
    };
    await updateTenant(tenant);
    setTenantName("");
    setTenantDescription("");
    setTenantIndustryId("");
    setTenantIsActive(true);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="tenant-form">
        <Input
          className="mb-4"
          type="text"
          placeholder="Tenant Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <Input
          className="mb-4 resize-none overflow-hidden"
          type="text"
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <Input
          className="mb-4"
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <select
          className="mb-4 w-full p-2 border border-gray-300 rounded-md"
          value={tenantIsActive ? "active" : "inactive"}
          onChange={(e) => setTenantIsActive(e.target.value === "active")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Tenant"}
        </Button>
        {error && <p className="error">Error: {error.message}</p>}
        {data && <p className="success">Tenant updated successfully!</p>}
      </form>
    </div>
  );
}

function useUpdateTenant({ onSuccess }, tenantId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const updateTenant = async (tenant) => {
    setLoading(true);
    setError(null);
    if (onSuccess) {
      onSuccess();
    }
    try {
      const response = await fetch(`/api/tenant/${tenantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tenant),
      });
      const data = await response.json();
      console.log("Update successful:", data);
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error updating tenant:", error);
      setError(error);
      setLoading(false);
    }
  };

  return [updateTenant, data, error, loading];
}

// INSERT AREA

function useInsertTenant() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const insertTenant = async (tenant) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tenant),
      });
      const data = await response.json();
      console.log("Insert successful:", data);
      setData(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      console.error("Error inserting tenant:", error);
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  };

  return [insertTenant, data, error, loading];
}

// USAGE EXAMPLE

function TenantForm({ onSuccess, industry }) {
  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState("");

  const [insertTenant, data, error, loading] = useInsertTenant();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tenant = {
      industryid: selectedIndustryId,
      businessname: businessName,
      contactemail: contactEmail,
      website: website,
      createdby: 1,
    };
    console.log("SUBMITTENANT:", tenant);
    const result = await insertTenant(tenant);
    if (result.success) {
      setSelectedIndustryId("");
      setBusinessName("");
      setContactEmail("");
      setWebsite("");
      if (onSuccess) {
        onSuccess();
        console.log("SUCCESS CALLED");
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="tenant-form">
        <Input
          className="mb-4"
          type="text"
          placeholder="Tenant Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <Input
          className="mb-4"
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <Input
          className="mb-4"
          type="text"
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <select
          className="mb-4 w-full p-2 border border-gray-300 rounded-md"
          value={selectedIndustryId}
          onChange={(e) => setSelectedIndustryId(e.target.value)}
        >
          <option value="">Select Industry</option>
          {industry.map((ind) => (
            <option key={ind.v_industryid} value={ind.v_industryid}>
              {ind.v_industryname}
            </option>
          ))}
        </select>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Inserting..." : "Insert Tenant"}
        </Button>
        {error && <p className="error">Error: {error.message}</p>}
        {data && <p className="success">Tenant inserted successfully!</p>}
      </form>
    </div>
  );
}

function useFetchIndustries(industryId) {
  const [industries, setIndustries] = useState([]);

  const fetchIndustries = async () => {
    try {
      const response = await fetch(`/api/industry/${industryId}`);
      const data = await response.json();
      setIndustries(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchIndustries();
  }, []);

  return [industries, fetchIndustries];
}

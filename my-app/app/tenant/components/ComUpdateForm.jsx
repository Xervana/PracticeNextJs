import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateTenant } from "@/app/tenant/hooks/UseUpdateTenant";

export function ComUpdateForm({ onSuccess, tenant, industry }) {
  const [tenantIndustryId, setTenantIndustryId] = useState(tenant.v_industryid);
  const [businessName, setBusinessName] = useState(tenant.v_businessname);
  const [contactEmail, setContactEmail] = useState(tenant.v_contactemail);
  const [website, setWebsite] = useState(tenant.v_website);

  console.log("TENANT INDUSTRY ID:", tenantIndustryId);

  const [tenantIsActive, setTenantIsActive] = useState(tenant.v_isactive);

  const [updateTenant, data, error, loading] = useUpdateTenant(
    { onSuccess },
    tenant.v_tenantid
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tenant = {
      industryid: tenantIndustryId,
      businessname: businessName,
      contactemail: contactEmail,
      website: website,
      isactive: tenantIsActive,
      modifiedby: 1,
    };
    const result = await updateTenant(tenant);
    if (result.success) {
      setTenantIndustryId("");
      setBusinessName("");
      setContactEmail("");
      setWebsite("");
      setTenantIsActive(false);
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
          required
          className="mb-4"
          type="text"
          placeholder="Tenant Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <Input
          required
          className="mb-4 resize-none overflow-hidden"
          type="text"
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <Input
          required
          className="mb-4"
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <select
          className="mb-4 w-full p-2 border border-gray-300 rounded-md"
          value={tenantIndustryId}
          onChange={(e) => setTenantIndustryId(e.target.value)}
        >
          <option value="">Select Industry</option>
          {industry.map((ind) => (
            <option key={ind.v_industryid} value={ind.v_industryid}>
              {ind.v_industryname}
            </option>
          ))}
        </select>

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

export default ComUpdateForm;
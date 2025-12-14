import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInsertTenant } from "@/app/tenant/hooks/UseInsertTenant";
export function ComCreateForm({ onSuccess, industry }) {
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
        required
          className="mb-4"
          type="text"
          placeholder="Tenant Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <Input
        required
          className="mb-4"
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <Input
          required
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

export default ComCreateForm;
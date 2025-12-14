import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { ComModal } from "./ComModal";
import { ComUpdateForm } from "./ComUpdateForm.jsx";

export function ComCard({ tenant, onSuccess, industry }) {
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
      <ComModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ComUpdateForm
          onSuccess={() => {
            setIsModalOpen(false);
            onSuccess();
          }}
          tenant={tenant}
          industry={industry}
        />
      </ComModal>
    </Card>
  );
}

export default ComCard;

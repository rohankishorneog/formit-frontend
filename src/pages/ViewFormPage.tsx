import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFormDetails } from "@/store/slices/FormsSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ViewFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { formDetails, formDetailsLoading } = useAppSelector(
    (state) => state.forms
  );
  const [formResponses, setFormResponses] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchFormDetails(id));
    }
  }, [id, dispatch]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate form responses
    const isValid = formDetails?.fields.every((field) => {
      const value = formResponses[field._id || ""];

      switch (field.fieldType) {
        case "email":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case "number":
          return !isNaN(Number(value));
        case "date":
          return !isNaN(Date.parse(value));
        default:
          return value && value.trim() !== "";
      }
    });

    if (isValid) {
      // TODO: Implement form submission logic
      toast.success("Form submitted successfully");
      // You might want to dispatch an action to save form responses
    } else {
      toast.error("Please fill all fields correctly");
    }
  };

  if (formDetailsLoading) {
    return <div>Loading form...</div>;
  }

  if (!formDetails) {
    return <div>Form not found</div>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div>
        <h1 className="text-2xl font-bold mb-6">{formDetails.title}</h1>

        <form className="space-y-4">
          {formDetails.fields.map((field) => (
            <div key={field._id}>
              <Label htmlFor={field._id}>{field.label}</Label>
              <Input
                id={field._id}
                type={field.fieldType}
                placeholder={field.placeholder}
                value={formResponses[field._id || ""] || ""}
                onChange={(e) =>
                  handleFieldChange(field._id || "", e.target.value)
                }
              />
            </div>
          ))}

          <Button type="button" onClick={handleSubmit}>
            Submit Form
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ViewFormPage;

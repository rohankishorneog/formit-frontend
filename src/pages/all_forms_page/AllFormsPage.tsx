import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllForms } from "@/store/slices/FormsSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const AllFormsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { forms, formsLoading } = useAppSelector((state) => state.forms);

  useEffect(() => {
    dispatch(fetchAllForms());
  }, [dispatch]);

  if (formsLoading) {
    return <div>Loading forms...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Forms</h1>
        <Button onClick={() => navigate("/forms/create")}>
          Create New Form
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="text-center text-gray-500">
          No forms created yet. Click "Create New Form" to get started!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Card
              key={form._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{form.title}</CardTitle>
                <CardDescription>
                  Created on {new Date(form?.createdAt).toLocaleDateString()}
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/forms/${form._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/forms/${form._id}/edit`)}
                  >
                    Edit
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFormsPage;

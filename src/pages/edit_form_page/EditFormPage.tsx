import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchFormDetails,
  resetUpdatingState,
  updateFormDetails,
} from "@/store/slices/FormsSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SortableItem } from "@/components/dnd_components/Sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Edit, Trash } from "lucide-react";
import { inputTypes } from "@/constants";
import CreateFormModal from "@/components/modals/CreateFormModal";
import { EditFieldModal } from "@/components/modals/EditFieldModal";
import { FieldConfig } from "@/types";
import { useParams } from "react-router";
import { useToast } from "@/hooks/use-toast";

const EditFormPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { formUpdated, formUpdatingError } = useAppSelector(
    (state) => state.forms
  );
  const { toast } = useToast();

  const { formDetails } = useAppSelector((state) => state.forms);
  useEffect(() => {
    if (id) dispatch(fetchFormDetails(id));
  }, [id, dispatch]);

  const [formTitle, setFormTitle] = useState(
    formDetails?.title || "Untitled Form"
  );
  const [fields, setFields] = useState<FieldConfig[]>(
    formDetails?.fields || []
  );
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditFieldModal, setOpenEditFieldModal] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldConfig | null>(null);
  const [newField, setNewField] = useState({
    fieldType: "text",
    label: "",
    placeholder: "",
  });

  useEffect(() => {
    if (formDetails) {
      setFormTitle(formDetails.title || "Untitled Form");
      setFields(formDetails.fields || []);
    }
  }, [formDetails]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field._id === active.id);
    const newIndex = fields.findIndex((field) => field._id === over.id);

    setFields(arrayMove(fields, oldIndex, newIndex));
  };

  const handleAddField = () => {
    if (fields.length >= 20) {
      toast({
        title: "Error",
        description: "Total fields cant be more than 20.",
        variant: "destructive",
      });
      return;
    }

    if (!newField.label || !newField.placeholder) {
      toast({
        title: "Error",
        description: "Please fill all the fieild properties",
        variant: "destructive",
      });
      return;
    }

    setFields((prev) => [
      ...prev,
      { ...newField, _id: `${newField.fieldType}-${Date.now()}` },
    ]);

    setNewField({ fieldType: "text", label: "", placeholder: "" });
    setOpenAddModal(false);
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((field) => field._id !== id));
  };

  const handleUpdateForm = () => {
    const formData = {
      _id: id,
      title: formTitle,
      description: "",
      fields,
    };

    dispatch(updateFormDetails(formData));
  };

  const handleEditField = (field: FieldConfig) => {
    setSelectedField(field);
    setOpenEditFieldModal(true);
  };

  const handleSaveFieldEdit = (updatedField: FieldConfig) => {
    setFields((prev) =>
      prev.map((field) =>
        field._id === updatedField._id ? updatedField : field
      )
    );
    setOpenEditFieldModal(false);
    setSelectedField(null);
  };

  useEffect(() => {
    if (formUpdated) {
      toast({
        title: "Updated",
        description: "Successfully updated Form.",
        className: "bg-green-700",
      });
    }

    if (formUpdatingError) {
      toast({
        title: "Error",
        description: "Unable to update form.",
        variant: "destructive",
      });
    }
    dispatch(resetUpdatingState());
  }, [toast, dispatch, formUpdated, formUpdatingError]);

  return (
    <main className="flex justify-center">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Form</h1>

        <div className="mb-4">
          <Label>Form Title</Label>
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Enter form title"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Add Fields</h2>
          <div className="flex gap-4">
            {inputTypes.map((type) => (
              <Button
                key={type.type}
                variant="outline"
                onClick={() => {
                  setNewField((prev) => ({ ...prev, fieldType: type.type }));
                  setOpenAddModal(true);
                }}
              >
                Add {type.type}
              </Button>
            ))}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-4">
              {fields.map((field) => (
                <SortableItem key={field._id} id={field._id || ""}>
                  <div className="border p-4 rounded flex items-center gap-4">
                    <Label>{field.label}</Label>
                    <Input
                      type={field.fieldType}
                      placeholder={field.placeholder}
                      readOnly
                      className="flex-grow"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => handleEditField(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteField(field._id || "")}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="mt-6">
          <Button onClick={handleUpdateForm} disabled={fields.length === 0}>
            Update Form
          </Button>
        </div>

        {openAddModal && (
          <CreateFormModal
            setNewField={setNewField}
            newField={newField}
            handleAddField={handleAddField}
            setOpenAddModal={setOpenAddModal}
          />
        )}

        {openEditFieldModal && selectedField && (
          <EditFieldModal
            setOpenEditFieldModal={setOpenEditFieldModal}
            field={selectedField}
            onSave={handleSaveFieldEdit}
          />
        )}
      </div>
    </main>
  );
};

export default EditFormPage;

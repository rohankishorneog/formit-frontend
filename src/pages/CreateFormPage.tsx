import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createForm, resetCreatingState } from "@/store/slices/FormsSlice";
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
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";

const CreateFormPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { formCreated, formCreatingError, createdFormId } = useAppSelector(
    (state) => state.forms
  );
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditFieldModal, setOpenEditFieldModal] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldConfig | null>(null);
  const [newField, setNewField] = useState({
    fieldType: "text",
    label: "",
    placeholder: "",
  });

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

  const handleSaveForm = () => {
    const fieldsWithoutId = fields.map(
      ({ _id, ...field }: FieldConfig) => field
    );

    const formData = {
      title: formTitle,
      description: "",
      createdAt: new Date(),
      fields: fieldsWithoutId,
    };

    dispatch(createForm(formData));
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
    if (formCreated) {
      toast({
        title: "Form Created",
        description: "Successfully Created Form.",
        className: "bg-green-700",
      });
      dispatch(resetCreatingState());

      navigate(`/forms/${createdFormId}`);
    }

    if (formCreatingError) {
      toast({
        title: "Error",
        description: "Unable to create form.",
        variant: "destructive",
      });
      dispatch(resetCreatingState());
    }
  }, [
    createdFormId,
    formCreated,
    formCreatingError,
    navigate,
    toast,
    dispatch,
  ]);

  return (
    <main className="flex justify-center">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Form</h1>

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
                {type.type}
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
              <h3 className="font-bold">Fields</h3>
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
                      className="w-fit"
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteField(field?._id || "")}
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
          <Button onClick={handleSaveForm} disabled={fields.length === 0}>
            Save Form
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

export default CreateFormPage;

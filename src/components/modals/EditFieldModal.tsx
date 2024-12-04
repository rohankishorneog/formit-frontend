import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/types";
import { useState } from "react";

interface Props {
  setOpenEditFieldModal: React.Dispatch<React.SetStateAction<boolean>>;
  field: FieldConfig;
  onSave: (updatedField: FieldConfig) => void;
}

export function EditFieldModal({
  setOpenEditFieldModal,
  field,
  onSave,
}: Props) {
  const [localField, setLocalField] = useState<FieldConfig>(field);

  const handleSave = () => {
    onSave(localField);
  };

  return (
    <Dialog open={true} onOpenChange={() => setOpenEditFieldModal(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
          <DialogDescription>
            Make changes to your field here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              className="col-span-3"
              value={localField.label}
              onChange={(e) =>
                setLocalField({ ...localField, label: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="placeholder" className="text-right">
              Placeholder
            </Label>
            <Input
              id="placeholder"
              className="col-span-3"
              value={localField.placeholder}
              onChange={(e) =>
                setLocalField({ ...localField, placeholder: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpenEditFieldModal(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";

interface CreateFormModalProps {
  newField: { label: string; placeholder: string; fieldType: string };
  setNewField: React.Dispatch<
    React.SetStateAction<{
      label: string;
      placeholder: string;
      fieldType: string;
    }>
  >;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddField: () => void;
}

const CreateFormModal: React.FC<CreateFormModalProps> = ({
  newField,
  setNewField,
  setOpenAddModal,
  handleAddField,
}) => {
  return (
    <Dialog open={true} onOpenChange={() => setOpenAddModal(false)}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-xl font-semibold mb-4">Add Field</h2>
        </DialogHeader>
        <div className="mb-4">
          <Label>Field Label</Label>
          <Input
            value={newField.label}
            onChange={(e) =>
              setNewField((prev) => ({ ...prev, label: e.target.value }))
            }
            placeholder="Enter field label"
          />
        </div>
        <div className="mb-4">
          <Label>Field Placeholder</Label>
          <Input
            value={newField.placeholder}
            onChange={(e) =>
              setNewField((prev) => ({
                ...prev,
                placeholder: e.target.value,
              }))
            }
            placeholder="Enter field placeholder"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddField}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormModal;

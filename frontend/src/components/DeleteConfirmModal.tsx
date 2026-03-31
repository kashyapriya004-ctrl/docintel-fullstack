import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmModal = ({ open, onClose, onConfirm }: Props) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="font-display text-xl text-primary">
          Delete this entry?
        </DialogTitle>
        <DialogDescription className="font-sans text-sm">
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-2 mt-4">
        <Button variant="outline" onClick={onClose} className="font-sans">
          Cancel
        </Button>
        <Button
          onClick={() => { onConfirm(); onClose(); }}
          className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold"
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteConfirmModal;

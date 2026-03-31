import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, UserPlus } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const GuestLimitModal = ({ open, onClose }: Props) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-display text-xl text-primary">
          Please Sign In to Continue
        </DialogTitle>
        <DialogDescription className="font-sans text-sm">
          You've used all 3 guest queries. Create a free account or sign in to continue searching policies.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-3 mt-4">
        <Button asChild className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold gap-2">
          <Link to="/signup" onClick={onClose}>
            <UserPlus className="h-4 w-4" />
            Create Account
          </Link>
        </Button>
        <Button asChild variant="outline" className="font-sans gap-2">
          <Link to="/login" onClick={onClose}>
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default GuestLimitModal;

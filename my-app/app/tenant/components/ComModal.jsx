
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";

export function ComModal({ isOpen, onClose, children }) {
  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={onClose} className="max-w-lg">
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Title Ito
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  ) : null;
}

export default ComModal;
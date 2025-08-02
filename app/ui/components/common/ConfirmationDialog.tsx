"use client";

import React from "react";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/shadcn/Dialog";

type DialogProps<CData> = {
  open: boolean;
  onClose: () => void;
  confirmationQusestion: string;
  loading?: boolean;
  onDecision: () => void;
  data?: CData | CData[];
  renderItems?: (data?: CData) => React.ReactNode;
};

const ConfirmationDialog = <CData,>({
  open,
  onClose,
  confirmationQusestion,
  loading,
  onDecision,
  data,
  renderItems,
}: DialogProps<CData>) => {
  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[360px] gap-2 md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>{confirmationQusestion}</DialogDescription>
        </DialogHeader>

        {renderItems && (
          <div className="my-2 max-h-[200px] overflow-y-auto text-text-secondary">
            <ul className="list-disc pl-4">
              {Array.isArray(data) ? (
                data?.map((item, index) => (
                  <li key={index}>{renderItems(item)}</li>
                ))
              ) : (
                <li>{renderItems(data)}</li>
              )}
            </ul>
          </div>
        )}

        <DialogFooter className="mt-2 flex flex-row justify-center gap-4">
          <Button
            type="button"
            onClick={onDecision}
            isLoading={loading}
            className="w-[140px]"
          >
            Confirm
          </Button>

          <Button
            disabled={loading}
            type="button"
            onClick={handleClose}
            className="w-[140px]"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;

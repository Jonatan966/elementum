"use client";

import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useElements } from "@/contexts/elements-context";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClearDeckButtonParams {
  i18n: {
    title: string;
    description: string;
    cancelButton: string;
    submitButton: string;
  };
}

export function ClearDeckButton({ i18n }: ClearDeckButtonParams) {
  const { onClearDeckAndDisplay } = useElements();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="destructive">
            <Trash className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-96">
          <DialogHeader>
            <DialogTitle>{i18n.title}</DialogTitle>
            <DialogDescription>{i18n.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{i18n.cancelButton}</Button>
            </DialogClose>

            <DialogClose asChild>
              <Button variant="destructive" onClick={onClearDeckAndDisplay}>
                {i18n.submitButton}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

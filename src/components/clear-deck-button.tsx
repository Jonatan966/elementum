"use client";

import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useElements } from "@/contexts/elements-context";

export function ClearDeckButton() {
  const { onClearDeckAndDisplay } = useElements();

  return (
    <Button size="icon" variant="destructive" onClick={onClearDeckAndDisplay}>
      <Trash className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}

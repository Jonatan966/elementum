import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import { ComponentProps } from "react";

export interface ElementInDisplay {
  name: string;
  emoji?: string;
  id: string;
  x: number;
  y: number;
  isCombining?: boolean;
}

type ElementParams = ComponentProps<"div"> & {
  element: ElementInDisplay;
};

export function Element({ element, className, ...props }: ElementParams) {
  return (
    <div
      key={element.id}
      id={element.id}
      className={cn(
        "bg-secondary flex py-2 px-3 m-1 cursor-pointer",
        className
      )}
      draggable={!element?.isCombining}
      onDragOver={(e) => e.preventDefault()}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        position: "absolute",
      }}
      {...props}
    >
      {element?.isCombining && <LoaderIcon className="animate-spin" />}

      <span>
        {element?.emoji} {element.name}
      </span>
    </div>
  );
}

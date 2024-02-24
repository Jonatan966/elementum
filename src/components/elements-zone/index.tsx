"use client";

import { DragEvent, useRef } from "react";
import { Element, ElementInDisplay } from "./element";
import { useElements } from "@/contexts/elements-context";

type ElementInDeck = Pick<ElementInDisplay, "name" | "emoji">;

export function ElementsZone() {
  const {
    elementsInDeck,
    elementsInDisplay,
    onAddElementInDisplay,
    onCombineElements,
    onMoveElementInDisplay,
  } = useElements();

  const dropZoneRef = useRef<HTMLDivElement>(null);

  function handleElementDragStart(
    event: DragEvent,
    element: ElementInDisplay | ElementInDeck,
    eventType: string
  ) {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        ...element,
        type: eventType,
      })
    );
  }

  function handleDropElementInDisplay(event: DragEvent) {
    event.preventDefault();

    const eventInfo = JSON.parse(event.dataTransfer.getData("text/plain"));

    switch (eventInfo.type) {
      case "add":
        onAddElementInDisplay(eventInfo, event.clientX, event.clientY);
        break;

      case "move":
        onMoveElementInDisplay(eventInfo.id, event.clientX, event.clientY);
        break;
    }
  }

  function handleDropElementInElement(
    event: DragEvent,
    element: ElementInDisplay
  ) {
    event.stopPropagation();

    const elementA = JSON.parse(event.dataTransfer?.getData("text/plain")!);

    onCombineElements(elementA, element, event.clientX, event.clientY);
  }

  return (
    <>
      <main
        className="h-full pt-16 pb-32"
        ref={dropZoneRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropElementInDisplay}
      >
        {elementsInDisplay.map((element) => (
          <Element
            element={element}
            key={element.id}
            onDragStart={(e) => handleElementDragStart(e, element, "move")}
            onDrop={(e) => handleDropElementInElement(e, element)}
          />
        ))}
      </main>

      <footer className="absolute bottom-0 left-0 right-0 container max-h-32 overflow-y-auto text-center">
        {elementsInDeck.map((element) => (
          <div
            key={element.name}
            className="bg-secondary inline-block py-2 px-3 m-1 cursor-pointer"
            draggable
            onDragStart={(e) => handleElementDragStart(e, element, "add")}
          >
            {element.emoji} {element.name}
          </div>
        ))}
      </footer>
    </>
  );
}

"use client";

import { appService } from "@/services/app";
import { useRef, useState } from "react";

interface ElementsZoneParams {
  language: string;
}

interface ElementInDisplay {
  name: string;
  emoji: string;
  id: string;
  x: number;
  y: number;
}

const basicElements = [
  {
    name: "Agua",
    emoji: "🚿",
  },
  {
    name: "Fogo",
    emoji: "🔥",
  },
  {
    name: "Vento",
    emoji: "🌬️",
  },
  {
    name: "Terra",
    emoji: "🌍",
  },
];

export function ElementsZone({ language }: ElementsZoneParams) {
  const [elementsInDisplay, setElementsInDisplay] = useState<
    ElementInDisplay[]
  >([]);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  function onAddElementInDisplay(
    element: Pick<ElementInDisplay, "name" | "emoji">,
    x: number,
    y: number
  ) {
    const elementPayload = {
      name: element.name,
      emoji: element.emoji,
      x,
      y,
      id: crypto.randomUUID(),
    };

    setElementsInDisplay((old) => [...old, elementPayload]);
  }

  function onMoveElementInDisplay(elementId: string, x: number, y: number) {
    setElementsInDisplay((old) =>
      old.map((element) =>
        element.id === elementId ? { ...element, x, y } : element
      )
    );
  }

  async function onCombineElements(
    elementA: ElementInDisplay,
    elementB: ElementInDisplay,
    x: number,
    y: number
  ) {
    const newElement = await appService.makeCombination({
      elementA: elementA.name,
      elementB: elementB.name,
      language,
    });

    setElementsInDisplay((old) =>
      old.filter(
        (element) => ![elementA?.id, elementB?.id].includes(element.id)
      )
    );

    onAddElementInDisplay(
      {
        emoji: newElement.emoji,
        name: newElement.element,
      },
      x,
      y
    );
  }

  return (
    <>
      <main
        className="h-full pt-16 pb-32"
        ref={dropZoneRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();

          const eventInfo = JSON.parse(e.dataTransfer.getData("text/plain"));

          switch (eventInfo.type) {
            case "add":
              onAddElementInDisplay(eventInfo, e.clientX, e.clientY);
              break;

            case "move":
              onMoveElementInDisplay(eventInfo.id, e.clientX, e.clientY);
              break;
          }
        }}
      >
        {elementsInDisplay.map((element) => (
          <div
            key={element.id}
            id={element.id}
            className="bg-secondary inline-block py-2 px-3 m-1 cursor-pointer"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  ...element,
                  type: "move",
                })
              );
            }}
            onDrop={(e) => {
              e.stopPropagation();

              const elementA = JSON.parse(
                e.dataTransfer?.getData("text/plain")!
              );

              onCombineElements(elementA, element, e.clientX, e.clientY);
            }}
            onDragOver={(e) => e.preventDefault()}
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              position: "absolute",
            }}
          >
            {element.emoji} {element.name}
          </div>
        ))}
      </main>

      <footer className="absolute bottom-0 left-0 right-0 container max-h-32 overflow-y-auto text-center">
        {basicElements.map((element) => (
          <div
            key={element.name}
            className="bg-secondary inline-block py-2 px-3 m-1 cursor-pointer"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  ...element,
                  type: "add",
                })
              );
            }}
          >
            {element.emoji} {element.name}
          </div>
        ))}
      </footer>
    </>
  );
}

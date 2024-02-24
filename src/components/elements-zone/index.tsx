"use client";

import { appService } from "@/services/app";
import { DragEvent, useRef, useState } from "react";
import { Element, ElementInDisplay } from "./element";
import { useLocalStorage } from "@/hooks/use-localstorage";

type ElementInDeck = Pick<ElementInDisplay, "name" | "emoji">;

interface ElementsZoneParams {
  language: string;
  initialElements: ElementInDeck[];
}

const DECK_STORAGE_KEY = "@elementum:deck";

export function ElementsZone({
  language,
  initialElements,
}: ElementsZoneParams) {
  const [elementsInDisplay, setElementsInDisplay] = useState<
    ElementInDisplay[]
  >([]);
  const [elementsInDeck, setElementsInDeck] = useLocalStorage(
    initialElements,
    `${DECK_STORAGE_KEY}-${language}`
  );

  const dropZoneRef = useRef<HTMLDivElement>(null);

  function onAddElementInDisplay(element: ElementInDeck, x: number, y: number) {
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
    if (elementA.id === elementB.id) {
      return;
    }

    const temporaryElementId = crypto.randomUUID();

    setElementsInDisplay((old) => [
      ...old.filter(
        (element) => ![elementA?.id, elementB?.id].includes(element.id)
      ),
      {
        id: temporaryElementId,
        name: `${elementA.emoji} + ${elementB.emoji}`,
        x,
        y,
        isCombining: true,
      },
    ]);

    const newElement = await appService.makeCombination({
      elementA: elementA.name,
      elementB: elementB.name,
      language,
    });

    setElementsInDeck((old) =>
      old.some((element) => element.name === newElement.element)
        ? old
        : [
            ...old,
            {
              emoji: newElement.emoji,
              name: newElement.element,
            },
          ]
    );

    setElementsInDisplay((old) =>
      old.filter((element) => element.id !== temporaryElementId)
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

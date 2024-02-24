"use client";

import { i18n } from "@/app/i18n/settings";
import { ElementInDisplay } from "@/components/elements-zone/element";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { appService } from "@/services/app";
import { ReactNode, createContext, useContext, useState } from "react";

type ElementInDeck = Pick<ElementInDisplay, "name" | "emoji">;

interface ElementsProviderParams {
  children: ReactNode;
  language: string;
  initialElements: ElementInDeck[];
}

interface ElementsContextParams {
  elementsInDisplay: ElementInDisplay[];
  elementsInDeck: ElementInDeck[];
  onClearDeckAndDisplay(): void;
  onAddElementInDisplay(element: ElementInDeck, x: number, y: number): void;
  onMoveElementInDisplay(elementId: string, x: number, y: number): void;
  onCombineElements(
    elementA: ElementInDisplay,
    elementB: ElementInDisplay,
    x: number,
    y: number
  ): void;
}

const DECK_STORAGE_KEY = "@elementum:deck";

export const ElementsContext = createContext({} as ElementsContextParams);

export function ElementsProvider({
  children,
  language,
  initialElements,
}: ElementsProviderParams) {
  const [elementsInDisplay, setElementsInDisplay] = useState<
    ElementInDisplay[]
  >([]);

  const [elementsInDeck, setElementsInDeck] = useLocalStorage<ElementInDeck[]>(
    initialElements,
    `${DECK_STORAGE_KEY}-${language}`
  );

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

  function onClearDeckAndDisplay() {
    for (const targetLanguage of i18n.locales) {
      localStorage.removeItem(`${DECK_STORAGE_KEY}-${targetLanguage}`);
    }

    setElementsInDeck(initialElements);
    setElementsInDisplay([]);
  }

  return (
    <ElementsContext.Provider
      value={{
        elementsInDeck,
        elementsInDisplay,
        onClearDeckAndDisplay,
        onAddElementInDisplay,
        onCombineElements,
        onMoveElementInDisplay,
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
}

export const useElements = () => useContext(ElementsContext);

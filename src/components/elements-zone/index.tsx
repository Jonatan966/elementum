"use client";

import { DragEvent, useRef } from "react";

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

export function ElementsZone() {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  function newElement(baseElementId: string, x: number, y: number) {
    let targetElement = document.getElementById(baseElementId)!;

    if (targetElement.id.includes("dock-")) {
      targetElement = targetElement.cloneNode(true) as HTMLDivElement;

      targetElement.id = crypto.randomUUID();

      targetElement.addEventListener("dragstart", (e) => {
        e.dataTransfer!.setData("text/plain", targetElement.id);
      });

      targetElement.addEventListener("dragover", (e) => e.preventDefault());

      targetElement.addEventListener("drop", (e) => {
        console.log({
          first: e.dataTransfer?.getData("text/plain"),
          second: targetElement.id,
        });
      });
    }

    targetElement.style.position = "absolute";
    targetElement.style.left = `${x - targetElement.clientWidth / 2}px`;
    targetElement.style.top = `${y - targetElement.clientHeight / 2}px`;

    dropZoneRef.current?.appendChild(targetElement);
  }

  return (
    <>
      <main
        className="h-full pt-16 pb-32"
        ref={dropZoneRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();

          const id = e.dataTransfer.getData("text/plain");

          newElement(id, e.clientX, e.clientY);
        }}
      />

      <footer className="absolute bottom-0 left-0 right-0 container max-h-32 overflow-y-auto text-center">
        {basicElements.map((element) => (
          <div
            key={element.name}
            className="bg-secondary inline-block py-2 px-3 m-1 cursor-pointer"
            data-element={element.name}
            draggable
            id={`dock-${element.name}`}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", e.currentTarget.id);
            }}
          >
            {element.emoji} {element.name}
          </div>
        ))}
      </footer>
    </>
  );
}

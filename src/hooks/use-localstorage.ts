import { useEffect, useState } from "react";

type OnUpdateState<T> = (newStateValue: T | ((newValue: T) => T)) => void;

export function useLocalStorage<T>(initialState: T, storageKey: string) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawSavedState = localStorage.getItem(storageKey);

    if (!rawSavedState) {
      return;
    }

    const savedState = JSON.parse(rawSavedState) as T;

    if ((Array.isArray(savedState) && savedState?.length) || !!savedState) {
      setState(savedState);
    }
  }, [storageKey]);

  const onUpdateState: OnUpdateState<T> = (newValueRequest) => {
    let newStateValue = newValueRequest;

    if (newValueRequest instanceof Function) {
      newStateValue = newValueRequest(state);
    }

    localStorage.setItem(storageKey, JSON.stringify(newStateValue));
    setState(newStateValue);
  };

  return [state, onUpdateState] as [T, OnUpdateState<T>];
}

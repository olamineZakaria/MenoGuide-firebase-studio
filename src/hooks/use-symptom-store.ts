"use client";

import { useSyncExternalStore } from "react";
import type { SymptomData } from "@/lib/types";

let store: SymptomData = {
  mood: "",
  sleepQuality: "",
  hotFlashes: "",
  otherSymptoms: "",
};

let listeners: (() => void)[] = [];

const symptomStore = {
  get: () => store,
  set: (newStore: SymptomData) => {
    store = newStore;
    if (typeof window !== "undefined") {
      localStorage.setItem("symptoms", JSON.stringify(store));
    }
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  init: () => {
    if (typeof window !== "undefined") {
      const storedSymptoms = localStorage.getItem("symptoms");
      if (storedSymptoms) {
        store = JSON.parse(storedSymptoms);
      }
    }
    return store;
  }
};

symptomStore.init();

export function useSymptomStore() {
  const symptoms = useSyncExternalStore(symptomStore.subscribe, symptomStore.get, symptomStore.init);
  
  return {
    symptoms,
    setSymptoms: symptomStore.set,
  };
}

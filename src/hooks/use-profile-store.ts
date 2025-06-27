"use client";

import { useSyncExternalStore } from "react";
import type { ProfileData } from "@/lib/types";

let store: ProfileData = {
  username: "Jane",
  avatarUrl: "https://placehold.co/100x100.png",
  dietaryPreferences: "vegetarian",
  menopauseNotes: "",
};

let listeners: (() => void)[] = [];

const profileStore = {
  get: () => store,
  set: (newStore: ProfileData) => {
    store = newStore;
    if (typeof window !== "undefined") {
      localStorage.setItem("profile", JSON.stringify(store));
      // Keep username in sync with the old system for now
      localStorage.setItem("username", store.username);
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
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        store = JSON.parse(storedProfile);
      } else {
        // Check for old username and migrate it
        const oldUsername = localStorage.getItem("username");
        if (oldUsername) {
          store.username = oldUsername;
        }
      }
    }
    return store;
  }
};

profileStore.init();

export function useProfileStore() {
  const profile = useSyncExternalStore(profileStore.subscribe, profileStore.get, profileStore.init);
  
  return {
    profile,
    setProfile: profileStore.set,
  };
}

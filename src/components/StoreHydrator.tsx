"use client";

import { useEffect } from "react";
import { useHealthStore } from "@/store/healthStore";

export function StoreHydrator() {
  const hydrate = useHealthStore((state) => state.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return null;
}


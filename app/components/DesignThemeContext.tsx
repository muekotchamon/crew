"use client";

import { createContext, useContext } from "react";

export type DesignVariant = 1 | 2 | 3;

const DesignThemeContext = createContext<DesignVariant>(1);

export function DesignThemeProvider({
  value,
  children,
}: {
  value: DesignVariant;
  children: React.ReactNode;
}) {
  return <DesignThemeContext.Provider value={value}>{children}</DesignThemeContext.Provider>;
}

export function useDesignVariant(): DesignVariant {
  return useContext(DesignThemeContext);
}

export function scrDesignClass(v: DesignVariant): string {
  return `scr-design-${v}`;
}

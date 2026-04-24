"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface CursorContextType {
  cursorDisabled: boolean;
  setCursorDisabled: (v: boolean) => void;
  cursorText: string | null;
  setCursorText: (text: string | null) => void;
  inFooter: boolean;
  setInFooter: (v: boolean) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorDisabled: false,
  setCursorDisabled: () => {},
  cursorText: null,
  setCursorText: () => {},
  inFooter: false,
  setInFooter: () => {},
});

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
  const [cursorDisabled, setCursorDisabledState] = useState(false);
  const [cursorText, setCursorTextState] = useState<string | null>(null);
  const [inFooter, setInFooterState] = useState(false);

  const setCursorDisabled = useCallback((v: boolean) => setCursorDisabledState(v), []);
  const setCursorText = useCallback((t: string | null) => setCursorTextState(t), []);
  const setInFooter = useCallback((v: boolean) => setInFooterState(v), []);

  return (
    <CursorContext.Provider value={{ cursorDisabled, setCursorDisabled, cursorText, setCursorText, inFooter, setInFooter }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);

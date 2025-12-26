// app/context/GenderContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Gender = 'All' | 'Men' | 'Women' | 'Kids';

interface GenderContextType {
  selectedGender: Gender;
  setSelectedGender: (gender: Gender) => void;
}

const GenderContext = createContext<GenderContextType | undefined>(undefined);

export const GenderProvider = ({ children }: { children: ReactNode }) => {
  const [selectedGender, setSelectedGender] = useState<Gender>('All');

  return (
    <GenderContext.Provider value={{ selectedGender, setSelectedGender }}>
      {children}
    </GenderContext.Provider>
  );
};

export const useGender = () => {
  const context = useContext(GenderContext);
  if (!context) {
    throw new Error('useGender must be used within a GenderProvider');
  }
  return context;
};
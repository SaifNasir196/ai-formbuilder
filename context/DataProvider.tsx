"use client"

import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext({});

export const useProfileContext = () => useContext(DataContext);

export const DataProvider = ({
    children
}: Readonly<{
  children: React.ReactNode;
}>) => {
    

  

    return (
        <DataContext.Provider value={{ }}>
        {children}
        </DataContext.Provider>
    );
};

import React, { createContext, useState, useContext } from "react";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);  // ⭐ store full list

  return (
    <AddressContext.Provider
      value={{
        selectedAddress,
        setSelectedAddress,
        addresses,
        setAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);

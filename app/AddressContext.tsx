import React, { createContext, ReactNode, useContext, useState } from "react";

interface Address {
    _id: string;
    addressType: string;
    addressLine1: string;
    area: string;
    city: string;
    [key: string]: any;
}

interface AddressContextType {
    selectedAddress: Address | null;
    setSelectedAddress: (address: Address | null) => void;
    addresses: Address[];
    setAddresses: (addresses: Address[]) => void;
}

const AddressContext = createContext<AddressContextType>({
    selectedAddress: null,
    setSelectedAddress: () => { },
    addresses: [],
    setAddresses: () => { },
});

export const AddressProvider = ({ children }: { children: ReactNode }) => {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);

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

export const useAddress = () => {
    return useContext(AddressContext);
};

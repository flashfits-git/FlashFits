import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
    useState,
} from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAddress } from '@/app/AddressContext';
import { getAddresses } from '@/app/api/productApis/cartProduct';

interface AddressModalProps {
    onSelectAddress?: (address: any) => void; // Used by parent (CartBag)
}

const AddressModalize = forwardRef(({ onSelectAddress }: AddressModalProps, ref) => {
    const router = useRouter();
    const modalRef = useRef<Modalize>(null);
    console.log('model;999');

    const {
        setSelectedAddress,
        addresses,
        setAddresses,
    } = useAddress();

    const [loading, setLoading] = useState(false);

    // Allow parent to open modal
    useImperativeHandle(ref, () => ({
        open: () => modalRef.current?.open(),
        close: () => modalRef.current?.close(),
    }));

    // Fetch addresses when opened
    const loadAddresses = async () => {
        try {
            if (addresses) {
                return
            } else {
                setLoading(true);
                const res = await getAddresses();
                console.log('97787');    
                setAddresses(res?.addresses || []);
            }
        } catch (err) {
            console.log('getAddresses Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Trigger API fetch when modal opens
    const handleOpen = () => {
        loadAddresses();
    };

    const selectAddress = async (item: any) => {
        setSelectedAddress(item);
        await SecureStore.setItemAsync('selectedAddress', JSON.stringify(item));
        onSelectAddress?.(item);
        modalRef.current?.close();
        reCheck()
    };

    const reCheck = async () => {

        console.log('reCheck00000');

        let saved = await SecureStore.getItemAsync('selectedAddress');

        // const res = await getAddresses();
        // setAddresses(res.addresses || []);

        if (!saved) {
            setTimeout(() => modalRef.current?.open(), 200);
        }
    };


    const EmptyAddress = ({ router, modalRef }: any) => (
        <>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 15 }}>
                No Address Found
            </Text>

            <TouchableOpacity
                onPress={() => {
                    modalRef.current?.close();
                    router.push('/(stack)/SelectLocationScreen');
                }}
                style={{
                    backgroundColor: '#000',
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                    Add Address
                </Text>
            </TouchableOpacity>
        </>
    );

    const AddressList = ({ addresses, router, modalRef, selectAddress }: any) => (
        <View style={{ padding: 10, width: '100%' }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 15,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: '700' }}>Select Address</Text>

                <TouchableOpacity
                    onPress={() => {
                        modalRef.current?.close();
                        router.push('/(stack)/SelectLocationScreen');
                    }}
                    style={{
                        backgroundColor: '#000',
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                        Add Address
                    </Text>
                </TouchableOpacity>
            </View>

            {addresses.map((item: any) => (
                <TouchableOpacity
                    key={item._id}
                    onPress={() => selectAddress(item)}
                    style={{
                        padding: 15,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        marginBottom: 12,
                        backgroundColor: '#fafafa',
                    }}
                >
                    <Text style={{ fontSize: 14, fontWeight: '700' }}>
                        {item.addressType}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#555', marginTop: 3 }}>
                        {item.addressLine1}
                    </Text>
                    <Text style={{ fontSize: 13, marginTop: 5 }}>
                        {item.name} • {item.phone}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );


    return (
        <Modalize
            ref={modalRef}
            adjustToContentHeight
            onOpened={handleOpen}
            onClosed={reCheck}
        >
            <View style={{ padding: 20, marginBottom: 12 }}>
                {loading ? (
                    <ActivityIndicator size={30} color="black" />
                ) : addresses.length === 0 ? (
                    <EmptyAddress router={router} modalRef={modalRef} />
                ) : (
                    <AddressList
                        addresses={addresses}
                        router={router}
                        modalRef={modalRef}
                        selectAddress={selectAddress}
                    />
                )}
            </View>
        </Modalize>
    );
});

export default AddressModalize;

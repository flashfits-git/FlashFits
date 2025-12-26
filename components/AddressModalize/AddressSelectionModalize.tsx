import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
    useState,
} from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAddress } from '@/app/AddressContext';
import { getAddresses } from '@/app/api/productApis/cartProduct';

interface AddressModalProps {
    onSelectAddress?: (address: any) => void;
}

const AddressModalize = forwardRef(({ onSelectAddress }: AddressModalProps, ref) => {
    const router = useRouter();
    const modalRef = useRef<Modalize>(null);

    const {
        setSelectedAddress,
        addresses,
        setAddresses,
        selectedAddress
    } = useAddress();

    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => modalRef.current?.open(),
        close: () => modalRef.current?.close(),
    }));

    const loadAddresses = async () => {
        try {
            if (addresses) {
                return;
            } else {
                setLoading(true);
                const res = await getAddresses();
                setAddresses(res?.addresses || []);
            }
        } catch (err) {
            console.log('getAddresses Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        loadAddresses();
    };

    const selectAddress = async (item: any) => {
        setSelectedAddress(item);
        await SecureStore.setItemAsync('selectedAddress', JSON.stringify(item));
        onSelectAddress?.(item);
        modalRef.current?.close();
    };

    const handleClosed = async () => {
        const saved = await SecureStore.getItemAsync('selectedAddress');
        console.log(saved,'savedsavedsavedsaved');
        
        if (!saved) {
            console.log('No address selected → reopening modal');
            setTimeout(() => modalRef.current?.open(), 200);
        }
    };

    const EmptyAddress = ({ router, modalRef }: any) => (
        <View style={styles.emptyContainer}>
            {/* <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>📍</Text>
            </View> */}
            
            <Text style={styles.emptyTitle}> 📍 No Address Found</Text>
            <Text style={styles.emptySubtitle}>
                Add your delivery address to continue
            </Text>

            <TouchableOpacity
                onPress={() => {
                    modalRef.current?.close();
                    router.push('/(stack)/SelectLocationScreen');
                }}
                style={styles.addButtonLarge}
                activeOpacity={0.8}
            >
                <Text style={styles.addButtonLargeText}>
                    + Add New Address
                </Text>
            </TouchableOpacity>
        </View>
    );

    const AddressList = ({ addresses, router, modalRef, selectAddress }: any) => (
        <View style={styles.listContainer}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Select Delivery Address</Text>
                    <Text style={styles.headerSubtitle}>
                        {addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => {
                    modalRef.current?.close();
                    router.push('/(stack)/SelectLocationScreen');
                }}
                style={styles.addButtonLarge}
                activeOpacity={0.8}
            >
                <Text style={styles.addButtonLargeText}>
                    + Add New Address
                </Text>
            </TouchableOpacity>

            <View style={styles.addressesContainer}>
                {addresses.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={item._id}
                        onPress={() => selectAddress(item)}
                        style={[
                            styles.addressCard,
                            selectedAddress?._id === item._id && styles.addressCardSelected
                        ]}
                        activeOpacity={0.7}
                    >
                        <View style={styles.addressHeader}>
                            <View style={styles.addressTypeContainer}>
                                <Text style={styles.addressTypeIcon}>
                                    {item.addressType === 'Home' ? '🏠' : 
                                     item.addressType === 'Work' ? '💼' : '📍'}
                                </Text>
                                <Text style={styles.addressType}>
                                    {item.addressType}
                                </Text>
                            </View>
                            {selectedAddress?._id === item._id && (
                                <View style={styles.selectedBadge}>
                                    <Text style={styles.selectedBadgeText}>✓</Text>
                                </View>
                            )}
                        </View>
                        
                        <Text style={styles.addressLine} numberOfLines={2}>
                            {item.addressLine1}
                        </Text>
                        
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactText}>
                                👤 {item.name}
                            </Text>
                            <Text style={styles.contactDivider}>•</Text>
                            <Text style={styles.contactText}>
                                📞 {item.phone}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <Modalize
            ref={modalRef}
            adjustToContentHeight
            onOpened={handleOpen}
            onClosed={handleClosed}
            closeOnOverlayTap={false}
            panGestureEnabled={false}
            tapGestureEnabled={false}
            withOverlay={true}
            modalStyle={styles.modalStyle}
        >
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#000" />
                        <Text style={styles.loadingText}>Loading addresses...</Text>
                    </View>
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

const styles = StyleSheet.create({
    modalStyle: {
        pointerEvents: 'auto',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 32,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    
    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
    },
    
    // List View
    listContainer: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    
    // Add Button (Large)
    addButtonLarge: {
        backgroundColor: '#000',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    addButtonLargeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    
    // Address Cards
    addressesContainer: {
        gap: 12,
    },
    addressCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#e5e5e5',
        backgroundColor: '#fff',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    addressCardSelected: {
        borderColor: '#000',
        backgroundColor: '#f9f9f9',
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addressTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressTypeIcon: {
        fontSize: 20,
    },
    addressType: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    selectedBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedBadgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    addressLine: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 12,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    contactDivider: {
        fontSize: 13,
        color: '#ccc',
    },
});

export default AddressModalize;
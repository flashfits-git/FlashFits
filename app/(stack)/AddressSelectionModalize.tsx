import { useAddress } from '@/app/AddressContext';
import { getAddresses } from '@/app/api/productApis/cartProduct';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import Colors from '../../assets/theme/Colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
            const res = await getAddresses();
            // console.log(res?.addresses, 'res?.addressesres?.addressesres?.addresses');
            setAddresses(res?.addresses || []);

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

        if (!saved) {
            console.log('No address selected → reopening modal');
            setTimeout(() => modalRef.current?.open(), 200);
        }
    };

    const EmptyAddress = ({ router, modalRef }: any) => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="location-outline" size={40} color={Colors.primary} />
            </View>

            <Text style={styles.emptyTitle}>No Address Found</Text>
            <Text style={styles.emptySubtitle}>
                Add your delivery address to continue shopping
            </Text>

            <TouchableOpacity
                onPress={() => {
                    modalRef.current?.close();
                    router.push('/(stack)/SelectLocationScreen');
                }}
                style={styles.addButtonLarge}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={20} color={Colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.addButtonLargeText}>
                    Add New Address
                </Text>
            </TouchableOpacity>
        </View>
    );

    const AddressList = ({ addresses, router, modalRef, selectAddress }: any) => (
        <View style={{ flex: 1, paddingBottom: 16 }}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Deliver To</Text>
                    <Text style={styles.headerSubtitle}>
                        {addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        modalRef.current?.close();
                        router.push('/(stack)/SelectLocationScreen');
                    }}
                    style={styles.headerAddButton}
                >
                    <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={styles.addressesContainer}
            >
                {addresses.map((item: any) => (
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
                                <View style={[
                                    styles.typeIconBox,
                                    selectedAddress?._id === item._id && styles.typeIconBoxSelected
                                ]}>
                                    <Ionicons
                                        name={item.addressType === 'Home' ? 'home' :
                                            item.addressType === 'Work' ? 'briefcase' : 'location'}
                                        size={16}
                                        color={selectedAddress?._id === item._id ? Colors.white : Colors.primary}
                                    />
                                </View>
                                <Text style={styles.addressType}>
                                    {item.addressType}
                                </Text>
                            </View>
                            {selectedAddress?._id === item._id && (
                                <View style={styles.selectedBadge}>
                                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                                </View>
                            )}
                        </View>

                        <Text style={styles.addressLine} numberOfLines={2}>
                            {item.addressLine1}
                        </Text>

                        <View style={styles.contactInfo}>
                            <View style={styles.contactItem}>
                                <Ionicons name="person-outline" size={14} color={Colors.secondary} />
                                <Text style={styles.contactText}>{item.name}</Text>
                            </View>
                            <View style={styles.contactDivider} />
                            <View style={styles.contactItem}>
                                <Ionicons name="call-outline" size={13} color={Colors.secondary} />
                                <Text style={styles.contactText}>{item.phone}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                onPress={() => {
                    modalRef.current?.close();
                    router.push('/(stack)/SelectLocationScreen');
                }}
                style={[styles.addButtonLarge, { marginTop: 12 }]}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={18} color={Colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.addButtonLargeText}>
                    Add New Address
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modalize
            ref={modalRef}
            modalHeight={SCREEN_HEIGHT * 0.5}
            onOpened={handleOpen}
            onClosed={handleClosed}
            withOverlay={true}
            modalStyle={styles.modalStyle}
        >
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
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
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: Colors.secondary,
        fontWeight: '600',
        fontFamily: 'Manrope-SemiBold',
    },

    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.primary,
        marginBottom: 8,
        fontFamily: 'Manrope-ExtraBold',
    },
    emptySubtitle: {
        fontSize: 15,
        color: Colors.secondary,
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: 'Manrope-Medium',
        paddingHorizontal: 20,
        lineHeight: 22,
    },

    // List View
    listContainer: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.primary,
        fontFamily: 'Manrope-ExtraBold',
    },
    headerSubtitle: {
        fontSize: 13,
        color: Colors.secondary,
        fontWeight: '600',
        fontFamily: 'Manrope-SemiBold',
        marginTop: 2,
    },
    headerAddButton: {
        padding: 4,
    },

    // Add Button (Large)
    addButtonLarge: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    addButtonLargeText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '800',
        fontFamily: 'Manrope-ExtraBold',
        letterSpacing: 0.5,
    },

    // Address Cards
    addressesContainer: {
        gap: 12,
        paddingBottom: 8,
    },
    addressCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    addressCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
        borderWidth: 2,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addressTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    typeIconBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeIconBoxSelected: {
        backgroundColor: Colors.primary,
    },
    addressType: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
        fontFamily: 'Manrope-Bold',
    },
    selectedBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressLine: {
        fontSize: 14,
        color: Colors.dark2,
        lineHeight: 20,
        marginBottom: 10,
        fontFamily: 'Manrope-Medium',
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    contactText: {
        fontSize: 13,
        color: Colors.secondary,
        fontWeight: '600',
        fontFamily: 'Manrope-SemiBold',
    },
    contactDivider: {
        width: 1,
        height: 10,
        backgroundColor: '#E0E0E0',
    },
});

export default AddressModalize;
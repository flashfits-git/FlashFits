import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    useEffect
} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView
} from 'react-native';
import { Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useAddress } from '@/app/AddressContext';
import { getAddresses } from '@/app/api/productApis/cartProduct';

interface AddressModalProps {
    onSelectAddress?: (address: any) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AddressModalize = forwardRef<any, AddressModalProps>(
    ({ onSelectAddress }, ref) => {
        const router = useRouter();
        const modalRef = useRef<Modalize>(null);

        const {
            addresses,
            setAddresses,
            setSelectedAddress,
        } = useAddress();

        const [loading, setLoading] = useState(false);

        // console.log(addresses, 'addressesaddres333sesaddresses');



        // const checkAndOpenModal = async () => {
        //     try {
        //         const storedAddress = await SecureStore.getItemAsync('selectedAddress');

        //         // If address exists → do nothing (no popup)
        //         if (storedAddress) {
        //             return;
        //         }

        //         // If no address → open modal
        //         modalRef.current?.open();
        //     } catch (error) {
        //         console.log('SecureStore check error:', error);
        //         modalRef.current?.open(); // fail-safe
        //     }
        // };

        // useEffect(() => {
        //     checkAndOpenModal();
        // }, []);



        useImperativeHandle(ref, () => ({
            open: () => modalRef.current?.open(), // 👈 guarded open
            close: () => modalRef.current?.close(),
        }));

        const loadAddresses = async () => {
            if (addresses?.length) return;

            try {
                setLoading(true);
                const res = await getAddresses();
                setAddresses(res?.addresses || []);
            } catch (e) {
                console.log('getAddresses error', e);
            } finally {
                setLoading(false);
            }
        };

        const selectAddress = async (item: any) => {
            setSelectedAddress(item);
            await SecureStore.setItemAsync(
                'selectedAddress',
                JSON.stringify(item)
            );
            onSelectAddress?.(item);
            modalRef.current?.close();
        };

        const ensureAddressExists = async () => {
            try {
                const stored = await SecureStore.getItemAsync('selectedAddress');

                if (!stored) {
                    // Small delay avoids close/open conflict
                    setTimeout(() => {
                        modalRef.current?.open();
                    }, 200);
                }
            } catch (e) {
                console.log('SecureStore check failed:', e);
                setTimeout(() => {
                    modalRef.current?.open();
                }, 200);
            }
        };


        const hasAddress = addresses && addresses.length > 0;

        return (
            <Modalize
                ref={modalRef}
                modalHeight={SCREEN_HEIGHT * 0.31}
                onOpened={loadAddresses}
                onClosed={ensureAddressExists} 
                closeOnOverlayTap={false}
                panGestureEnabled={true}
                modalStyle={styles.modal}
            >
                <View style={styles.container}>
                    {/* FIXED HEADER */}
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}> {hasAddress ? 'Select Delivery Address' : 'No Address Found'}</Text>
                        <TouchableOpacity>
                            {hasAddress ? <Text style={styles.viewAll}>VIEW ALL</Text>
                                : <Text style={styles.viewAll}>Add Address</Text>}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* SCROLLABLE LIST */}
                    <ScrollView
                        style={styles.listScroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {loading ? (
                            <View style={styles.loader}>
                                <ActivityIndicator size="large" color="#000" />
                            </View>
                        ) : addresses && addresses.length > 0 ? (
                            addresses.slice(0, 2).map((item: any) => (
                                <TouchableOpacity
                                    key={item._id}
                                    onPress={() => selectAddress(item)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.addressRow}>
                                        <Ionicons
                                            name="navigate"
                                            size={24}
                                            color="#9ca3af"
                                            style={styles.iconStyle}
                                        />
                                        <View style={styles.addressText}>
                                            <Text style={styles.addressTitle}>
                                                {item.addressType || 'Home'}
                                            </Text>
                                            <Text numberOfLines={2} style={styles.addressSubtitle}>
                                                {item.addressLine1},{item.addressLine2},{item.city},{item.state},{item.country},{item.zipCode}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.addressDivider} />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                {/* <Ionicons name="location-outline" size={56} color="#9ca3af" /> */}

                                <TouchableOpacity
                                    style={styles.addAddressButton}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        modalRef.current?.close();
                                        router.push('/(stack)/SelectLocationScreen');
                                    }}
                                >
                                    <Text style={styles.addAddressText}>ADD ADDRESS</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>

                    {/* FIXED FOOTER */}
                    <View style={styles.footer}>
                        {/* <View style={styles.divider} /> */}
                        <TouchableOpacity
                            style={styles.manualRow}
                            onPress={() => {
                                modalRef.current?.close();
                                router.push('/(stack)/SelectLocationScreen');
                            }}
                        >
                            <Ionicons
                                name="search"
                                size={20}
                                color="#000"
                                style={styles.manualIcon}
                            />
                            <Text style={styles.manualText}>Enter Location Manually</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modalize>
        );
    }
);

export default AddressModalize;

const styles = StyleSheet.create({
    modal: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#fff',
    },

    container: {
        flex: 1,
        paddingTop: 20,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },

    viewAll: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
        letterSpacing: 0.5
    },

    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
    },

    listScroll: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexGrow: 1,
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },

    addressRow: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
    },

    iconStyle: {
        marginRight: 16,
        marginTop: 2,
    },

    addressText: {
        flex: 1,
    },

    addressTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    addressSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },

    addAddressButton: {
        marginTop: 20,
        backgroundColor: '#000',
        paddingVertical: 24,
        paddingHorizontal: 58,
        borderRadius: 12,
    },

    addAddressText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
    },

    addressDivider: {
        height: 1,
        backgroundColor: '#f3f4f6',
    },

    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4b5563',
        marginTop: 16,
        marginBottom: 8,
    },

    emptySubtitle: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },

    footer: {
        backgroundColor: '#fff',
    },

    manualRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },

    manualIcon: {
        marginRight: 12,
    },

    manualText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
});
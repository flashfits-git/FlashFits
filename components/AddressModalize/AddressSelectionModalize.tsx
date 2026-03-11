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
                modalHeight={SCREEN_HEIGHT * 0.5}
                onOpened={loadAddresses}
                onClosed={ensureAddressExists}
                closeOnOverlayTap={false}
                panGestureEnabled={true}
                modalStyle={styles.modal}
            >
                <View style={styles.container}>
                    {/* FIXED HEADER */}
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerTitle}>
                                {hasAddress ? 'Select Delivery Address' : 'No Address Found'}
                            </Text>
                            {hasAddress && (
                                <Text style={styles.headerSubtitle}>
                                    {addresses.length} saved addresses
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                modalRef.current?.close();
                                router.push('/(stack)/SavedAddressesScreen' as any);
                            }}
                        >
                            <Text style={styles.viewAll}>{hasAddress ? 'VIEW ALL' : 'Add'}</Text>
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
                                <ActivityIndicator size="large" color={Colors.primary} />
                                <Text style={styles.loaderText}>Fetching your addresses...</Text>
                            </View>
                        ) : addresses && addresses.length > 0 ? (
                            addresses.slice(0, 2).map((item: any) => (
                                <TouchableOpacity
                                    key={item._id}
                                    onPress={() => selectAddress(item)}
                                    activeOpacity={0.7}
                                    style={styles.addressItem}
                                >
                                    <View style={styles.addressRow}>
                                        <View style={styles.iconBox}>
                                            <Ionicons
                                                name={item.addressType === 'Home' ? 'home' :
                                                    item.addressType === 'Work' ? 'briefcase' : 'location'}
                                                size={20}
                                                color={Colors.primary}
                                            />
                                        </View>
                                        <View style={styles.addressText}>
                                            <Text style={styles.addressTitle}>
                                                {item.addressType || 'Home'}
                                            </Text>
                                            <Text numberOfLines={2} style={styles.addressSubtitle}>
                                                {[item.addressLine1, item.area, item.city].filter(Boolean).join(', ')}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
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
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: Colors.white,
        elevation: 10,
    },

    container: {
        flex: 1,
        paddingTop: 24,
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
        fontWeight: '800',
        color: Colors.primary,
        fontFamily: 'Manrope-ExtraBold',
    },

    headerSubtitle: {
        fontSize: 12,
        color: Colors.secondary,
        fontFamily: 'Manrope-Medium',
        marginTop: 2,
    },

    viewAll: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.primary,
        letterSpacing: 0.5,
        fontFamily: 'Manrope-ExtraBold',
    },

    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },

    listScroll: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        flexGrow: 1,
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },

    loaderText: {
        marginTop: 12,
        fontSize: 14,
        color: Colors.secondary,
        fontFamily: 'Manrope-Medium',
    },

    addressItem: {
        marginTop: 4,
    },

    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },

    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    addressText: {
        flex: 1,
    },

    addressTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 2,
        fontFamily: 'Manrope-Bold',
    },

    addressSubtitle: {
        fontSize: 13,
        color: Colors.secondary,
        lineHeight: 18,
        fontFamily: 'Manrope-Medium',
    },

    addAddressButton: {
        marginTop: 16,
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    addAddressText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
        fontFamily: 'Manrope-ExtraBold',
    },

    addressDivider: {
        height: 1,
        backgroundColor: '#F9FAFB',
    },

    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },

    footer: {
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },

    manualRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },

    manualIcon: {
        marginRight: 12,
    },

    manualText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
        fontFamily: 'Manrope-Bold',
    },
});

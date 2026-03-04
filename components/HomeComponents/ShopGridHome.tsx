import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 12;
const ITEM_WIDTH = (width - (COLUMN_COUNT + 1) * SPACING) / COLUMN_COUNT;

interface Merchant {
    _id: string;
    shopName: string;
    logo?: {
        url: string;
    };
}

interface ShopGridHomeProps {
    merchants: Merchant[];
}

const ShopGridHome: React.FC<ShopGridHomeProps> = ({ merchants }) => {
    const navigation = useNavigation<any>();

    const handlePress = (merchantId: string) => {
        navigation.navigate('(stack)/ShopDetails/StoreDetailPage', {
            merchantId,
        });
    };

    const renderItem = ({ item }: { item: Merchant }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item._id)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                {item.logo?.url ? (
                    <Image
                        source={{ uri: item.logo.url }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.placeholderLogo}>
                        <Text style={styles.placeholderText}>
                            {item.shopName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={styles.shopName} numberOfLines={1}>
                {item.shopName}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={merchants}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListContent}
            />
        </View>
    );
};

const CARD_SIZE = 90;

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    horizontalListContent: {
        // paddingLeft: 16,
        paddingRight: 8,
        paddingBottom: 16,
    },
    card: {
        width: CARD_SIZE,
        marginRight: 10,
        alignItems: 'center',
    },
    imageContainer: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // Premium shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F8FAFC',
        overflow: 'hidden',
    },
    logo: {
        width: '75%',
        height: '75%',
    },
    placeholderLogo: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#CBD5E1',
        fontFamily: 'Montserrat',
    },
    shopName: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '700',
        color: '#334155',
        fontFamily: 'Montserrat',
        textAlign: 'center',
        width: '100%',
    },
});

export default ShopGridHome;

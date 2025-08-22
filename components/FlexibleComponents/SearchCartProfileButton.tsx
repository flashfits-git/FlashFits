import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GetCart } from '../../app/api/productApis/cartProduct';
import Colors from '../../assets/theme/Colors';
import { useCart } from '../../app/ContextParent';

function SearchCartProfileButton() {
  const router = useRouter();
  const { cartCount, setCartCount } = useCart();

  // Fetch cart data on component mount
  React.useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await GetCart();
        // console.log(response.items,'4444g4g3g');
        // Set the cart count (assuming it's the number of items in the array)
        setCartCount(response.items?.length || 0);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, []);

  return (
    <View style={styles.flx}>
      <TouchableOpacity onPress={() => router.push('/MainSearchPage')}>
        <Ionicons name="search-outline" size={28} color={Colors.dark1} style={{ paddingHorizontal: 4 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/ShoppingBag')} style={{ paddingHorizontal: 4 }}>
        <View style={styles.iconWithBadge}>
          <Ionicons name="bag-handle-outline" size={24} color="#000" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(profile)')}>
        <Ionicons name="person-outline" size={26} color="#091f5b" style={{ paddingHorizontal: 4 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flx: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  iconWithBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default SearchCartProfileButton;

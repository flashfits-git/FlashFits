import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GetCart } from '../../app/api/productApis/cartProduct';
import { useCart } from '../../app/ContextParent';

const ICON_COLOR = '#0F0F0F';

function SearchCartProfileButton({ hideSearchIcon = false }: { hideSearchIcon?: boolean }) {
  const router = useRouter();
  const { cartCount, setCartCount } = useCart();
  const [loading, setLoading] = useState(true);
  // Fetch cart data on component mount
  React.useEffect(() => {
    const fetchCart = async () => {
      try {

        // 🔐 0️⃣ CHECK TOKEN FIRST
        const token = await SecureStore.getItemAsync('token');

        if (!token) {
          console.log('No token found → skipping address API');
          setLoading(false);
          return; // ❌ STOP HERE — NO API CALL
        }


        const response = await GetCart();
        setCartCount(response.items?.length || 0);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, []);

  return (
    <View style={styles.flx}>
      {!hideSearchIcon && (
        <TouchableOpacity onPress={() => router.push('/MainSearchPage')}>
          <Ionicons name="search" size={24} color={ICON_COLOR} style={{ paddingHorizontal: 4 }} />
        </TouchableOpacity>
      )}

      {!hideSearchIcon && (
        <TouchableOpacity onPress={() => router.push('/ShoppingBag')} style={{ paddingHorizontal: 4 }}>
          <View style={styles.iconWithBadge}>
            <Ionicons name="bag-handle" size={22} color={ICON_COLOR} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push('/(profile)')}>
        <View style={styles.profileCircle}>
          <Ionicons name="person" size={18} color={ICON_COLOR} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flx: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  iconWithBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
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
  profileCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
});

export default SearchCartProfileButton;

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus, X } from 'lucide-react-native';
// import productImage from '../../assets/images/1.jpg';

const pro = require('../../assets/images/2.jpg');


type CartItemProps = {
  name: string;
  size: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

const CartItem: React.FC<CartItemProps> = ({
  name,
  size,
  price,
  originalPrice,
  quantity,
  imageUrl,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <View style={styles.container}>

<View style={styles.imageContainer}>
  <Image
    source={pro}
    style={styles.image}
    resizeMode="contain"
  />
</View>
      {/* Product Info */}
      <View style={styles.productInfo}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={onRemove}>
            <X size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Text style={styles.size}>Size: {size}</Text>

        <View style={styles.priceContainer}>
          <View style={styles.priceGroup}>
            <Text style={styles.currentPrice}>${price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
          </View>

          <View style={styles.quantityBox}>
            <TouchableOpacity onPress={onDecrease} style={styles.qtyButton}>
              <Minus size={16} color="#000" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>
              {String(quantity).padStart(2, '0')}
            </Text>

            <TouchableOpacity onPress={onIncrease} style={styles.qtyButton}>
              <Plus size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    marginHorizontal: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  productInfo: {
    flex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  size: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  currentPrice: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  originalPrice: {

    color: '#9ca3af',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft:8
  },
  qtyButton: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
    borderWidth: 1,
  },
  qtyText: {
    paddingHorizontal: 8,
    color: '#000',
    fontWeight: '500',
    width: 24,
    textAlign: 'center',
  },
  imageContainer: {
    width: 80, // 3rem
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // Optional spacing from text
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default CartItem;

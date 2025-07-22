import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BagProduct({ product, onDelete, onQuantityChange }) {
  const navigation = useNavigation();
  const [updatingQuantity, setUpdatingQuantity] = useState(null);

  // const handleQuantityChange = async (itemId, newQuantity, currentQuantity) => {
  //   if (newQuantity < 1) return;
    
  //   if (newQuantity !== currentQuantity) {
  //     setUpdatingQuantity(itemId);
  //     try {
  //       // Call parent function to update quantity
  //       if (onQuantityChange) {
  //         await onQuantityChange(itemId, newQuantity);
  //       }
  //     } catch (error) {
  //       console.error('Failed to update quantity:', error);
  //       Alert.alert('Error', 'Failed to update quantity. Please try again.');
  //     } finally {
  //       setUpdatingQuantity(null);
  //     }
  //   }
  // };

  // const renderQuantityControls = (item) => {
  //   const isUpdating = updatingQuantity === item.id;
    
  //   return (

  //   );
  // };

  const renderFeatureRow = (icon, text, isAvailable = true) => (
    <View style={styles.featureRow}>
      <View style={[styles.featureIcon, { backgroundColor: isAvailable ? '#E7F8F2' : '#FFF3F3' }]}>
        <Ionicons 
          name={isAvailable ? "checkmark" : "close"} 
          size={10} 
          color={isAvailable ? "#00B386" : "#FF6B6B"} 
        />
      </View>
      <Text style={[styles.featureText, { color: isAvailable ? '#333' : '#999' }]}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {product?.map((item, index) => {
        const saved = item.mrp - item.price;
        const discountPercent = Math.round(((item.mrp - item.price) / item.mrp) * 100);
        // const totalPrice = item.price * item.quantity;
        // const totalSaved = saved * item.quantity;

        return (
          <TouchableOpacity
            key={index}
            style={styles.container}
            onPress={() =>
              navigation.navigate('(stack)/ProductDetail/productdetailpage', {
                id: item.id,
                variantId: item.variantId
              })
            }
            activeOpacity={0.95}
          >
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>{discountPercent}% OFF</Text>
              </View>
            )}

            {/* Product Image */}
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image source={{ uri: item.image.url }} style={styles.image} />
              ) : (
                <View style={styles.noImageContainer}>
                  <Ionicons name="image-outline" size={40} color="#ccc" />
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}
            </View>

            {/* Product Details */}
            <View style={styles.detailsContainer}>
              {/* Product Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                {item.merchantName && (
                  <Text style={styles.merchantName} numberOfLines={1}>
                   {item.merchantName}
                  </Text>
                )}
              </View>

              {/* Price Section */}
              <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                  <Text style={styles.currentPrice}>₹{item.price.toLocaleString()}</Text>
                  {item.mrp > item.price && (
                    <Text style={styles.originalPrice}>₹{item.mrp.toLocaleString()}</Text>
                  )}
                </View>
                {saved > 0 && (
                  <Text style={styles.savings}>
                    You save: <Text style={styles.savingsAmount}>₹{saved.toLocaleString()}</Text>
                  </Text>
                )}
              </View>

              {/* Size and Quantity Row */}
              <View style={styles.attributesRow}>
                <TouchableOpacity style={styles.sizeContainer} disabled>
                  <Text style={styles.sizeLabel}>Size</Text>
                  <Text style={styles.sizeValue}>{item.size || 'N/A'}</Text>
                </TouchableOpacity>
                      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Qty:</Text>
        <View style={styles.quantityControls}>
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityText}>
             {item.quantity || 'N/A'}
            </Text>
          </View>
          
        </View>
      </View>

              </View>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {renderFeatureRow("checkmark", "Try then Buy")}
                {renderFeatureRow("checkmark", "Instant Return")}
              </View>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => onDelete(item.id)}
              style={styles.deleteButton}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF5252']}
                style={styles.deleteGradient}
              >
                <Ionicons name="trash-outline" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 4,
    position: 'relative',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  
  // Discount Badge
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 5,
  },
  discountBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  
  // Image Section
  imageContainer: {
    marginRight: 12,
    
  },
  image: {
    width: 130,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  noImageContainer: {
    width: 100,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  noImageText: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 4,
    fontFamily: 'Montserrat',
  },
  
  // Details Container
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 32, // Space for delete button
  },
  
  // Title Section
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
    lineHeight: 18,
    marginBottom: 2,
  },
  merchantName: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Montserrat',
    fontStyle: 'italic',
  },
  
  // Price Section
  priceSection: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    fontFamily: 'Montserrat',
  },
  savings: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  savingsAmount: {
    color: '#00B386',
    fontWeight: '600',
  },
  
  // Attributes Row (Size + Quantity)
  attributesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Size Container
  sizeContainer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sizeLabel: {
    fontSize: 9,
    color: '#666',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  sizeValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  
  // Quantity Controls
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:10
  },
  quantityLabel: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Montserrat',
    // marginRight: 1,
  },
  // quantityControls: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#F8F9FA',
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#E5E5E5',
  // },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  quantityDisplay: {
    minWidth: 32,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E5E5',
    paddingRight:8
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Montserrat',
  },
  
  // Features Container
  featuresContainer: {
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  featureIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  featureText: {
    fontSize: 10,
    fontFamily: 'Montserrat',
    fontWeight: '400',
  },
  
  // Total Section
  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
  },
  totalSaved: {
    fontSize: 10,
    color: '#00B386',
    fontFamily: 'Montserrat',
    fontWeight: '500',
  },
  
  // Delete Button
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteGradient: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
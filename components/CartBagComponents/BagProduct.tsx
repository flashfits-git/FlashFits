import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {deleteCartItem} from '../../app/api/productApis/cartProduct'

export default function BagProduct({ productData, onDelete }) {
      const [cartItems, setCartItems ] = useState([]);

// console.log(productData,'REEEFC');

  // useEffect(() => {
  //   // Set initial cart items from props when component mounts or props update
  //   if (productData && productData.length > 0) {
  //     setCartItems(productData);
  //   }
  // }, [productData]);

  // const handleDelete = async (itemId) => {
  //   try {
  //     await deleteCartItem(itemId);

  //     // Filter out deleted item using _id (not .id)
  //     const updatedCart = cartItems.filter(item => item._id !== itemId);
  //     setCartItems(updatedCart); // Update local state to re-render UI
  //   } catch (error) {
  //     console.error("Failed to delete cart item:", error);
  //   }
  // };


  return (
    <>
      {productData?.map((item, index) => {
        const saved = item.mrp - item.price;
        return (
          <View key={index} style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/images/3.jpg')}
                style={styles.image}
              />
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.strikePrice}>₹{item.mrp}</Text>
              </View>

              <Text style={styles.discount}>
                You Saved: <Text style={styles.greenText}>₹{saved}</Text>
              </Text>

              <TouchableOpacity style={styles.sizeBox}>
                <Text style={styles.sizeText}>Size: {item.size || 'N/A'}</Text>
              </TouchableOpacity>

              <Text style={styles.deliveryText}>
                Est. Delivery in <Text style={styles.greenText}>2 hour</Text>
              </Text>
              <View style={styles.returnRow}>
                <Text style={styles.deliveryText1}>
                  Instant Return (Try then Buy)
                </Text>
                <Image
                  source={require('../../assets/images/shoppingbag/icons8-tick-100.png')}
                  style={styles.tickIcon}
                />
              </View>
            </View>

              <TouchableOpacity onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={18} color="black" />
              </TouchableOpacity>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
container: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  backgroundColor: 'white',
  borderRadius: 12,
  borderTopRightRadius: 15,
  margin: 8,
  position: 'relative',
  minHeight: 130,
  padding: 8,
  // Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  // Shadow for Android
  elevation: 4,
}, 
  // innerLeftShadow: {
  //   position: 'absolute',
  //   left: 0,
  //   top: 0,
  //   bottom: 0,
  //   width: 12,
  //   backgroundColor: 'rgba(0,0,0,0.06)',
  //   borderTopLeftRadius: 12,
  //   borderBottomLeftRadius: 12,
  //   zIndex: 1,
  // },
  imageContainer: {
    position: 'relative',
    zIndex: 2,
  },
  image: {
    width: 120,
    height: 130,
    borderRadius: 12,
  },
  googlePayImage: {
    width: 20,
    height: 15,
    marginLeft: 4
  },
  returnRow: {
    // width:,
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
},
tickIcon: {
  width: 14,
  height: 14,
  marginLeft: 4,
  resizeMode: 'contain',
},
  detailsContainer: {
    flex: 1,
    marginLeft: 8,
    paddingRight: 8,
    paddingVertical: 4,
    height: 130,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  titleContainer: {
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
    marginRight: 6,
    fontFamily: 'Montserrat'
  },
  strikePrice: {
    fontSize: 10,
    color: 'gray',
    textDecorationLine: 'line-through',
    fontFamily: 'Montserrat'
  },
  discount: {
    color: 'green',
    fontSize: 11,
    marginBottom: 2,
    fontFamily: 'Montserrat',
  },
  sizeBox: {
    padding: 4,
    backgroundColor: '#f1f1f1',
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  sizeText: {
    fontSize: 11,
    color: 'gray',
    fontFamily: 'Montserrat'
  },
  deliveryText: {
    fontSize: 11,
    fontFamily: 'Montserrat',
    fontWeight: '300',
    marginBottom: 2,
  },
  deliveryText1: {
    fontSize: 9,
    fontFamily: 'Montserrat',
    fontWeight: '300',
    flex: 1,
  //  width:20,
  },
  greenText: {
    color: 'green',
    fontFamily: 'Montserrat',
    fontWeight: '500'
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 6,
    zIndex: 3,
  },
});

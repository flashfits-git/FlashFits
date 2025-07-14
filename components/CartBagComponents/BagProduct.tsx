import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BagProduct({ product, onDelete }) {
  const navigation = useNavigation();

  //  console.log(product,'HU#EHIFI');
   
  return (
    <>
      {product?.map((item, index) => {
        const saved = item.mrp - item.price;

        return (
              <TouchableOpacity
                key={index}
                style={styles.container}
                onPress={() =>
                  navigation.navigate('(stack)/ProductDetail/productdetailpage', {
                    id: item.id, // ✅ Correct based on your data
                  })
                }
                activeOpacity={0.9}
              >
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image source={{ uri: item.image.url }} style={styles.image} />
              ) : (
                <Text>No image</Text>
              )}
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

              <TouchableOpacity style={styles.sizeBox} disabled>
                <Text style={styles.sizeText}>Size: {item.size || 'N/A'}</Text>
              </TouchableOpacity>

              <View style={styles.returnRow}>
                <Text style={styles.deliveryText}>Try then Buy</Text>
                <Image
                  source={require('../../assets/images/shoppingbag/icons8-tick-100.png')}
                  style={styles.tickIcon}
                />
              </View>

              <View style={styles.returnRow}>
                <Text style={styles.deliveryText}>Instant Return</Text>
                <Image
                  source={require('../../assets/images/shoppingbag/icons8-tick-100.png')}
                  style={styles.tickIcon}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => onDelete(item.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={18} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
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
    margin: 8,
    position: 'relative',
    minHeight: 130,
    padding: 8,
    width: '85%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    zIndex: 2,
  },
  image: {
    width: 120,
    height: 130,
    borderRadius: 12,
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
    fontFamily: 'Montserrat',
  },
  strikePrice: {
    fontSize: 10,
    color: 'gray',
    textDecorationLine: 'line-through',
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  deliveryText: {
    fontSize: 11,
    fontFamily: 'Montserrat',
    fontWeight: '300',
    marginBottom: 2,
  },
  tickIcon: {
    width: 14,
    height: 14,
    marginLeft: 4,
    resizeMode: 'contain',
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenText: {
    color: 'green',
    fontFamily: 'Montserrat',
    fontWeight: '500',
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

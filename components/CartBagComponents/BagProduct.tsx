import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BagProduct() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/3.jpg')} // Update path if needed
          style={styles.image}
        />
        {/* <TouchableOpacity style={styles.checkbox}>
          <Ionicons name="checkmark" size={20} color="white" />
        </TouchableOpacity> */}
      </View>

      <View style={styles.detailsContainer}>
        <View style={{paddingRight:16}}>
        <Text style={styles.title}>Red Solid Strapless Mini Dress</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹663</Text>
          <Text style={styles.strikePrice}>₹779</Text>
        </View>

        <Text style={styles.discount}>You Saved:  <Text style={styles.greenText}>₹116</Text> </Text>

        <TouchableOpacity style={styles.sizeBox}>
          <Text style={styles.sizeText}>Size: M</Text>
        </TouchableOpacity>

        <Text style={styles.deliveryText}>Est. Delivery in <Text style={styles.greenText}>2 hour</Text></Text> 
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.deliveryText1}>Instant return (Try then Buy)</Text>
            <Image
              source={require('../../assets/images/shoppingbag/icons8-tick-100.png')}
              style={styles.googlePayImage}
            />
          </View>
        {/* <View style={styles.returnRow}>
          <Ionicons name="reload" size={16} color="black" />
          <Text style={styles.returnText}> 7 Days - Returns/Exchanges</Text>
        </View> */}
      </View>

      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // padding: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 12,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
    googlePayImage: { width: 20, height: 15, paddingLeft:6},
  checkbox: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily:'Montserrat'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    marginRight: 8,
    fontFamily:'Montserrat'
  },
  strikePrice: {
    fontSize: 10,
    color: 'gray',
    textDecorationLine: 'line-through',
    fontFamily:'Montserrat'
  },
  discount: {
    color: 'green',
    fontSize: 12,
    marginVertical: 4,
    fontFamily:'Montserrat',
    // fontWeight:300
  },
  sizeBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignSelf: 'flex-start',
    fontFamily:'Montserrat'
  },
  sizeText: {
    fontSize: 14,
    color: 'gray',
  },
  deliveryText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily:'Montserrat',
    fontWeight:300
  },
    deliveryText1: {
    marginTop: 4,
    fontSize: 10,
    fontFamily:'Montserrat',
    fontWeight:300
  },
  greenText: {
    color: 'green',
    fontFamily:'Montserrat',
    fontWeight:500
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  returnText: {
    fontSize: 14,
  },
  deleteButton: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 6,
  },
});

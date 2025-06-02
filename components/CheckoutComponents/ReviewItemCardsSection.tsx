import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

export default function ReviewItemCardsSection() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/3.jpg')} // Update path if needed
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <View style={{paddingRight:16}}>
        <Text style={styles.title}>Red Solid Strapless Mini Dress</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹663</Text>
          <Text style={styles.strikePrice}>₹779</Text>
        </View>

        {/* <Text style={styles.discount}>You Saved:  <Text style={styles.greenText}>₹116</Text> </Text> */}

        <TouchableOpacity style={styles.sizeBox}>
          <Text style={styles.sizeText}>Size: <Text style={{fontWeight:'bold'}}>M</Text></Text>
          <Text style={styles.sizeText}>Color:<Text style={{fontWeight:'bold'}}>Black</Text> </Text>
        </TouchableOpacity>

        {/* <Text style={styles.deliveryText}>Instant return Available</Text> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.deliveryText}>Instant return</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 10,
      alignItems: 'flex-start',
    },
    image: {
      width: 100,
      height: 140,
      borderRadius: 8,
    },  greenText: {
    color: 'green',
    fontFamily:'Montserrat',
    fontWeight:500
  },
    googlePayImage: { width: 20, height: 15, paddingLeft:6},

    detailsContainer: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'space-between',
    },
      greenText: {
        // paddingLeft:44,
    color: 'green',
    fontFamily:'Montserrat',
    fontWeight:500
  },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    title: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
      marginBottom: 6,
          fontFamily:'Montserrat'
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    strikePrice: {
      fontSize: 14,
      color: 'gray',
      textDecorationLine: 'line-through',
      marginRight: 4,
      paddingLeft:5,
          fontFamily:'Montserrat'

    },
    price: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000',
          fontFamily:'Montserrat'

    },
    sizeQtyRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    subText: {
      fontSize: 13,
      color: 'gray',
    },
    subTextBold: {
      fontWeight: '600',
      color: '#000',
    },
    // deliveryText: {
    //   fontSize: 5,
    //   color: '#000',
    // },
    deliveryDate: {
      color: 'green',
      fontWeight: '600',
    },
  //     detailsContainer: {
  //   flex: 1,
  //   marginLeft: 12,
  // },
  discount: {
    color: 'green',
    fontSize: 12,
    marginVertical: 4,
    fontFamily:'Montserrat',
    // fontWeight:300
    paddingTop:2
  },
  sizeBox: {
    marginTop: 2,
    padding: 8,
    // backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignSelf: 'flex-start',
    fontFamily:'Montserrat'
  },
  sizeText: {
    fontSize: 14,
    color: 'gray',
    padding:2
  },
  deliveryText: {
    // marginTop: 8,
    fontSize: 10,
    fontFamily:'Montserrat',
    fontWeight:400,
    color:'#00845c'
  },
  });
  

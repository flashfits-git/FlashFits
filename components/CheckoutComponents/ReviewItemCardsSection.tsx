import { View, Text, Image, StyleSheet } from 'react-native';

export default function ReviewItemCardsSection() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/3.jpg')} // Update path if needed
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            Black Solid Tie Up Maxi Dr...
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.strikePrice}>₹1,129</Text>
            <Text style={styles.price}>₹799</Text>
          </View>
        </View>

        <View style={styles.sizeQtyRow}>
          <Text style={styles.subText}>
            Size: <Text style={styles.subTextBold}>XS</Text>
          </Text>
          <Text style={[styles.subText, { marginLeft: 16 }]}>
            Qty: <Text style={styles.subTextBold}>1</Text>
          </Text>
        </View>

        <Text style={styles.deliveryText}>
          Deliver by{' '}
          <Text style={styles.deliveryDate}>02 May-03 May</Text>
        </Text>
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
    },
    detailsContainer: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'space-between',
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
    },
    price: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000',
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
    deliveryText: {
      fontSize: 13,
      color: '#000',
    },
    deliveryDate: {
      color: 'green',
      fontWeight: '600',
    },
  });
  

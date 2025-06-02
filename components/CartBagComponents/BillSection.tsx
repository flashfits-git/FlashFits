import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BillSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Details(1)</Text>
      <Text style={styles.subHeader}>Prices are inclusive of all taxes</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Bag Subtotal</Text>
        <Text style={styles.value}>₹779</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Bag Discount</Text>
        <Text style={styles.discount}>-₹0</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Coupon Discount</Text>
        <Text style={styles.discount}>-₹116</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Coupon Name</Text>
        <Text style={styles.coupon}>first15</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Wallet Money</Text>
        <Text style={styles.discount}>-₹0</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Shipping Fee</Text>
        <Text style={styles.value}>₹49</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Amount Payable</Text>
        <Text style={styles.totalValue}>₹712.00</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 2,
    // paddingBottom: 10,
    marginTop: 27,
    // borderRadius: 8,
    elevation: 2,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily:'Montserrat'
  },
  subHeader: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
    marginTop: 2,
    fontFamily:'Montserrat'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontFamily:'Montserrat'
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontFamily:'Montserrat'
  },
  discount: {
    fontSize: 14,
    color: 'green',
    fontFamily:'Montserrat'
  },
  coupon: {
    fontSize: 14,
    color: 'green',
    fontWeight: '500',
    fontFamily:'Montserrat'
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderStyle: 'dotted',
    marginVertical: 16,
    fontFamily:'Montserrat'
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily:'Montserrat'
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily:'Montserrat'
  },
});

export default BillSection;

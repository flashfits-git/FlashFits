import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

function Loader() {
  return ( 
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3399ff" />
      <Text>Loading categories...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import loader1 from '../../assets/loaders/loader1.json'; // ✅ lowercase 'loader1', not a component

function Loader() {
  return ( 
    <View style={styles.loadingContainer}>
      <LottieView
        source={loader1}       // ✅ use as source
        autoPlay
        loop
        style={{ width: 400, height: 400 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // optional
  },
});

export default Loader;

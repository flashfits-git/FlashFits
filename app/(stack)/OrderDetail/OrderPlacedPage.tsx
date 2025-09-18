import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Order Header Component
const OrderHeader = ({ orderData }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Instamart order</Text>
        <Text style={styles.headerSubtitle}>{orderData.orderTime} • {orderData.itemCount} items</Text>
      </View>
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuDots}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

// Delivery Status Component
const DeliveryStatus = ({ currentStep, deliveryPartner, estimatedTime }) => {
  const statusMessages = [
    'Assigning Delivery Partner',
    'Out for delivery',
    'Reached Your Doorstep - Try & Buy Time!',
    'Payment Complete',
    'Return Process Complete'
  ];

  return (
    <View style={styles.deliveryStatusContainer}>
      <Text style={styles.deliveryStatusTitle}>{statusMessages[currentStep]}</Text>
      <Text style={styles.deliveryStatusSubtitle}>
        {currentStep === 1 && `${deliveryPartner} is on the way to deliver your order`}
        {currentStep === 2 && 'Try your items and decide what to keep. Pay only for what you love!'}
        {currentStep === 3 && 'Thank you for your payment. You can still return remaining items.'}
        {currentStep === 4 && 'All processes completed successfully'}
        {currentStep === 0 && 'We are finding the best delivery partner for you'}
      </Text>
      
      {currentStep === 1 && (
        <View style={styles.timeEstimateContainer}>
          <Text style={styles.timeEstimate}>{estimatedTime}</Text>
          <Text style={styles.timeLabel}>mins</Text>
        </View>
      )}

      <View style={styles.deliveryActions}>
        <TouchableOpacity style={styles.viewItemsButton}>
          <View style={styles.bagIcon} />
          <Text style={styles.viewItemsText}>View item list</Text>
        </TouchableOpacity>
        
        {deliveryPartner && currentStep <= 1 && (
          <View style={styles.deliveryPartnerInfo}>
            <View style={styles.partnerAvatar} />
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// Map Section Component with Route
const MapSection = ({ userLocation, deliveryLocation, currentStep }) => {
  const routeCoordinates = [
    deliveryLocation,
    { latitude: 10.0280, longitude: 76.3140 },
    { latitude: 10.0270, longitude: 76.3135 },
    userLocation,
  ];

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (userLocation.latitude + deliveryLocation.latitude) / 2,
          longitude: (userLocation.longitude + deliveryLocation.longitude) / 2,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={userLocation}
          title="Your Location"
          description="KACHAPPILLY HOME"
        >
          <View style={styles.homeMarker}>
            <Text style={styles.homeMarkerText}>🏠</Text>
          </View>
        </Marker>
        
        <Marker
          coordinate={deliveryLocation}
          title="Delivery Partner"
        >
          <View style={styles.deliveryMarker}>
            <Text style={styles.deliveryMarkerText}>🚗</Text>
          </View>
        </Marker>

        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#007AFF"
          strokeWidth={4}
          lineDashPattern={[5, 5]}
        />
      </MapView>
    </View>
  );
};

// Order Progress Steps Component
const OrderProgress = ({ currentStep }) => {
  const progressSteps = [
    {
      title: 'Assigning Delivery Partner',
      description: 'Finding the best delivery partner',
      icon: '👤'
    },
    {
      title: 'Out for Delivery',
      description: 'Your order is on the way',
      icon: '🚗'
    },
    {
      title: 'Reached Your Doorstep',
      description: 'Try and keep what you love',
      icon: '🏠'
    },
    {
      title: 'Payment',
      description: 'Complete payment for selected items',
      icon: '💳'
    },
    {
      title: 'Return Process',
      description: 'Return unwanted items',
      icon: '📦'
    }
  ];

  return (
    <View style={styles.progressContainer}>
      {progressSteps.map((step, index) => (
        <View key={index} style={styles.progressStep}>
          <View style={styles.stepIndicatorContainer}>
            <View style={[
              styles.stepCircle,
              index < currentStep ? styles.stepCompleted : 
              index === currentStep ? styles.stepActive : styles.stepInactive
            ]}>
              <Text style={styles.stepIcon}>{step.icon}</Text>
            </View>
            {index < progressSteps.length - 1 && (
              <View style={[
                styles.stepLine,
                index < currentStep ? styles.lineCompleted : styles.lineInactive
              ]} />
            )}
          </View>
          <View style={styles.stepContent}>
            <Text style={[
              styles.stepTitle,
              index < currentStep ? styles.titleCompleted :
              index === currentStep ? styles.titleActive : styles.titleInactive
            ]}>
              {step.title}
            </Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Action Buttons Component
const ActionButtons = ({ currentStep, onPayment, onFullReturn, onPartialReturn }) => {
  return (
    <View style={styles.actionButtonsContainer}>
      {currentStep === 2 && (
        <>
          <TouchableOpacity style={styles.paymentButton} onPress={onPayment}>
            <Text style={styles.paymentButtonText}>Pay for Items</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fullReturnButton} onPress={onFullReturn}>
            <Text style={styles.fullReturnButtonText}>Initiate Full Return</Text>
          </TouchableOpacity>
        </>
      )}
      
      {currentStep === 3 && (
        <TouchableOpacity style={styles.returnButton} onPress={onPartialReturn}>
          <Text style={styles.returnButtonText}>Return Remaining Items</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Promotional Banner Component
const PromoBanner = () => {
  return (
    <View style={styles.promoBanner}>
      <View style={styles.promoContent}>
        <Text style={styles.promoTitle}>Loved ordering from us?</Text>
        <Text style={styles.promoSubtitle}>Explore the new{'\n'}Instamart App</Text>
        <TouchableOpacity style={styles.shopNowButton}>
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.promoIcons}>
        <Text style={styles.promoIcon}>🍯</Text>
        <Text style={styles.promoIcon}>🧴</Text>
        <Text style={styles.promoIcon}>🌸</Text>
      </View>
    </View>
  );
};

// Main Component
const OrderPlacedPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const userLocation = {
    latitude: 10.0261,
    longitude: 76.3127,
  };

  const deliveryLocation = {
    latitude: 10.0300,
    longitude: 76.3160,
  };

  const orderData = {
    orderId: 'ORD-2025-08231534',
    orderTime: '03:02 PM',
    itemCount: '1',
    deliveryPartner: 'AKASH P S',
    estimatedTime: '6'
  };

  // Simulate order progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => prev < 4 ? prev + 1 : prev);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = () => {
    console.log('Payment completed for selected items');
    setCurrentStep(3);
  };

  const handleFullReturn = () => {
    console.log('Full return initiated - skipping payment');
    setCurrentStep(4); // Skip payment phase
  };

  const handlePartialReturn = () => {
    console.log('Partial return initiated for remaining items');
    setCurrentStep(4);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <OrderHeader orderData={orderData} />
      
      <MapSection 
        userLocation={userLocation} 
        deliveryLocation={deliveryLocation}
        currentStep={currentStep}
      />
      
      <DeliveryStatus 
        currentStep={currentStep}
        deliveryPartner={orderData.deliveryPartner}
        estimatedTime={orderData.estimatedTime}
      />

      <View style={styles.deliveryPartnerBanner}>
        <View style={styles.partnerBannerIcon} />
        <Text style={styles.partnerBannerText}>
          Delivery partner will drive safely to deliver your order superfast!
        </Text>
        <Text style={styles.partnerBannerArrow}>→</Text>
      </View>

      <View style={styles.whileYouWaitSection}>
        <Text style={styles.whileYouWaitTitle}>WHILE YOU WAIT</Text>
        <View style={styles.whileYouWaitLine} />
      </View>

      <PromoBanner />

      <ActionButtons 
        currentStep={currentStep}
        onPayment={handlePayment}
        onFullReturn={handleFullReturn}
        onPartialReturn={handlePartialReturn}
      />
    </ScrollView>
  );
};

// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#333',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuDots: {
    fontSize: 18,
    color: '#333',
  },

  // Map Styles
  mapContainer: {
    height: height * 0.45,
    margin: 0,
  },
  map: {
    flex: 1,
  },
  homeMarker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  homeMarkerText: {
    fontSize: 16,
  },
  deliveryMarker: {
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    padding: 8,
  },
  deliveryMarkerText: {
    fontSize: 16,
  },

  // Delivery Status Styles
  deliveryStatusContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  deliveryStatusTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  deliveryStatusSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  timeEstimateContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timeEstimate: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timeLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  viewItemsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 12,
  },
  bagIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    marginRight: 12,
  },
  viewItemsText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  deliveryPartnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9500',
    marginRight: 12,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: {
    fontSize: 16,
  },

  // Delivery Partner Banner
  deliveryPartnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  partnerBannerIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#FF9500',
    borderRadius: 16,
    marginRight: 12,
  },
  partnerBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  partnerBannerArrow: {
    fontSize: 16,
    color: '#007AFF',
  },

  // While You Wait Section
  whileYouWaitSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  whileYouWaitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 1,
  },
  whileYouWaitLine: {
    width: 60,
    height: 2,
    backgroundColor: '#007AFF',
    marginTop: 8,
  },

  // Promo Banner
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: 'linear-gradient(135deg, #007AFF 0%, #FF3B30 100%)',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  shopNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  promoIcons: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  promoIcon: {
    fontSize: 24,
    marginVertical: 4,
  },

  // Progress Styles
  progressContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  progressStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  stepCompleted: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  stepActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  stepInactive: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
  },
  stepIcon: {
    fontSize: 16,
  },
  stepLine: {
    width: 2,
    height: 30,
    marginTop: 8,
  },
  lineCompleted: {
    backgroundColor: '#34C759',
  },
  lineInactive: {
    backgroundColor: '#E9ECEF',
  },
  stepContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleCompleted: {
    color: '#34C759',
  },
  titleActive: {
    color: '#007AFF',
  },
  titleInactive: {
    color: '#999',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
  },

  // Action Buttons
  actionButtonsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  paymentButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  returnButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default OrderPlacedPage;
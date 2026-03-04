import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  FlatList,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tryDoorstep from '../assets/images/shoppingbag/footer/17.png';
import inminutes from '../assets/images/shoppingbag/footer/18.png';
import tryandbuy from '../assets/images/shoppingbag/footer/19.png';
import intsantreturn from '../assets/images/shoppingbag/footer/20.png';


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const steps = [
  {
    icon: 'pricetag-outline',
    title: 'Try at your doorstep',
    desc: 'Order multiple styles/sizes with no upfront commitment.',
    iconImage: tryDoorstep,
  },
  {
    icon: 'rocket-outline',
    title: 'Get item in minitues',
    desc: 'Get your selection delivered in minutes',
    iconImage: inminutes,
  },
  {
    icon: 'card-outline',
    title: 'Try First, Pay Later',
    desc: 'Our Delivery executive wait for your trying, Only pay for what you keep—discounts auto-applied.',
    iconImage: tryandbuy,
  },
  {
    icon: 'refresh-circle-outline',
    title: 'Instant Returns',
    desc: 'Return what you don’t want instantly, no questions asked.',
    iconImage: intsantreturn,
  },
];

const Footer = () => {
  const COLLAPSED_HEIGHT = 70
  const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.35

  const animatedHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const [isExpanded, setIsExpanded] = useState(false);

  // Paging logic
  const [activeStep, setActiveStep] = useState(0);
  const scrollRef = useRef();

  const expandFooter = () => {
    Animated.timing(animatedHeight, {
      toValue: EXPANDED_HEIGHT,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setIsExpanded(true);
  };
  const collapseFooter = () => {
    Animated.timing(animatedHeight, {
      toValue: COLLAPSED_HEIGHT,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setIsExpanded(false));
  };

  const onScrollStep = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveStep(index);
  };

  return (
    <>
      <View style={styles.absoluteFooter}>

        <Animated.View style={[styles.footer, { height: animatedHeight }]}>
          <View style={{ flex: 1 }}>
            {isExpanded && (
              <View style={{ flex: 1 }}>
                <View style={styles.modalTitleRow}>
                  <Text numberOfLines={1} style={styles.modalTitle}>
                    How FlashFits Works?
                  </Text>
                  <Pressable style={styles.arrowIcon} onPress={collapseFooter} hitSlop={10}>
                    <Ionicons name="arrow-down" size={20} color="#000" />
                  </Pressable>
                </View>
                {/* Paging Steps */}
                <FlatList
                  ref={scrollRef}
                  data={steps}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  onScroll={onScrollStep}
                  scrollEventThrottle={16}
                  keyExtractor={(_, idx) => idx.toString()}
                  contentContainerStyle={styles.stepsContainer}
                  renderItem={({ item }) => (
                    <View style={styles.step}>
                      {/* Optional small icon */}
                      <Ionicons
                        name={item.icon}
                        size={26}
                        color="#111"
                        style={styles.icon}
                      />

                      <View style={styles.textWrap}>
                        <Text style={styles.stepTitle}>{item.title}</Text>
                        <Text style={styles.stepDesc}>{item.desc}</Text>

                        {/* 🔥 Image under text */}
                        <View style={styles.imageWrapper}>
                          <Image
                            source={item.iconImage}
                            style={styles.stepImage}
                            resizeMode="contain"
                          />
                        </View>

                      </View>
                    </View>
                  )}

                />

                {/* Paging Dots */}
                <View style={styles.dotsContainer}>
                  {steps.map((s, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        activeStep === idx && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Expand/Collapse Button */}
          <Pressable
            onPress={e => {
              e.stopPropagation();
              isExpanded ? collapseFooter() : expandFooter();
            }}
            style={styles.upArrowButton}
          >
            <View style={styles.textContainer}>
              <Text style={styles.logo}>FlashFits -</Text>
              <Text style={styles.motto}>Fashion in a Flash ?</Text>
            </View>
            <Ionicons
              name={isExpanded ? 'arrow-down' : 'arrow-up'}
              size={22}
              color="#000"
            />
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  absoluteFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footer: {
    backgroundColor: '#ffffffff',
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOffset: { height: -6 },
    shadowOpacity: 0.10,
    elevation: 6,
    overflow: 'hidden',
    zIndex: 30,
    // Border color and width for top, left, and right
    borderTopColor: '#d3d3d3',   // light grey
    borderLeftColor: '#d3d3d3',
    borderRightColor: '#d3d3d3',
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    paddingBottom: 20,
    height: 200
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 30,
    // marginRight:10
  },

  stepImage: {
    width: SCREEN_WIDTH * 0.6, // 👈 image width control
    height: 120,
    marginRight:40
  },

  textWrap: {
    flex: 1,
    paddingRight: 10,
  },

  step: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  upArrowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#ffffffff',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    fontStyle: 'italic',
    marginRight: 7,
    opacity: 0.82,
  },
  motto: {
    fontSize: 13,
    color: '#222',
    fontStyle: 'italic',
    opacity: 0.75,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    padding: 8,
    paddingBottom: 0,
    minHeight: 40,
  },
  arrowIcon: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    textAlign: 'left',
    flex: 1,
    paddingLeft: 10,
    margin: 3
  },
  stepsContainer: {
    minHeight: 62,
    paddingHorizontal: 0,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: SCREEN_WIDTH,
    paddingHorizontal: 14,
    paddingBottom: 0,
    paddingTop: 10,
    minHeight: 56,
    maxHeight: 68,
  },
  icon: { marginRight: 10, marginTop: 2 },
  textWrap: { flex: 1 },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 3,
    textShadowColor: '#ffffffff',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0.5,
  },
  stepDesc: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
    marginBottom: 0,
    lineHeight: 17,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 4,
    marginBottom: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#dadada',
    marginHorizontal: 2.5,
    opacity: 0.52,
  },
  dotActive: {
    backgroundColor: '#222',
    opacity: 1,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 1,
    borderColor: '#fafafa'
  },
});


export default Footer;

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, ChevronRight } from "lucide-react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.82;
const CARD_HEIGHT = 400;

const brands = [
  {
    id: 1,
    name: "PUMA",
    tagline: "Forever Faster",
    colors: ["#18181b", "#3f3f46"],
    shoe: "https://i.imgur.com/sgAq7ZC.png",
  },
  {
    id: 2,
    name: "गलीLABS",
    tagline: "Street Culture",
    colors: ["#f97316", "#ec4899"],
    shoe: "https://i.imgur.com/QYV1M1K.png",
  },
  {
    id: 3,
    name: "LOTTO",
    tagline: "Sport Design",
    colors: ["#dc2626", "#ef4444"],
    shoe: "https://i.imgur.com/Z6dlpZf.png",
  },
  {
    id: 4,
    name: "NIKE",
    tagline: "Just Do It",
    colors: ["#0f172a", "#475569"],
    shoe: "https://i.imgur.com/FLQ4l8s.png",
  },
];

const BrandCard = ({ brand }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={brand.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cornerAccent} />

          <View style={styles.cardHeader}>
            <View style={styles.brandInfo}>
              <Text style={styles.brandName}>{brand.name}</Text>
              <Text style={styles.brandTagline}>{brand.tagline}</Text>
            </View>
            <TouchableOpacity style={styles.arrowButton}>
              <ChevronRight color="#fff" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.shoeContainer}>
            <Image source={{ uri: brand.shoe }} style={styles.shoeImage} />
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.exploreText}>Explore Collection</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const FootwearSection = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f8fafc", "#ffffff", "#eff6ff"]}
        style={styles.gradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={["#dbeafe", "#e9d5ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Sparkles color="#2563eb" size={16} />
              <Text style={styles.badgeText}>STEP UP YOUR GAME</Text>
            </LinearGradient>

            <Text style={styles.title}>Footwear</Text>

            <Text style={styles.subtitle}>
              Discover premium collections from world-leading brands
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
          >
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8}>
            <LinearGradient
              colors={["#0f172a", "#475569"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.viewAllGradient}
            >
              <Text style={styles.viewAllText}>View All Collections</Text>
              <ChevronRight color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  gradient: { flex: 1 },
  scrollContent: { paddingVertical: 40, paddingBottom: 60 },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    letterSpacing: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 22,
  },
  cardsContainer: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 20,
  },
  card: {
    flex: 1,
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
      },
      android: { elevation: 8 },
    }),
  },
  cornerAccent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderBottomLeftRadius: 100,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandInfo: { flex: 1 },
  brandName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  shoeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  shoeImage: {
    width: CARD_WIDTH * 0.9,
    height: 200,
    resizeMode: "contain",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exploreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  newBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  viewAllButton: {
    marginTop: 40,
    marginHorizontal: 20,
    borderRadius: 28,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  viewAllGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  viewAllText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});

export default FootwearSection;

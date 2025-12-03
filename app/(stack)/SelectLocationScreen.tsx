import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

const screen = Dimensions.get("window");

export default function SelectLocationScreen() {
    const router = useRouter();
    const webviewRef = useRef(null);

    const [centerCoords, setCenterCoords] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [address, setAddress] = useState("Fetching address...");
    const [searchQuery, setSearchQuery] = useState("");

    // Load user's current location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            let loc = await Location.getCurrentPositionAsync({});
            const lat = loc.coords.latitude;
            const lng = loc.coords.longitude;

            setCenterCoords({ latitude: lat, longitude: lng });
            reverseGeocode(lat, lng);

            // move map to current location
            sendToWebview(`moveTo(${lat}, ${lng})`);
        })();
    }, []);

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
            const resp = await fetch(url);
            const json = await resp.json();

            setAddress(json.display_name || "Unknown location");
        } catch (e) {
            setAddress("Unable to fetch address");
        }
    };

    const sendToWebview = (js: string) => {
        webviewRef.current?.injectJavaScript(js + "; true;");
    };

    // When map center updates (from WebView)
    const onMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "centerChanged") {
            const { lat, lng } = data;
            setCenterCoords({ latitude: lat, longitude: lng });
            reverseGeocode(lat, lng);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`;
        const resp = await fetch(url);
        const results = await resp.json();

        if (results[0]) {
            const lat = parseFloat(results[0].lat);
            const lng = parseFloat(results[0].lon);

            sendToWebview(`moveTo(${lat}, ${lng})`);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search location"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
            </View>

            {/* WebView Map */}
            <WebView
                ref={webviewRef}
                onMessage={onMessage}
                source={{ html: mapHTML(centerCoords.latitude, centerCoords.longitude) }}
                style={{ flex: 1 }}
            />

            {/* Fixed Marker */}
            <View style={styles.markerFixed}>
                <View style={styles.marker} />
            </View>

            {/* Go to current location */}
            <TouchableOpacity style={styles.currentLocationBtn} onPress={() => {
                sendToWebview(`moveTo(${centerCoords.latitude}, ${centerCoords.longitude})`);
            }}>
                <Text style={{ color: "#0a7" }}>📍 Go to current location</Text>
            </TouchableOpacity>

            {/* Bottom Address Panel */}
            <View style={styles.addressContainer}>
                <Text style={styles.addressTitle}>Selected Location</Text>
                <Text style={styles.address}>{address}</Text>

                <TouchableOpacity
                    style={styles.setLocationBtn}
                    onPress={() => {
                        if (!centerCoords.latitude || !centerCoords.longitude) {
                            alert("Location not ready yet");
                            return;
                        }

                        router.push({
                            pathname: "/(stack)/AddAddressScreen",
                            params: {
                                lat: centerCoords.latitude,
                                lng: centerCoords.longitude,
                            },
                        });
                    }}
                >
                    <Text style={styles.setLocationText}>Set Location</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ---------- WebView HTML ----------
const mapHTML = (lat: number, lng: number) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link 
      rel="stylesheet" 
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const map = L.map('map').setView([${lat}, ${lng}], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      map.on("moveend", () => {
        const c = map.getCenter();
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "centerChanged",
          lat: c.lat,
          lng: c.lng
        }));
      });

      function moveTo(lat, lng) {
        map.setView([lat, lng], 17);
      }
    </script>
  </body>
</html>
`;

const styles = StyleSheet.create({
    searchBar: {
        position: "absolute",
        top: 40,
        width: "90%",
        alignSelf: "center",
        zIndex: 20,
    },
    searchInput: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    markerFixed: {
        position: "absolute",
        top: screen.height / 2 - 40,
        left: screen.width / 2 - 20,
        zIndex: 10,
    },
    marker: {
        width: 40,
        height: 40,
        backgroundColor: "#0a0",
        borderRadius: 20,
        borderWidth: 3,
        borderColor: "#fff",
    },
    currentLocationBtn: {
        position: "absolute",
        bottom: 200,
        alignSelf: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 6,
    },
    addressContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    address: {
        marginTop: 6,
        color: "#444",
    },
    setLocationBtn: {
        backgroundColor: "#0a7",
        padding: 14,
        borderRadius: 10,
        marginTop: 15,
        alignItems: "center",
    },
    setLocationText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});

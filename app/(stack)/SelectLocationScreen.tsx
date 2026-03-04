import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { Ionicons } from '@expo/vector-icons';


const screen = Dimensions.get("window");

export default function SelectLocationScreen() {
    const router = useRouter();
    const webviewRef = useRef(null);

    const [centerCoords, setCenterCoords] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [mapReady, setMapReady] = useState(false);
    const [address, setAddress] = useState("Fetching Address...");
    const [ParamAddress, setParamAddress] = useState("Fetching Address...");
    const [searchQuery, setSearchQuery] = useState("");
    const [locating, setLocating] = useState(false);


    // Load user's current location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});
            const lat = loc.coords.latitude;
            const lng = loc.coords.longitude;

            setCenterCoords({ latitude: lat, longitude: lng });
            reverseGeocode(lat, lng);
            setMapReady(true);
        })();
    }, []);

    const requestAndFetchLocation = async () => {
        if (locating) return;

        try {
            setLocating(true);

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Location permission is required');
                setLocating(false);
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const lat = loc.coords.latitude;
            const lng = loc.coords.longitude;

            setCenterCoords({ latitude: lat, longitude: lng });
            reverseGeocode(lat, lng);
            sendToWebview(`moveTo(${lat}, ${lng})`);
        } catch (err) {
            alert('Unable to fetch current location');
        } finally {
            setLocating(false);
        }
    };

    useEffect(() => {
        requestAndFetchLocation();
    }, []);


    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const resp = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                // 'https://nominatim.openstreetmap.org/reverse?format=json&lat=9.931233&lon=76.267303',
                {
                    headers: {
                        "User-Agent": "FlashFitsApp/1.0 (contact@flashfits.com)",
                    },
                }
            );
            const json = await resp.json();
            console.log(json.display_name, 'json');

            setAddress(json.display_name || "Unknown location");
            setParamAddress(json.address || "Unknown location");
        } catch {
            setAddress("Unable to fetch address");
        }
    };

    console.log(ParamAddress, 'address');

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

        const resp = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`,
            {
                headers: {
                    "User-Agent": "FlashFitsApp/1.0 (contact@flashfits.com)",
                },
            }
        );

        const results = await resp.json();

        if (results.length > 0) {
            const lat = parseFloat(results[0].lat);
            const lng = parseFloat(results[0].lon);

            sendToWebview(`moveTo(${lat}, ${lng})`);
            reverseGeocode(lat, lng);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.topHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>

                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Delivery location"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                </View>
            </View>

            {/* WebView Map */}
            {mapReady && (
                <WebView
                    ref={webviewRef}
                    onMessage={onMessage}
                    source={{ html: mapHTML(centerCoords.latitude, centerCoords.longitude) }}
                    style={{ flex: 1 }}
                />
            )}

            {/* Fixed Marker */}
            <View style={styles.markerFixed}>
                <View style={styles.marker} />
            </View>

            {/* Go to current location */}
            <TouchableOpacity
                style={[styles.currentLocationBtn, locating && { opacity: 0.6 }]}
                onPress={requestAndFetchLocation}
                disabled={locating}
            >
                {locating ? (
                    <ActivityIndicator size="small" color="#0a7" />
                ) : (
                    <Text style={{ color: '#0a7' }}>📍 Go to current location</Text>
                )}
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
                                address: JSON.stringify(ParamAddress)
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
      /* extra safety */
      .leaflet-control-zoom {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const map = L.map('map', { zoomControl: false })
        .setView([${lat}, ${lng}], 17);

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
        flex: 1,          // 👈 takes remaining width
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 18,
        fontSize: 16,
    },
    topHeader: {
        position: 'absolute',
        top: 60,
        left: 12,
        right: 12,
        zIndex: 20,
        flexDirection: 'row',
        alignItems: 'center',
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
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    backText: {
        fontSize: 20,
        fontWeight: '600',
    },

    addressContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        padding: 25,
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
        backgroundColor: "rgba(0, 0, 0, 1)",
        padding: 20,
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

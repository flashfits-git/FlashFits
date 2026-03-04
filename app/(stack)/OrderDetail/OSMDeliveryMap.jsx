import { useEffect, useRef } from "react";
import { WebView } from "react-native-webview";

export default function OSMDeliveryMap({ userLocation, riderLocation }) {
  const webviewRef = useRef(null);  

  // 🔄 Update rider marker in map
  useEffect(() => {
    if (webviewRef.current && riderLocation) {
      webviewRef.current.postMessage(
        JSON.stringify({
          type: "UPDATE_RIDER",
          lat: riderLocation.latitude,
          lng: riderLocation.longitude,
        })
      );
    }
  }, [riderLocation]);

  return (
    <WebView
      ref={webviewRef}
      style={{ flex: 1 }}
      originWhitelist={["*"]}
      javaScriptEnabled
      source={{ html: generateOSMHTML(userLocation, riderLocation) }}
    />
  );
}

const generateOSMHTML = (user, rider) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  
  <!-- Include the official Leaflet.curve plugin -->
  <script src="https://cdn.jsdelivr.net/npm/leaflet.curve@0.9.0/leaflet.curve.js"></script>

  <style>
    html, body { height: 100%; margin: 0; padding: 0; }
    #map { width: 100%; height: 100%; }
    .leaflet-control-zoom { display: none !important; }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    // Initialize Map
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    });

    // OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // User (Pickup) marker - blue circle
    var userMarker = L.circleMarker([${user.latitude}, ${user.longitude}], {
      radius: 10,
      color: "#2563eb",
      weight: 3,
      fillColor: "#3b82f6",
      fillOpacity: 1
    }).addTo(map);

    // Rider icon
    var riderIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    var riderMarker = L.marker([${rider.latitude}, ${rider.longitude}], {
      icon: riderIcon
    }).addTo(map);

    // Fit bounds to show both points
    var bounds = L.latLngBounds([
      [${user.latitude}, ${user.longitude}],
      [${rider.latitude}, ${rider.longitude}]
    ]);
    map.fitBounds(bounds, { padding: [80, 80] });

    // Curved arc layer
    var curvedPath = L.curve([
      'M', [${user.latitude}, ${user.longitude}],
      'C', 
        [(${user.latitude} + ${rider.latitude}) / 2 + 0.005, (${user.longitude} + ${rider.longitude}) / 2 - 0.02],
        [(${user.latitude} + ${rider.latitude}) / 2 - 0.005, (${user.longitude} + ${rider.longitude}) / 2 + 0.02],
      'S', [${rider.latitude}, ${rider.longitude}]
    ], {
      color: '#1e90ff',
      weight: 5,
      opacity: 0.9,
      fill: false
    }).addTo(map);

    // Function to update the curved path when rider moves
    function updateCurvedPath(newRiderLat, newRiderLng) {
      if (curvedPath) map.removeLayer(curvedPath);

      curvedPath = L.curve([
        'M', [${user.latitude}, ${user.longitude}],
        'C', 
          [(${user.latitude} + newRiderLat) / 2 + 0.005, (${user.longitude} + newRiderLng) / 2 - 0.02],
          [(${user.latitude} + newRiderLat) / 2 - 0.005, (${user.longitude} + newRiderLng) / 2 + 0.02],
        'S', [newRiderLat, newRiderLng]
      ], {
        color: '#1e90ff',
        weight: 5,
        opacity: 0.9
      }).addTo(map);
    }

    // Smooth move rider marker and update arc
    function smoothMove(marker, newLat, newLng) {
      const duration = 1000;
      const steps = 60;
      const interval = duration / steps;

      const start = marker.getLatLng();
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        const lat = start.lat + (newLat - start.lat) * progress;
        const lng = start.lng + (newLng - start.lng) * progress;

        marker.setLatLng([lat, lng]);
        updateCurvedPath(lat, lng);

        if (step >= steps) {
          clearInterval(timer);
          updateCurvedPath(newLat, newLng); // final update
        }
      }, interval);
    }

    // Listen for messages from React Native
    window.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_RIDER') {
          smoothMove(riderMarker, data.lat, data.lng);
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    });

    // Also support React Native WebView injectedJavaScript
    document.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_RIDER') {
          smoothMove(riderMarker, data.lat, data.lng);
        }
      } catch (e) {}
    });
  </script>
</body>
</html>
`;

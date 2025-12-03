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

<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<style>
  html, body { height: 100%; margin: 0; }
  #map { width: 100%; height: 100%; }
  .leaflet-control-zoom { display: none !important; }
  .arc-line { stroke: #1e90ff; stroke-width: 4; fill: none; opacity: 0.8; }
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

    // User marker
    var userMarker = L.circleMarker([${user.latitude}, ${user.longitude}], {
      radius: 10,
      color: "#2563eb",
      fillColor: "#3b82f6",
      fillOpacity: 1
    }).addTo(map);

    // Rider icon
    var riderIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    var riderMarker = L.marker(
      [${rider.latitude}, ${rider.longitude}],
      { icon: riderIcon }
    ).addTo(map);

    // Fit map to both points
    var bounds = L.latLngBounds([
      [${user.latitude}, ${user.longitude}],
      [${rider.latitude}, ${rider.longitude}]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // ---------- ARC BETWEEN USER AND RIDER ----------
    var arcLine;

    function drawArc(startLat, startLng, endLat, endLng) {
      if (arcLine) map.removeLayer(arcLine);

      // Calculate control point (midpoint with altitude)
      var latMid = (startLat + endLat) / 2;
      var lngMid = (startLng + endLng) / 2 + 0.01; // curve amount

      var curvePoints = [
        [startLat, startLng],
        [latMid, lngMid],
        [endLat, endLng]
      ];

      arcLine = L.curve([
        "M",[startLat, startLng],
        "Q",[latMid, lngMid],[endLat, endLng]
      ], {
        color: "#1e90ff",
        weight: 4,
        opacity: 0.9
      }).addTo(map);
    }

    // Leaflet.curve plugin inline
    L.Curve = L.Path.extend({
      options: {},
      initialize: function(path, options) {
        L.setOptions(this, options);
        this._setPath(path);
      },
      _setPath: function(path) {
        this._pathData = path;
      },
      getPath: function() { return this._pathData; },
      _update: function() {
        if (!this._path) return;
        this._path.setAttribute("d", this._convertPath());
      },
      _convertPath: function() {
        var data = this._pathData;
        var str = "";
        for (var i = 0; i < data.length; i++) {
          var p = data[i];
          if (typeof p === "string") {
            str += p;
          } else {
            var latlng = L.latLng(p);
            var point = this._map.latLngToSvgPoint(latlng);
            str += point.x + " " + point.y + " ";
          }
        }
        return str;
      },
      _project: function() { this._update(); }
    });

    L.curve = function(path, options) {
      return new L.Curve(path, options);
    };

    // Draw initial arc
    drawArc(
      ${user.latitude}, ${user.longitude},
      ${rider.latitude}, ${rider.longitude}
    );

    // ---------- Smooth Move Rider + Update Arc ----------
    function smoothMove(marker, newLat, newLng) {
      var duration = 1000;
      var frames = 60;
      var interval = duration / frames;

      var pos = marker.getLatLng();
      var dLat = (newLat - pos.lat) / frames;
      var dLng = (newLng - pos.lng) / frames;
      var frame = 0;

      var timer = setInterval(() => {
        frame++;
        var lat = pos.lat + dLat * frame;
        var lng = pos.lng + dLng * frame;

        marker.setLatLng([lat, lng]);

        // update arc
        drawArc(
          ${user.latitude}, ${user.longitude},
          lat, lng
        );

        if (frame >= frames) clearInterval(timer);
      }, interval);
    }

    // Receive live updates from React Native
    document.addEventListener("message", (event) => {
      try {
        var data = JSON.parse(event.data);

        if (data.type === "UPDATE_RIDER") {
          smoothMove(riderMarker, data.lat, data.lng);
        }
      } catch (e) {}
    });

  </script>
</body>
</html>
`;

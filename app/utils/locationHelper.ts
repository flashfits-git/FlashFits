// Haversine Distance Calculator
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // earth radius (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Estimated Time Calculation (minutes)
// Logic: 15 mins (rider to pickup) + 20 mins base + (distance * 4 mins)
export function calculateEstimatedTime(distanceKm: number) {
  const roundedDistance = Number(distanceKm.toFixed(2));
  const riderToPickupTime = 15;
  const pickupToDeliveryTime = Math.ceil(20 + (roundedDistance * 4));
  const totalEstimatedTime = riderToPickupTime + pickupToDeliveryTime;
  
  // Return a range string (e.g., "35-40 mins")
  const minTime = Math.max(15, totalEstimatedTime - 5);
  const maxTime = totalEstimatedTime + 5;
  
  return `${minTime}-${maxTime} mins`;
}

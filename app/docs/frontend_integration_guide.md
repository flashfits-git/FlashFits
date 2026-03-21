# Frontend Integration Guide - Order Price Summary

I have enhanced the backend to support a detailed order price summary. Here’s what your frontend developer needs to know to integrate these changes.

## 1. Initial Order Creation
**Endpoint:** `POST /order/create`

### Request Body Changes
You can now optionally pass a `deliveryTip` (Number).
```json
{
  "addressId": "...",
  "deliveryTip": 20 
}
```

### Response Changes
The response now includes a detailed breakdown of the upfront costs:
- `totalDeliveryFee`: The total amount the user pays **now** (delivery + return + tip + service GST).
- `deliveryCharge`: The base delivery fee.
- `returnCharge`: The base return trip fee (if applicable).
- `deliveryTip`: The tip amount you sent.
- `serviceGST`: 18% GST calculated on `deliveryCharge + deliveryTip`.

## 2. Order Summary Model (`finalBilling`)
The `finalBilling` object in the Order response now contains:
- `baseAmount`: Total price of all items in the cart (not charged yet).
- `deliveryCharge`: Base delivery fee.
- `deliveryTip`: Tip for the rider.
- `gst`: GST on items (calculated during the final trial phase).
- `serviceGST`: GST on the delivery & tip (paid upfront).
- `totalPayable`: Current amount due (this value updates depending on the order stage).

## 3. Payment Logic
- **Upfront Payment**: The Razorpay `amount` for the first step is [(deliveryCharge + returnCharge + deliveryTip + serviceGST) * 100]
- **Final Payment**: After the "Try & Buy" phase, the second Razorpay order will be for the `Items Kept + Item GST + Overtime Penalty - Return Charge Deduction`.

## Summary UI Mapping
Based on your design, here is how to map the fields:
- **Item Total**: `finalBilling.baseAmount`
- **Delivery Fee**: `finalBilling.deliveryCharge`
- **Delivery Tip**: `finalBilling.deliveryTip`
- **GST & Other Charges**: `finalBilling.serviceGST` (plus any item GST if in the final phase)
- **To Pay**: `finalBilling.totalPayable`

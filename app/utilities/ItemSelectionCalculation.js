// utils/calculateFinalBilling.js
export function calculateFinalBilling({
  orderItems,
  returnCharge = 0,
}) {

  // console.log(orderItems,'86867777777777777777777777777');


  // === STEP 1: Accepted (kept or non-triable) items ===
  const acceptedItems = orderItems.filter(
    item => item.tryStatus === "keep"
  );

  // Base amount calculation
  let baseAmount = 0;
  for (const item of acceptedItems) {
    baseAmount += item.price * item.quantity;
  }

  // === STEP 2: Overtime Penalty (REMOVED) ===
  const overtimePenalty = 0; // Always 0 now

  // === STEP 3: Return logic ===
  const returnedItemsCount = orderItems.filter(i => i.tryStatus === "returned").length;
  const allItemsKept = returnedItemsCount === 0;

  // Deduction only if all items are kept
  const returnChargeDeduction = allItemsKept ? returnCharge : 0;

  // === STEP 4: GST (set to 0 for now) ===
  const gst = 0;

  // === STEP 5: Final total ===
  const totalBeforeDeduction = baseAmount + gst + overtimePenalty;

  // prevent negative billing
  const totalPayable = Math.max(
    0,
    totalBeforeDeduction - returnChargeDeduction
  );

  return {
    baseAmount,
    gst,
    overtimePenalty,
    returnCharge,
    returnChargeDeduction,
    totalPayable,
    itemsAccepted: acceptedItems.length,
    itemsReturned: returnedItemsCount,
    allItemsKept,
  };
}

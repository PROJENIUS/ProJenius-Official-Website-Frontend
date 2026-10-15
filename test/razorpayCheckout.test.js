import test from "node:test";
import assert from "node:assert/strict";
import { loadRazorpayCheckout, validateCheckoutOrder } from "../src/Components/Courses/ExploreOurCourses/razorpayCheckout.js";

const validOrder = {
  keyId: "rzp_test_synthetic123",
  order: { id: "order_synthetic123", amount: 12500, currency: "INR" },
  enrollment: { reference: "PJ-CRS-SYNTHETIC" },
};

test("validates the public Checkout key and genuine provider order response shape", () => {
  assert.equal(validateCheckoutOrder(validOrder), validOrder);
  for (const patch of [
    { keyId: "secret-value" },
    { order: { ...validOrder.order, id: "" } },
    { order: { ...validOrder.order, amount: 0 } },
    { order: { ...validOrder.order, amount: 1.25 } },
    { order: { ...validOrder.order, currency: "USD" } },
    { enrollment: null },
  ]) {
    assert.throws(() => validateCheckoutOrder({ ...validOrder, ...patch }), /No payment has been taken/);
  }
});

test("allows a failed Checkout script load to be retried safely", async () => {
  const firstWindow = {};
  const firstDocument = {
    body: { appendChild(script) { script.onerror(); } },
    createElement() { return {}; },
  };
  await assert.rejects(loadRazorpayCheckout({ documentRef: firstDocument, windowRef: firstWindow }), /No payment has been taken/);

  function RazorpayMock() {}
  const secondWindow = {};
  const secondDocument = {
    body: { appendChild(script) { secondWindow.Razorpay = RazorpayMock; script.onload(); } },
    createElement() { return {}; },
  };
  assert.equal(await loadRazorpayCheckout({ documentRef: secondDocument, windowRef: secondWindow }), RazorpayMock);
  assert.equal(await loadRazorpayCheckout({ documentRef: secondDocument, windowRef: secondWindow }), RazorpayMock);
});

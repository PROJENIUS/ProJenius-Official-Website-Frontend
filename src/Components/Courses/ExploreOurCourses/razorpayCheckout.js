const CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
let checkoutScriptPromise;

export function validateCheckoutOrder(data) {
  if (
    !data ||
    typeof data.keyId !== "string" ||
    !/^rzp_(?:test|live)_[A-Za-z0-9]+$/.test(data.keyId) ||
    typeof data.order?.id !== "string" ||
    !data.order.id.trim() ||
    !Number.isSafeInteger(data.order.amount) ||
    data.order.amount <= 0 ||
    data.order.currency !== "INR" ||
    typeof data.enrollment?.reference !== "string" ||
    !data.enrollment.reference.trim()
  ) {
    throw new Error("Online payments are temporarily unavailable. No payment has been taken. Please try again later.");
  }
  return data;
}

export function loadRazorpayCheckout({ documentRef = document, windowRef = window } = {}) {
  if (typeof windowRef.Razorpay === "function") return Promise.resolve(windowRef.Razorpay);
  if (checkoutScriptPromise) return checkoutScriptPromise;

  checkoutScriptPromise = new Promise((resolve, reject) => {
    const script = documentRef.createElement("script");
    script.src = CHECKOUT_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      if (typeof windowRef.Razorpay === "function") resolve(windowRef.Razorpay);
      else reject(new Error("Checkout constructor unavailable"));
    };
    script.onerror = () => reject(new Error("Checkout script unavailable"));
    documentRef.body.appendChild(script);
  }).catch(() => {
    checkoutScriptPromise = undefined;
    throw new Error("Online payments are temporarily unavailable. No payment has been taken. Please try again later.");
  });

  return checkoutScriptPromise;
}

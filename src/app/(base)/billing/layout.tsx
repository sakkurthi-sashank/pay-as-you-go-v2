import Script from "next/script";

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      {children}
    </>
  );
}

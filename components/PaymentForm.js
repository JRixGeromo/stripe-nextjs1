import {
  CardElement,
  PaymentElement,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

function PaymentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const createSubscription = async () => {
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        card: elements.getElement("card"),
        type: "card",
      });

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          paymentMethod: paymentMethod.paymentMethod.id,
        }),
      });
      if (!response.ok) return alert("Payment unsuccessful!");
      const data = await response.json();
      console.log("data");
      console.log(data);
      /*
      const confirm = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement("card"),
          // billing_details: {
          //   name: 'Jose Rico Geromo',
          // },
        },
      });
      */
      const confirm = await stripe.retrievePaymentIntent(data.clientSecret);
     

      if (confirm.error) return alert("Payment unsuccessful!");
      console.log("confirm");
      console.log(confirm);
      alert("Payment Successful! Subscription active.");

    } catch (err) {
      console.error(err);
      alert("Payment failed! " + err.message);
    }
  };

  return (
    <div style={{ width: "40%" }}>
      Name:{" "}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      Email:{" "}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <CardElement />
      <br />
      <button onClick={createSubscription}>Subscribe - 5 INR</button>
    </div>
  );
}

export default PaymentForm;

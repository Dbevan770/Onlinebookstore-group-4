import getStripe from "../../lib/getStripe";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import CheckoutItem from "../../components/CheckoutItem/CheckoutItem";
import "./Checkout.css";

export default function Checkout() {
    const { cart } = useAuth();
    const { removeCartItem, updateCartItemQuantity, totalCost } = useCart();
    const shippingTax = '35.00';
    console.log(cart);
    
    async function handleCheckout() {
        const modifiedCart = cart.map(item => (
          { 
            price: item.price, 
            quantity: item.quantity 
          }));
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
          lineItems: [...modifiedCart, { price: 'price_1MmwUYBFILIPC5HyqNB5T9yL', quantity: 1 }],
          mode: 'payment',
          successUrl: `http://localhost:3000/success`,
          cancelUrl: `http://localhost:3000/cancel`,
          customerEmail: 'adam.ardito@yahoo.com',
        });
        console.warn(error.message);
    }


    return (
      <div id="w">
        <header id="title">
          <h1>Mystery Inc. Bookstore Cart</h1>
        </header>
        <div id="page">
          {cart && cart.length > 0
            ? (
              <table id="cart">
                <thead>
                  <tr>
                    <th className="first">Photo</th>
                    <th className="second">Qty</th>
                    <th className="third">Product</th>
                    <th className="fourth">Price</th>
                    <th className="fifth">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {cart && cart.length > 0 ? cart.map((item) => <CheckoutItem key={item.id} cart={item} removeItem={removeCartItem} updateQuantity={updateCartItemQuantity} />) : <p>Nothing here...</p>}
                  <tr className="extracosts">
                    <td className="light">Shipping &amp; Tax</td>
                    <td colSpan="2" className="light"></td>
                    <td>${shippingTax}</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="totalprice">
                    <td className="light">Total:</td>
                    <td colSpan="2">&nbsp;</td>
                    <td colSpan="2"><span className="thick">${ (Math.round((totalCost + Number(shippingTax)) * 100 ) / 100 ).toFixed(2) }</span></td>
                  </tr>
                  
                  <tr className="checkoutrow">
                    <td colSpan="5" className="checkout"><button onClick={handleCheckout} id="submitbtn">Checkout Now!</button></td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>Your cart is empty! Buy Stuff!</p>
            )}
          
        </div>
      </div>
    )
};
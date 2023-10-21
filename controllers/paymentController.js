const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const stripe = require("stripe")(
  "sk_test_51NylCfAvHhN0ACk6h17y9bbozff7vjyySkkNgJ1hIVOrqTZ08icPXdJaqeDcYvnehAxm7OStZzA9qHnNxwHj7rQ3004JNymCE4"
);

module.exports = {
  async tokenCard(req, res, next) {
    try {
      const { cardNumber, expMonth, expYear, cvc } = req.body;

      const token = await stripe.tokens.create({
        card: {
          number: "4242424242424242",
          exp_month: 12,
          exp_year: 25,
          cvc: "123",
        },
      });

      // Retorna el token creado en la respuesta
      res.json({ token: token.id });

      console.log(token);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo crear el token de tarjeta" });
    }
  },

  async payment(req, res, next) {
    try {
      const { payment_method_types, amount, currency , orderID ,
      fullName, phone , email, address } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method_types: payment_method_types,
        //  payment_method_data: payment_method_data,
        // "type" : "card",
        // "card" : {
        //   "number" : "4242424242424242",
        //   "exp_month" : 12,
        //   "exp_year" : 25,
        //   "cvc" : "123" 
        // },
        metadata: {
          orderId: orderID,
          fullName: fullName,
          address : address,
          phone: phone,
          email: email,
        },
      });

      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ clientSecret: paymentIntent.client_secret });
      console.log("Pago realizado con exito", paymentIntent);

      console.log(paymentIntent);
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: "No se pudo procesar el pago" });
    }
  },
};

const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const db = admin.firestore();

module.exports = {
  async allPromotions(req, res, next) {
    try {
      const mainPromotionCollection = db.collection("Promotions");

      const querySnapshot = await mainPromotionCollection.get();
      const mainPromotions = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        mainPromotions.push(data);
      });

      // Función para calcular el valor del descuento
      function calcularDescuento(promotion) {
        const price = parseFloat(promotion.price);
        const percentOffer = parseFloat(promotion.percentOffer);
        return (price * percentOffer) / 100;
      }

      // Calcular y agregar el campo totalPriceDiscount a cada promoción
      mainPromotions.forEach((promotion) => {
        const descuento = calcularDescuento(promotion);
        const price = parseFloat(promotion.price);
        const totalPriceDiscount = price - descuento;
        promotion.totalPriceDiscount = totalPriceDiscount;
      });

      // Ordenar las promociones por el campo percentOffer de menor a mayor
      mainPromotions.sort((a, b) => {
        const percentOfferA = parseInt(a.percentOffer);
        const percentOfferB = parseInt(b.percentOffer);
        return percentOfferA - percentOfferB;
      });

      res.status(HTTP_STATUS_CODES.OK).json(mainPromotions);
    } catch (error) {
      console.error("Error al consultar la colección Promotions:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al consultar la colección Promotions" });
    }
  },

  async createPromotions(req, res, next) {
    try {
      const productsCollection = db.collection("Promotions");
      const productData = req.body;

      const docRef = await productsCollection.add(productData);

      const productID = docRef.id;

      productData.productID = productID;

      await docRef.update({ productID });

      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Producto creado", productID });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al crear el producto" });
    }
  },

  async createMainPromotion(req, res, next) {
    try {
      const productsCollection = db.collection("MainPromotion");
      const productData = req.body;
      const id = productData.id;
      const existingDoc = await productsCollection.doc(id).get();

      if (existingDoc.exists) {
        await productsCollection.doc(id).update(productData);
      } else {

        await productsCollection.doc(id).set(productData);
      }
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Oferta principal modificada o creada", id });
    } catch (error) {
      console.error("Error al crear o actualizar la oferta principal:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al crear o actualizar la oferta principal" });
    }
  },

  async uploadImage(req, res, next) {
    try {
      const { imageProductBase64 } = req.body;
      const bucket = admin.storage().bucket();
  
      const imageBuffer = Buffer.from(imageProductBase64, 'base64');
      const fileName = `image_${Date.now()}.jpg`;
      const file = bucket.file(fileName);
      const fileStream = file.createWriteStream({
        metadata: {
          contentType: 'image/jpeg',
        },
      });
      fileStream.end(imageBuffer);
  
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2100',
      });
  
      // Append a timestamp to the URL
      const imageUrlWithTimestamp = `${url}?timestamp=${Date.now()}`;
  
      // Return the modified URL as a response
      res.status(200).json({ imageUrl: imageUrlWithTimestamp });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      res.status(500).json({ error: 'Ocurrió un error en el servidor' });
    }
  },
  
  
};

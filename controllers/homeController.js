const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");

const db = admin.firestore();

module.exports = {
  async mainPromotion(req, res, next) {
    try {
      const mainPromotionCollection = db.collection("MainPromotion");

      const querySnapshot = await mainPromotionCollection.get();
      const mainPromotions = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const totalPriceDiscount =
          data.price - data.price * (data.percentOffer / 100);

        data.totalPriceDiscount = totalPriceDiscount;

        mainPromotions.push(data);
      });

      res.status(HTTP_STATUS_CODES.OK).json(mainPromotions);
    } catch (error) {
      console.error("Error al consultar la colección MainPromotion:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al consultar la colección MainPromotion" });
    }
  },

  async categories(req, res, next) {
    try {
      const categoriesCollection = db.collection("Categories");

      const querySnapshot = await categoriesCollection.get();
      const categories = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push(data);
      });
      res.status(HTTP_STATUS_CODES.OK).json(categories);
    } catch (error) {
      console.error("Error al consultar la colección Categories:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al consultar la colección Categories" });
    }
  },

  async products(req, res, next) {
    try {
      const productsCollection = db.collection("Products");

      const querySnapshot = await productsCollection.get();
      const products = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push(data);
      });
      res.status(HTTP_STATUS_CODES.OK).json(products);
    } catch (error) {
      console.error("Error al consultar la colección Products:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al consultar la colección Products" });
    }
  },

  async createProducts(req, res, next) {
    try {
      const productsCollection = db.collection("Products");
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
};

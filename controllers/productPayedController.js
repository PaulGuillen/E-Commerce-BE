const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");

const db = admin.firestore();

module.exports = {
  async createOrders(req, res, next) {
    try {
      const orderData = req.body;
      const orderRef = db.collection("Orders");
  
      // Extract order details
      const {
        orderID,
        addressSelected,
        fullName,
        isPayed,
        listProducts,
        orderDate,
        phoneNumber,
        totalPrice,
        userUID,
      } = orderData;
  
      // Validate the existence of required data
      if (!orderID || !addressSelected || !fullName || !listProducts || !orderDate || !phoneNumber || !totalPrice || !userUID) {
        throw new Error("Invalid order data. Missing required fields.");
      }
  
      // Create a reference to the order document using orderID
      const orderDocRef = orderRef.doc(orderID);
  
      // Set the order data in the document
      await orderDocRef.set({
        addressSelected,
        fullName,
        isPayed,
        listProducts,
        orderDate,
        phoneNumber,
        totalPrice,
        userUID,
      });
  
      res.status(HTTP_STATUS_CODES.CREATED).json({
        message: "Órdenes creadas exitosamente",
      });
    } catch (error) {
      console.error("Error al crear las órdenes en Firestore:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al crear las órdenes." });
    }
  },
  
  async getOrders(req, res, next) {
    try {
      const { uid } = req.query;
  
      if (typeof uid === "string" && uid.trim() !== "") {
        const ordersRef = db.collection("Orders");
        const querySnapshot = await ordersRef.get();
  
        const matchingOrders = [];
  
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          const orderID = doc.id;
  
          // Check if the order has the specified userUID
          if (orderData && orderData.userUID === uid) {
            matchingOrders.push({
              orderID,
              ...orderData,
            });
          }
        });
  
        if (matchingOrders.length > 0) {
          res.status(HTTP_STATUS_CODES.OK).json(matchingOrders);
        } else {
          res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            message: "No tienes ordenes",
          });
        }
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "userUID no válido",
        });
      }
    } catch (error) {
      console.error("Error al obtener los productos comprados:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al obtener los productos comprados",
      });
    }
  },
  
  
  async cleanProductInBag(req, res, next) {
    try {
      const orderData = req.body;
      const userUID = orderData.userUID;

      if (typeof userUID === "string" && userUID.trim() !== "") {
        const userDocRef = db.collection("ProductInBag").doc(userUID);

        await userDocRef.delete();
        res
          .status(HTTP_STATUS_CODES.OK)
          .json({ message: "Productos en la bolsa eliminados con éxito." });
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "userUID no válido." });
      }
    } catch (error) {
      console.error("Error al eliminar productos en la bolsa:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al eliminar productos en la bolsa." });
    }
  },
};

const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");

const db = admin.firestore();

module.exports = {
  async createOrders(req, res, next) {
    try {
      const orderData = req.body;
      const userUID = orderData.userUID;

      if (typeof userUID === "string" && userUID.trim() !== "") {
        const orderRef = db.collection("Orders").doc(userUID);
        const userDoc = await orderRef.get();
        const orderDataInside = userDoc.exists ? userDoc.data() : {};

        const listOrders = orderData.orders || [];

        listOrders.forEach((order) => {
          if (order.orderID && typeof order.orderID === "string") {
            orderDataInside[order.orderID] = order;
          } else {
            const orderID = uuidv4();
            orderDataInside[orderID] = order;
          }
        });

        await orderRef.set(orderDataInside);

        res.status(HTTP_STATUS_CODES.CREATED).json({
          message: "Órdenes creadas exitosamente",
          userUID: userUID,
        });
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "userUID no válido." });
      }
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
        const userDocRef = db.collection("Orders").doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();

          const orderList = Object.values(userData);
          
          if (orderList.length > 0) {
            res.status(HTTP_STATUS_CODES.OK).json(orderList);
          } else {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
              message: "No tienes ordenes",
            });
          }
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

const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");

const db = admin.firestore();

function isValidRequest(userUID, listProducts, totalPrice) {
  return (
    typeof userUID === "string" &&
    userUID.trim() !== "" &&
    Array.isArray(listProducts) &&
    typeof totalPrice === "number"
  );
}

function updateProducts(userData, listProducts) {
  listProducts.forEach((updatedProduct) => {
    const { productID, quantity, totalProductPriceToPay } = updatedProduct;

    if (
      typeof productID === "string" &&
      productID.trim() !== "" &&
      typeof quantity === "number" &&
      quantity >= 0 &&
      typeof totalProductPriceToPay === "number" &&
      totalProductPriceToPay >= 0
    ) {
      if (userData[productID]) {
        userData[productID].quantity = quantity;
        userData[productID].totalProductPriceToPay = totalProductPriceToPay;
      }
    }
  });
}

module.exports = {
  async productInBag(req, res, next) {
    try {
      const productData = req.body;
      const userUID = productData.userUID;

      if (typeof userUID === "string" && userUID.trim() !== "") {
        const userDocRef = db.collection("ProductInBag").doc(userUID);

        const userDoc = await userDocRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};

        userData.userUID = userUID;

        const listProducts = productData.listProducts || [];

        listProducts.forEach((product) => {
          if (product.productID && typeof product.productID === "string") {
            userData[product.productID] = product;
          } else {
            const productId = uuidv4();
            userData[productId] = product;
          }
        });

        await userDocRef.set(userData);

        res
          .status(HTTP_STATUS_CODES.CREATED)
          .json({ message: "Producto(s) agregado(s) a la bolsa" });
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "userUID no válido",
        });
      }
    } catch (error) {
      console.error(
        "Error al crear el documento en la colección OrderInBag:",
        error
      );
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al crear el documento en la colección OrderInBag",
      });
    }
  },

  async getProductsInBag(req, res, next) {
    try {
      const { uid } = req.query;

      if (typeof uid === "string" && uid.trim() !== "") {
        const userDocRef = db.collection("ProductInBag").doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();

          const productsInBag = Object.values(userData).filter(
            (product) => product.productInBag === true
          );

          const totalResults = productsInBag.length;

          if (totalResults > 0) {
            const response = {
              productsInBag: productsInBag,

              additionalData: {
                totalResults: totalResults,
              },
            };
            res.status(HTTP_STATUS_CODES.OK).json(response);
          } else {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
              message: "No tienes productos en bolsa",
            });
          }
        } else {
          res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            message: "No tienes productos",
          });
        }
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "userUID no válido",
        });
      }
    } catch (error) {
      console.error("Error al obtener los productos en bolsa:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al obtener los productos en bolsa",
      });
    }
  },

  async deleteProductInBag(req, res, next) {
    try {
      const { userUID, productID } = req.body;

      if (
        typeof userUID === "string" &&
        userUID.trim() !== "" &&
        typeof productID === "string" &&
        productID.trim() !== ""
      ) {
        const userDocRef = db.collection("ProductInBag").doc(userUID);

        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data();

          if (userData[productID]) {
            delete userData[productID];

            await userDocRef.set(userData);

            res.status(HTTP_STATUS_CODES.OK).json({
              message: "Producto eliminado de la bolsa con éxito",
            });
          } else {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
              message: "El producto no se encontraba en la bolsa",
            });
          }
        } else {
          res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            message: "No se encontró la bolsa del usuario",
          });
        }
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "userUID o productID no válido(s)",
        });
      }
    } catch (error) {
      console.error("Error al eliminar el producto de la bolsa:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al eliminar el producto de la bolsa",
      });
    }
  },

  async updateProductsInBag(req, res, next) {
    try {
      const { userUID, listProducts, totalPrice } = req.body;

      if (isValidRequest(userUID, listProducts, totalPrice)) {
        const userDocRef = db.collection("ProductInBag").doc(userUID);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          userData.totalPrice = totalPrice;

          updateProducts(userData, listProducts);

          await userDocRef.set(userData);

          res.status(HTTP_STATUS_CODES.OK).json({
            message: "Productos en la bolsa actualizados con éxito",
          });
        } else {
          res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            message: "No se encontró la bolsa del usuario",
          });
        }
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message:
            "userUID no válido, updatedProducts no es un arreglo válido o totalPrice no es un número válido",
        });
      }
    } catch (error) {
      console.error("Error al actualizar los productos en la bolsa:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al actualizar los productos en la bolsa",
      });
    }
  },

  async getOrdersPayed(req, res, next) {
    try {
      const ordersCollection = db.collection("Orders");

      const querySnapshot = await ordersCollection.get();
      const orders = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push(data);
      });
      res.status(HTTP_STATUS_CODES.OK).json(orders);
    } catch (error) {
      console.error("Error al consultar la colección Orders:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al consultar la colección Orders" });
    }
  },

  async allOrdersAdminRole(req, res, next) {
    try {
      const ordersCollection = db.collection("Orders");
  
      const querySnapshot = await ordersCollection.get();
      const orders = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          orderID: doc.id,
          ...data,
        });
      });
  
      res.status(HTTP_STATUS_CODES.OK).json(orders);
    } catch (error) {
      console.error("Error al consultar la colección Orders:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al consultar la colección Orders" });
    }
  },
  
};

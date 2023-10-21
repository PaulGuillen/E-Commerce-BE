const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");

const db = admin.firestore();

module.exports = {
  async saveFavoriteProducts(req, res, next) {
    try {
      const productData = req.body;
      const userUID = productData.userUID;

      if (typeof userUID === "string" && userUID.trim() !== "") {
        const userDocRef = db.collection("FavoriteProducts").doc(userUID);

        const userDoc = await userDocRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};

        userData.userUID = userUID;

        const listFavorites = productData.listFavorites || [];

        listFavorites.forEach((product) => {
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
          .json({ message: "Producto(s) agregado(s) a favoritos" });
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "userUID no válido",
        });
      }
    } catch (error) {
      console.error(
        "Error al crear el documento en la colección FavoriteProducts:",
        error
      );
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al crear el documento en la colección FavoriteProducts",
      });
    }
  },

  async getFavoriteProducts(req, res, next) {
    try {
      const { uid } = req.query;

      if (typeof uid === "string" && uid.trim() !== "") {
        const userDocRef = db.collection("FavoriteProducts").doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();

          const favoriteProducts = Object.values(userData).filter(
            (product) => product.isFavorite === true
          );

          if (favoriteProducts.length > 0) {
            res.status(HTTP_STATUS_CODES.OK).json(favoriteProducts);
          } else {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
              message: "No tienes productos favoritos",
            });
          }
        } else {
          res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            message: "No tienes productos favoritos",
          });
        }
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "userUID no válido",
        });
      }
    } catch (error) {
      console.error("Error al obtener los productos favoritos:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al obtener los productos favoritos",
      });
    }
  },
};

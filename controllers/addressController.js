const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");

const db = admin.firestore();

function generateAddressRandomID(n) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomID = "";

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomID += characters.charAt(randomIndex);
  }

  return randomID;
}

module.exports = {
  async createAddress(req, res, next) {
    try {
      const addressData = req.body;
      const userUID = addressData.userUID;

      if (typeof userUID === "string" && userUID.trim() !== "") {
        const userDocRef = db.collection("Addresses").doc(userUID);

        const userDoc = await userDocRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};
        const listAddress = addressData.listAddress || [];

        listAddress.forEach((address) => {
          const addressID = generateAddressRandomID(20);
          address.addressID = addressID;
          userData[addressID] = address;
        });

        await userDocRef.set(userData);

        res
          .status(HTTP_STATUS_CODES.CREATED)
          .json({ message: "Dirección agregada con éxito" });
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "userUID no válido",
        });
      }
    } catch (error) {
      console.error(
        "Error al crear el documento en la colección Addresses:",
        error
      );
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al crear el documento en la colección Addresses",
      });
    }
  },

  async getAddresses(req, res, next) {
    try {
      const { uid } = req.query;

      if (typeof uid === "string" && uid.trim() !== "") {
        const userDocRef = db.collection("Addresses").doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();

          const allAddress = Object.values(userData);

          if (allAddress.length > 0) {
            res.status(HTTP_STATUS_CODES.OK).json(allAddress);
          } else {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
              message: "No tienes direcciones registradas",
            });
          }
        } else {
          res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            message: "No tienes direcciones registradas",
          });
        }
      } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "userUID no válido",
        });
      }
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al obtener las direcciones",
      });
    }
  },
};

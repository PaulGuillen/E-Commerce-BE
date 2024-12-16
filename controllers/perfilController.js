const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const db = admin.firestore();

module.exports = {
  async getUser(req, res) {
    try {
      const { uid } = req.query;

      if (!uid) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "UID no proporcionado en la consulta",
        });
        return;
      }
      const userDoc = await db.collection("Users").doc(uid).get();

      if (!userDoc.exists) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "Usuario no encontrado",
        });
        return;
      }

      const userData = userDoc.data();
      const { name, lastname, email, password, phone } = userData;

      res.status(HTTP_STATUS_CODES.OK).json({
        name,
        lastname,
        email,
        password,
        phone,
      });
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Error al buscar el usuario",
      });
    }
  },
};

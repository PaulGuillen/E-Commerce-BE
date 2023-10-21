const admin = require("firebase-admin");
const HTTP_STATUS_CODES = require("../utils/httpStatusCodes");
const serviceAccount = require("../google_services_firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "pa-masticar.appspot.com", 
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = {
  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const uid = userRecord.uid;

      const { userType } = userRecord.customClaims;

      res.status(HTTP_STATUS_CODES.OK).json({
        status: HTTP_STATUS_CODES.OK,
        message: "Inicio de sesión exitoso",
        uid: uid,
        userType: userType,
      });
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: "Credenciales de inicio de sesión incorrectas",
      });
    }
  },
  async createUser(req, res, next) {
    try {
      const { name, lastname, email, password, phone, userType } = req.body;
      // Crear el usuario en Firebase Authentication
      const userRecord = await admin.auth().createUser({
        name,
        lastname,
        email,
        password,
        phone,
      });

      const uid = userRecord.uid;
      // Almacenar el userType como un campo personalizado en el perfil del usuario
      await admin.auth().setCustomUserClaims(uid, { userType });

      const usersCollection = db.collection("Users");
      await usersCollection.doc(uid).set({
        name,
        lastname,
        email,
        password,
        uid,
        phone,
        userType,
      });

      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ message: "Usuario registrado con éxito" });
    } catch (error) {
      console.error("Error al registrar al usuario:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al registrar al usuario" });
    }
  },
};

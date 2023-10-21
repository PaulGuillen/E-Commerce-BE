const AddressController = require("../controllers/addressController");

module.exports = (app) => {
  /*
   * POST ROUTES
   */
  app.post(
    "/address/createAddress",
    AddressController.createAddress
  );

  /*
   * GET ROUTES
   */
  app.get(
    "/address/allAddresses",
    AddressController.getAddresses
  );
};

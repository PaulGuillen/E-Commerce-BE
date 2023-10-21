const FavouriteController = require("../controllers/favouriteController");

module.exports = (app) => {
  /*
   * POST ROUTES
   */
  app.post(
    "/favorite/favoriteProducts",
    FavouriteController.saveFavoriteProducts
  );

  /*
   * GET ROUTES
   */
  app.get(
    "/favorite/getFavoriteProducts",
    FavouriteController.getFavoriteProducts
  );
};

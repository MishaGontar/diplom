import ImageController from "../controllers/image/ImageController.js";
import AdminController from "../controllers/admin/AdminController.js";
import AuctionController from "../controllers/auction/AuctionController.js";
import LotController from "../controllers/lot/LotController.js";
import LoginController from "../controllers/auth/LoginController.js";
import RegistrationController from "../controllers/auth/RegistrationController.js";
import SellerController from "../controllers/seller/SellerController.js";

export function applyNoAuthRoutes(app) {
    app.get('/images/:filename', ImageController.getUploadImage)

    app.post("/login", LoginController.login);
    app.post("/admin/login", AdminController.login)
    app.post("/registration", RegistrationController.registrationUser);

    app.get("/auction/info/:id", AuctionController.getAuctionByUrlId)
    app.get("/auction/:id/lots", LotController.getAuctionLots)
    app.get("/auction/lot/:id", LotController.getLotById)
    app.get("/auctions/all", AuctionController.getAllAvailableAuction)
    app.get("/seller/info/:id", SellerController.getSellerInfoById)
}
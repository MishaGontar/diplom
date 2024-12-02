import AdminController from "../controllers/admin/AdminController.js";
import SellerController from "../controllers/seller/SellerController.js";
import UserController from "../controllers/user/UserController.js";
import AuctionController from "../controllers/auction/AuctionController.js";
import LotController from "../controllers/lot/LotController.js";

// don't forget add app.use(AuthController.authenticateToken) before use method
export default function applyAdminRoutes(app) {
    app.use(AdminController.authenticateAdminToken)

    app.post("/admin/check", AdminController.check)
    app.get("/sellers", SellerController.getSellers)
    app.get("/users", UserController.getAllUsers)
    app.delete("/user/delete/:id/:sellerId", UserController.deleteUserByUrl)
    app.get("/sellers/status", SellerController.getSellersStatuses)
    app.get("/auctions_and_lots/all", AuctionController.getAllAuctionsAndLots)
    app.get("/lot/images/:id", LotController.getLotImages)
    app.post("/seller/2", SellerController.acceptSeller)
    app.post("/seller/3", SellerController.rejectSeller)

    app.get("/blocked/users", UserController.getAllBlockedUsers)
    app.post("/unblock/user/:id", UserController.unblockUserById)
    app.post("/block/user/:id", UserController.blockUserById)
}
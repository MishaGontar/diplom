import AuthController from "../controllers/auth/AuthController.js";
import AdminController from "../controllers/admin/AdminController.js";
import AuctionController from "../controllers/auction/AuctionController.js";
import UserController from "../controllers/user/UserController.js";
import SellerController from "../controllers/seller/SellerController.js";
import {uploadTemp} from "../services/image/StorageImage.js";
import LotController from "../controllers/lot/LotController.js";

export function applyAuthRoutes(app) {
    app.use(AuthController.authenticateToken)

    app.post("/auth/code", AuthController.confirmCode);
    app.post("/admin/confirm", AdminController.confirmCode)

    app.get("/auctions/all_auth", AuctionController.getAllAuthAuctions)
    app.get("/auction/getAvailable", AuctionController.getAllAvailableAuction)
    app.get("/user", UserController.getUser)
    app.post("/user/photo", uploadTemp.single('image'), UserController.updateUserPhoto)
    app.get("/user/bets", UserController.getUserBets)
    app.delete("/user/delete", UserController.deleteUserById)
    app.get("/seller", SellerController.getSellerByUserId)
    app.post("/create/seller", SellerController.handleSellerForm)

    app.get("/auction/status", AuctionController.getAuctionStatuses)
    app.get("/auction/create_statuses", AuctionController.getAuctionCreateStatuses)

    app.post("/create/auction", uploadTemp.single('image'), AuctionController.createAuction)
    app.post("/update/auction", uploadTemp.single('image'),
        SellerController.checkSellerIds,
        AuctionController.updateAuction
    )
    app.delete("/delete/auction/:id", AuctionController.deleteAuction)

    app.post("/create/lot", uploadTemp.array('image', 3),
        SellerController.checkSellerIds,
        LotController.createLot
    )
    app.post("/update/lot/:id", uploadTemp.array('image', 3),
        SellerController.checkSellerIds,
        LotController.updateLotById)

    app.post("/seller/users/blocked", SellerController.checkSellerIds, SellerController.getAllBlockUsers)
    app.post("/seller/users/unblock/:id", SellerController.checkSellerIds, SellerController.unblockUserById)

    app.delete("/delete/lot/:id", LotController.deleteLotById)
    app.delete("/delete/lot/:id/bet/:bet_id", LotController.deleteLotBetByLotId)
}
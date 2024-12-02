import AuctionService from "../../services/auction/AuctionService.js";
import ImageService from "../../services/image/ImageService.js";
import {checkFormDataWithFile, deleteRequestFiles, getErrorResponse} from "../../utils.js";
import LotService from "../../services/lot/LotService.js";

class AuctionController {
    async getAuctionStatuses(req, res) {
        try {
            const statuses = await AuctionService.getAuctionStatuses(req.db)
            return res.status(200).send({statuses: statuses})
        } catch (e) {
            return getErrorResponse(res, e)
        }
    }

    async getAuctionCreateStatuses(req, res) {
        try {
            const statuses = await AuctionService.getOnlyAuctionCreateStatus(req.db)
            return res.status(200).send({statuses: statuses})
        } catch (e) {
            return getErrorResponse(res, e)
        }
    }

    async getAuctionByUrlId(req, res) {
        try {
            const auction = await AuctionService.getAuctionById(req.db, req.params.id)
            res.status(200).send({auction: auction})
        } catch (e) {
            return getErrorResponse(res, e)
        }
    }

    async createAuction(req, res) {
        try {
            checkFormDataWithFile(req)
            const image = await ImageService.createImage(req.db, req.file)
            const {name, description, status_id} = req.body
            const formData = {
                name: name,
                description: description,
                seller_id: req.user.seller_id,
                status_id: +status_id,
                img_id: image.id
            }
            const auction = await AuctionService.createAuction(req.db, formData)

            if (auction === null) {
                return res.status(500).send({message: "Не вдалося створити аукціон"})
            }
            res.status(200).send({auction_id: auction.id})
        } catch (e) {
            deleteRequestFiles(req)
            console.error('createAuction', e)
            return getErrorResponse(res, e)
        }
    }

    async updateAuction(req, res) {
        try {
            const formData = req.body;
            if (!formData) {
                throw new Error("Not found data")
            }
            if (req.file) {
                const new_img = await ImageService.createImage(req.db, req.file);
                formData.new_img_id = new_img.id
            }
            const auction = await AuctionService.updateAuction(req.db, formData)
            if (req.file) {
                await ImageService.deleteImageByUrl(req.db, formData.auction_img_path)
            }
            res.status(200).send({new_auction: auction})
        } catch (e) {
            deleteRequestFiles(req)
            console.error('updateAuction', e)
            return getErrorResponse(res, e)
        }
    }


    async getAllAvailableAuction(req, res) {
        try {
            const auctions = await AuctionService.getAllAuctions(req.db)
            const filteredAuctions = auctions
                .filter((auction) => auction.auction_status_id === 1 || auction.auction_status_id === 5)
            return res.status(200).send({auctions: filteredAuctions})
        } catch (e) {
            console.error('getAllAvailableAuction', e)
            return getErrorResponse(res, e)
        }
    }

    async getAllAuthAuctions(req, res) {
        try {
            const seller_id = req.user ? req.user.seller_id : undefined;
            const auctions = await AuctionService.getAllAuctions(req.db)
            const filteredAuctions = auctions.filter((auction) => {
                if (auction.seller_id === seller_id) {
                    return true;
                } else {
                    return auction.auction_status_id === 1 || auction.auction_status_id === 5;
                }
            });
            return res.status(200).send({auctions: filteredAuctions})
        } catch (e) {
            console.error('getAllAuthAuctions', e)
            return getErrorResponse(res, e)
        }
    }

    async getAllAuctionsAndLots(req, res) {
        try {
            const auctions = await AuctionService.getAllAuctions(req.db)
            const lots = await LotService.getAllLots(req.db);

            return res.status(200).send({auctions: auctions, lots: lots})
        } catch (e) {
            console.error('getAllAuctions', e)
            return getErrorResponse(res, e)
        }
    }

    async deleteAuction(req, res) {
        try {
            const auction_id = +req.params.id;
            const auction = await AuctionService.getAuctionById(req.db, auction_id)
            if (!req.admin_token && req.user.seller_id !== auction.seller_id ) {
                throw new Error("You are not a owner!")
            }
            const result = await AuctionService.deleteAuction(req.db, auction)
            res.status(200).send({is_success: result})
        } catch (e) {
            console.error('deleteAuction', e)
            return getErrorResponse(res, e)
        }
    }
}

export default new AuctionController()
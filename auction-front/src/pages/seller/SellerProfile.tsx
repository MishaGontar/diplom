import {useAuth} from "../../provider/AuthProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {MAIN_BOX_CONTAINER, SMALL_BOX_CARD, TEXT_STYLE} from "../../constans.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {ISellerProfile} from "./ISellerProfile.ts";
import {IAuction} from "../auction/IAuction.ts";
import {Card, CardHeader, Tab, Tabs} from "@nextui-org/react";
import {getImagePath} from "../../utils/ImageUtils.ts";
import SellerAllAuctions from "./SellerAllAuctions.tsx";
import SellerBanUsers from "./SellerBanUsers.tsx";
import {usePage} from "../page/PageContext.tsx";
import SpinnerView from "../../components/spinner/Spinner.tsx";
import ImageModal from "../../components/image/ImageModal.tsx";

export default function SellerProfile() {
    const [seller, setSeller] = useState<ISellerProfile | null>(null)
    const [auctions, setAuctions] = useState<IAuction[] | null>(null)
    const [isOwner, setIsOwner] = useState(false)
    const [selected, setSelected] = useState("auctions");

    const {isLoading, setIsLoading} = usePage()
    const {user} = useAuth()
    const {id} = useParams()
    const navigator = useNavigate()

    useEffect(() => {
        setIsLoading(true);
        axios.get(`/seller/info/${id}`)
            .then(res => {
                const sellerData = res.data.seller;
                setSeller(sellerData);
                setIsOwner(user?.seller_id === sellerData.seller_id);
                const auctionsData = user?.seller_id === sellerData.seller_id
                    ? res.data.auctions
                    : res.data.auctions.filter((a: IAuction) => a.auction_status_id === 1 || a.auction_status_id === 5)
                setAuctions(auctionsData);
            })
            .catch(error => {
                sendErrorNotify(getErrorMessage(error));
                if (error.response && error.response.status === 404) {
                    navigator('/auctions');
                }
            })
            .finally(() => setIsLoading(false));
    }, [id, user, navigator]);


    if (isLoading) {
        return <SpinnerView/>
    }
    return (
        <div className={MAIN_BOX_CONTAINER}>
            {isOwner && <div className="w-full sm:w-1/2">
                <Tabs
                    aria-label="Options"
                    className="my-1.5 flex justify-center items-center"
                    selectedKey={selected}
                    onSelectionChange={(key) => setSelected(key.toString())}
                >
                    <Tab key="auctions"
                         className=""
                         title={
                             <div className="flex items-center space-x-2 w-fit justify-center p-1.5">
                                 <img src="/auction-24.png" alt="аукціони" className="w-6 h-6"/>
                                 <span>Аукціони</span>
                             </div>
                         }
                    >
                        <SellerAllAuctions auctions={auctions} isOwner={isOwner}/>
                    </Tab>
                    <Tab key="auctions2"
                         title={
                             <div className="flex items-center space-x-2 w-fit justify-center p-1.5">
                                 <img src="/block.svg" alt="Увійти лого" className="w-6 h-6"/>
                                 <span>Заблоковані користувачі</span>
                             </div>
                         }
                    >
                        <SellerBanUsers seller_id={user?.seller_id}/>
                    </Tab>
                </Tabs>
            </div>}
            {!isOwner && <SellerAllAuctions auctions={auctions} isOwner={isOwner}/>}
            <Card className={`${SMALL_BOX_CARD} order-first sm:order-last`}>
                <div className="flex flex-col items-center">
                    <CardHeader className="flex flex-col items-center">
                        <ImageModal img_path={getImagePath(seller?.image_url)}>
                            <img src={getImagePath(seller?.image_url)} alt={"Avatar"}
                                 className="w-[150px] h-auto rounded"/>
                        </ImageModal>
                    </CardHeader>
                    <div className="mx-3">
                        <h1 className={TEXT_STYLE}><strong>Продавець : </strong> {seller?.full_name}</h1>
                        <p className={TEXT_STYLE}><strong>Опис: </strong> {seller?.description}</p>
                        <p className={TEXT_STYLE}><strong>Соціальні мережі: </strong> {seller?.social_media}</p>
                        {seller?.address &&
                            <p className={TEXT_STYLE}><strong>Адреса: </strong> {seller.address}</p>}
                    </div>
                </div>
            </Card>
        </div>
    )
}
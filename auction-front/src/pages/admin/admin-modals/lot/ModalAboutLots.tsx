import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {IData} from "../../tables/auction-lot/AuctionsLotsAdminTable.tsx";
import CustomChip from "../../../../components/chip/CustomChip.tsx";
import {convertToKyivTime, formatNumberWithSpaces} from "../../../../utils/CustomUtils.ts";
import ButtonModalConfirmDelete from "../../../../components/buttons/ButtonModalConfirmDelete.tsx";
import ImagesSlider from "../../../../components/image/ImagesSlider.tsx";
import {AxiosResponse} from "axios";
import {IImage} from "../../../../utils/ImageUtils.ts";
import SpinnerView from "../../../../components/spinner/Spinner.tsx";
import NameValueView from "../../../../components/input-form/NameValueView.tsx";
import useAxios from "../../../../hooks/useAxios.ts";
import {ILotDashResponse} from "../../../lots/LotInterfaces.ts";

interface ModalProps {
    data: IData;
    onClose: () => void;
    handleClick: () => void;
}

export default function ModalAboutLot({data, onClose, handleClick}: ModalProps) {
    const [images, setImages] = useState<IImage[]>([]);
    const lot: ILotDashResponse = data.data as ILotDashResponse;
    const {isLoading, getAdminRequest} = useAxios();

    useEffect(() => {
        getAdminRequest(`/lot/images/${lot.lot_id}`,
            (res: AxiosResponse) => setImages(res.data.images));
    }, []);

    return (<>
        <Modal placement="top"
               scrollBehavior="normal"
               size="2xl"
               backdrop="opaque"
               isOpen={lot.lot_id !== undefined}
               onClose={onClose}
        >
            <ModalContent>
                {isLoading && <SpinnerView/>}
                {!isLoading && <>
                    <ModalHeader className="flex justify-center gap-1">
                        Лот {lot.lot_name}
                    </ModalHeader>
                    <ModalBody className="sm:mx-10">
                        <div className="bg-white shadow-md rounded-lg p-6 ">
                            <div className="mb-14">
                                <ImagesSlider images={images}/>
                            </div>

                            <h2 className="text-xl font-semibold text-center mb-2">
                                {lot.lot_name}
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                {lot.lot_description}
                            </p>

                            <ul className="divide-y divide-gray-200">
                                <NameValueView name="Продавець:"
                                               value={lot.seller_full_name}/>
                                <NameValueView name="Продається на аукціоні:"
                                               value={lot.auction_name}/>
                                <NameValueView name="Статус:"
                                               value={<CustomChip color={data.status.color} text={data.status.name}/>}/>
                                <NameValueView name="Початкова сума:"
                                               value={formatNumberWithSpaces(lot.lot_amount.toString()) + " грн"}/>
                                {lot.winner && (<>
                                    <NameValueView name="Переможець:"
                                                   value={lot.winner.username ?? "Невідомо (остання ставка власника)"}/>
                                    <NameValueView name="Фінальна ставка:"
                                                   value={formatNumberWithSpaces(lot.winner.amount.toString()) + " грн"}/>
                                </>)
                                }
                                {lot.lot_monobank_link &&
                                    <NameValueView name="Посилання на Monobank банку:"
                                                   value={lot.lot_monobank_link}/>
                                }
                                {lot.lot_bank_card_number &&
                                    <NameValueView name="Номер картки:"
                                                   value={lot.lot_bank_card_number}/>
                                }
                                <NameValueView name="Дата створення:"
                                               value={convertToKyivTime(lot.lot_date_created)}/>
                            </ul>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex flex-col">
                        <ButtonModalConfirmDelete object="лот" onAccept={handleClick}/>
                    </ModalFooter>
                </>
                }
            </ModalContent>
        </Modal>
    </>)
}
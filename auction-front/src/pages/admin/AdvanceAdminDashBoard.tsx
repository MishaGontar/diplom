import AdminPage from "./AdminPage.tsx";
import {Tab, Tabs} from "@nextui-org/react";
import {lazy, useState} from "react";
import useTitle from "../../hooks/useTitle.ts";

const SellerAdminTable = lazy(()=>import("./tables/seller/SellerAdminTable.tsx"));
const UserAdminTable = lazy(()=>import("./tables/user/UsersAdminTable.tsx"));
const AuctionsLotsAdminTable = lazy(()=>import("./tables/auction-lot/AuctionsLotsAdminTable.tsx"));

const columns = [
    {name: "Продавці", icon: "/paper-24.png", children: <SellerAdminTable/>},
    {name: "Користувачі", icon: "/user-24.png", children: <UserAdminTable/>},
    {name: "Лоти та аукціони", icon: "/auction-24.png", children: <AuctionsLotsAdminTable/>},
]

export default function AdvanceAdminDashBoard() {
    useTitle('Адміністративна панель');
    const [selected, setSelected] = useState(columns[0].name);

    return (
        <AdminPage>
            <div className="flex w-full justify-center items-center flex-col my-5">
                <Tabs
                    aria-label="Options"
                    selectedKey={selected}
                    onSelectionChange={(key) => setSelected(key.toString())}
                >
                    {columns.map((column) => (
                        <Tab key={column.name}
                             className="w-full sm:w-1/2"
                             title={
                                 <div className="flex items-center space-x-2 w-fit justify-center p-1.5">
                                     <img src={column.icon} alt=""/>
                                     <span>{column.name}</span>
                                 </div>
                             }
                        >
                            {column.children}
                        </Tab>
                    ))}
                </Tabs>
            </div>
        </AdminPage>
    );
}

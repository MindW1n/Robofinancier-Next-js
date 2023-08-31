import Header from "@/components/header/component"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LedgerBoard from "@/components/ledgerBoard/component"
import { redirect } from "next/navigation"

export default async function Ledger()
{
    const session = await getServerSession(authOptions)
    if(!session) redirect("/") 

    return (

        <div className="top-0 left-0 h-screen flex"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backgroundBlendMode: "multiply" }}>
            <div className="w-full m-3 flex flex-col">  
                <Header session={ session }/>
                <LedgerBoard session={ session } />
            </div>
        </div>
    )
}
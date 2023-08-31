import Sidebar from "@/components/sidebar/component"
import Header from "@/components/header/component"
import StatisticsBoard from "@/components/statisticsBoard/component"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function Home()
{
    const session = await getServerSession(authOptions)
    if(!session) redirect("/")

    return (

        <div className="top-0 left-0 flex flex-row h-screen" 
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backgroundBlendMode: "multiply" }}>
            <Sidebar session={ session } />
            <div className="w-full m-3 flex flex-col">
                <Header session={ session } />
                <StatisticsBoard session={ session } />
            </div>
        </div>
    )
}
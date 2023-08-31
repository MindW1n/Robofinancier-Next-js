import Header from "@/components/header/component"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import TasksBoard from "@/components/tasksBoard/component"
import { redirect } from "next/navigation"

export default async function Tasks()
{
    const session = await getServerSession(authOptions)
    if(!session) redirect("/")

    return (

        <div className="top-0 left-0 flex flex-col h-screen items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backgroundBlendMode: "multiply" }}>
            <Header session={ session }/>
            <TasksBoard session={ session }/>
        </div>
    )
}
import UserIcon from "../userIcon/component"
import Tab from "../tab/component"
import { headers } from "next/headers"

export default async function Header({ session }) {

    const currentUrlPath = headers().get("x-invoke-path")

    return (

        <div className="h-16 w-full bg-gray-400 rounded-full flex flex-row justify-end items-center">
            <div className="flex justify-center space-x-7 w-full">
                <Tab name="Statistics" href="/home" activeted={ currentUrlPath == "/home" ? true : "" } />
                <Tab name="Ledger" href="/home/ledger" activeted={ currentUrlPath == "/home/ledger" ? true : "" } />
                <Tab name="Tasks" href="/home/tasks" activeted={ currentUrlPath == "/home/tasks" ? true : "" } />
            </div>
            <UserIcon session={ session }/>
        </div>
    )
}
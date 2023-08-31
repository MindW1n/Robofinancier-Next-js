import Link from "next/link"

export default function Tab({ name, href, activeted })
{
    return (

        <div className={ "w-auto h-14 rounded-full flex items-center hover:scale-105 transform duration-300" 
            + (activeted ? " bg-blue-700 text-white" : " bg-white text-blue-700")}>
            <Link className="font-semibold p-6" href={ href } style={{ fontSize: "43px" }}>{ name }</Link>
        </div>
    )
}
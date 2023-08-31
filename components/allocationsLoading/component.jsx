import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"

export default function AllocationsLoading()
{
    return (

        <motion.div layout { ...fadeInOut } className="h-16 bg-gray-300 font-extrabold rounded-3xl m-4 p-3 flex justify-center items-center">
            Loading your allocations
        </motion.div>
    )
}
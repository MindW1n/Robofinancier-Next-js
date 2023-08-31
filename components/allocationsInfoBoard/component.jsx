import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"

export default function AllocationsInfoBoard({ text })
{
    return (

        <motion.div layout { ...fadeInOut } className="h-16 bg-gray-300 rounded-3xl font-extrabold m-4 p-3 flex justify-center items-center">
            { text }
        </motion.div>
    )
}
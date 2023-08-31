const { memo } = require("react")
import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"

const createAllocationButton = ({ onClick }) => {
    return (

        <motion.div layout { ...fadeInOut } className="w-full flex flex-row">
            <button type="button" onClick={ onClick } className="h-20 w-full bg-white rounded-3xl m-4 p-3 flex justify-center items-center hover:scale-105 transform duration-300">
                <h1 className="text-4xl font-extrabold text-gray-600">+</h1>
            </button>
        </motion.div>
    )
}

export default createAllocationButton
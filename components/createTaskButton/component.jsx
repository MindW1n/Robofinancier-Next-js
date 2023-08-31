import { motion } from "framer-motion"
import { memo } from "react"

const CreateTaskButton = memo(({ onClick }) => {

    return (

        <motion.button layout className="w-3/5 h-24 shrink-0 bg-white rounded-3xl flex justify-center items-center font-extrabold text-2xl m-4
            hover:scale-105 transition-transform duration-300 ease-out"
            onClick={ onClick }>
            +
        </motion.button>
    )
})

export default CreateTaskButton
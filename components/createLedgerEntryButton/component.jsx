import { motion } from "framer-motion"

export default function CreateLedgerEntryButton({ onClick })
{
    return (
        <div className="w-full flex justify-center">
            <motion.button layout className="transition-transform w-96 h-60 rounded-3xl bg-white m-4 flex justify-center font-extrabold text-5xl
                items-center hover:scale-105 duration-300" onClick={ onClick } key="create-ledger-button">+</motion.button>
        </div>
    )
}
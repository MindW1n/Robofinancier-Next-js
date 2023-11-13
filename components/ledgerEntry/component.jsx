import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import { useState } from "react"
import LedgerForm from "../ledgerForm/component"
const axios = require("@/libs/axios").default.axios

export default function LedgerEntry({ data, onDelete, session, index })
{
    const [ledgerEntryData, setLedgerEntryData] = useState(data)
    const [editFormFlag, setEditFormFlag] = useState(false)

    const databaseFunction = async (formData) => {
        
        return (await axios.post("/api/editLedgerEntry", { id: data.id, ...formData })).data.ledgerEntry
    }

    const handleDelete = () => {

        axios.post("/api/deleteLedgerEntry", { ledgerEntryId: data.id })
        onDelete(index)
    }

    const handleSubmit = (data) => {

        setLedgerEntryData(data)
        setEditFormFlag(false)
    }

    return (

        <motion.div layout { ...fadeInOut } className="flex justify-center"> 
            { editFormFlag 
                ?   <LedgerForm databaseFunction={ databaseFunction } onCancel={ () => setEditFormFlag(false) } onDelete={ handleDelete }
                        onSubmit={ handleSubmit } placeholder={ ledgerEntryData } session={ session }/> 
                :   <div className="w-96 rounded-3xl bg-white m-4 flex flex-col space-y-4">
                        <div className="flex flex-row items-center mt-4 mx-4 space-x-4 font-bold text-xl">
                            <div className="w-full rounded-3xl bg-blue-700 text-white h-10 flex justify-center items-center">
                                { ledgerEntryData.date.slice(0, 10) }
                            </div>
                            <button type="button" onClick={ () => setEditFormFlag(true) } className="bg-cyan-400 rounded-3xl flex justify-center 
                                items-center hover:scale-105 transition-transform duration-300 w-44 h-10">
                                edit
                            </button>
                        </div>
                        <div className="flex flex-row font-bold text-center">
                            <div className="border-4 border-slate-400 bg-slate-200 rounded-3xl p-1 mx-4 w-1/2 text-xl">
                                { ledgerEntryData.allocationsGroup ? ledgerEntryData.allocationsGroup.name : ledgerEntryData.allocation ? ledgerEntryData.allocation.name : "All" }
                            </div>
                            <div className="border-4 border-slate-400 bg-slate-200 mx-4 w-1/2 text-xl rounded-3xl flex items-center justify-center">
                                { ledgerEntryData.category.name }
                            </div>
                        </div>
                        <div className="flex-grow rounded-3xl border-4 border-slate-400 bg-slate-200 font-bold mb-4 p-3 mx-4 text-center">
                            {ledgerEntryData.record}
                        </div>
                        <div className="mb-4">
                            <div className={ "h-10 font-bold text-2xl rounded-3xl mx-4 mb-4 flex justify-center items-center " 
                                + (ledgerEntryData.amount > 0 ? "bg-green-400" : "bg-red-600 text-white")}>
                                { ledgerEntryData.amount + " " + (!ledgerEntryData.allocation || ledgerEntryData.allocation.currency == "Rouble" ? "₽" : (ledgerEntryData.allocation.currency == "Dollar" ? "$" : "€"))  }
                            </div>  
                        </div>
                    </div> }
        </motion.div>
    )
}
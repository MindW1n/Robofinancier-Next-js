import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import { useState } from "react"
import TaskForm from "../taskForm/component"
const axios = require("@/libs/axios").default.axios

export default function Task({ data, onDelete, index }) 
{
    const [loadedData, setLoadedData] = useState(data)
    const [editFlag, setEditFlag] = useState(false)

    const handleDeletion = async () => {

        await axios.post("/api/deleteTask", { id: data.id })
        onDelete(index)
    }

    const databaseFunction = async (record) => { 
        
        return await axios.post("/api/editTask", { id: data.id, record: record })
    }

    return (
        <>
            { editFlag 
            ?   <TaskForm onCancel={ () => setEditFlag(false) } onSubmit={ (data) => { setLoadedData(data); setEditFlag(false) }} index={ index } 
                    databaseFunction={ databaseFunction }
                    onDelete={ handleDeletion } placeholder={{ record: loadedData.record }}/> 
            :   <motion.div { ...fadeInOut } layout className="bg-white w-3/5 rounded-3xl p-3 space-y-4 flex flex-col">
                    <div className="flex flex-row w-full">
                        <div className="w-1/3"></div> 
                        <div className="w-1/3 flex justify-center">
                            <div className="w-5/6 h-full bg-blue-700 rounded-3xl text-white font-extrabold text-xl flex justify-center items-center">
                                { loadedData.updatedAt.slice(0, 10) }    
                            </div>
                        </div>
                        <div className="w-1/3 flex justify-end mr-4 font-extrabold h-10">
                            <button type="button" onClick={ () => setEditFlag(true) } className="bg-cyan-400 rounded-3xl flex justify-center 
                                items-center hover:scale-105 transition-transform duration-300 w-20">
                                edit
                            </button>
                        </div>
                    </div>
                    <div className="bg-slate-500 text-white text-xl font-bold flex justify-center items-center h-16 shrink-0 p-3 rounded-3xl">
                        { loadedData.record }
                    </div>
                </motion.div>
            }
        </>
    )
}
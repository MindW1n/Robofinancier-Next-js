import { useState } from "react"
import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"

export default function TaskForm({ onSubmit, onCancel, onDelete, databaseFunction, placeholder, waitForDatabase })
{
    const [record, setRecord] = useState("")
    const [incorrectInput, setIncorrectInput] = useState("")

    const handleSubmit = async () => {

        if(!record) {

            setIncorrectInput("You need to write the task...")
            return
        } 

        if(waitForDatabase) onSubmit((await databaseFunction(record)).data.task)
        
        else {

            databaseFunction(record)
            onSubmit({ record: record, updatedAt: new Date().toISOString() })
        }
    }

    return (
        <motion.div { ...fadeInOut } layout className="w-3/5 rounded-3xl bg-white flex flex-col items-center space-y-4 p-3">
            <textarea className="bg-slate-400 rounded-3xl w-full h-28 p-3 text-white placeholder-white font-bold text-xl" 
                placeholder="Write your new task here: ..." defaultValue={ placeholder ? placeholder.record : "" } onChange={ (event) => setRecord(event.target.value) }/>
            <button type="button" className="bg-blue-700 w-1/2 createAllocationInput
                hover:scale-105 transform transition-transform duration-300" onClick={ handleSubmit }>Submit</button>
            { onDelete ? <button type="button" className="bg-rose-500 w-1/2 createAllocationInput
                hover:scale-105 transform transition-transform duration-300" onClick={ onDelete }>Delete</button> : "" }
            <button type="button" className="bg-orange-500 w-1/2 createAllocationInput 
                hover:scale-105 transform transition-transform duration-300" onClick={ onCancel }>Cancel</button>
        </motion.div>
    )
}
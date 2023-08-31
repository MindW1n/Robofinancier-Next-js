import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import { useState } from "react"
import TaskForm from "../taskForm/component"
import Task from "../task/component"
const axios = require("@/libs/axios").default.axios

export default function CreatedTask({ index, onDelete, session })
{
    const [data, setData] = useState(null)

    const handleSubmit = (data) => setData(data)

    const databaseFunction = async (record) => {
        
        return await axios.post("/api/createTask", { userId: session.user.id, record: record})
    }

    const handleDeletion = () => onDelete(index)

    return (
        <motion.div { ...fadeInOut } layout className="w-full flex justify-center" >
            { !data 
            ? <TaskForm onCancel={ handleDeletion } onSubmit={ handleSubmit } index={ index } databaseFunction={ databaseFunction }
                  waitForDatabase={ true }/>
            : <Task data={ data } key={ data.id } onDelete={ handleDeletion } index={ index }/> }
        </motion.div>
    )
}
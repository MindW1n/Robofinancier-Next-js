"use client"
import { useCallback, useEffect, useState } from "react"
import CreateTaskButton from "../createTaskButton/component"
import Task from "../task/component"
import CreatedTask from "../createdTask/component"
import { AnimatePresence } from "framer-motion"

export default function TasksBoard({ session })
{
    const handleCreatedTaskDeletion = (index) => setCreatedTasks(prevs => prevs.filter(task => task.props.index != index))
    const handleLoadedTaskDeletion = (index) => setLoadedTasks(prevs => prevs.filter(task => task.props.index != index))
    const [loadedTasks, setLoadedTasks] = useState([])
    const [createdTasks, setCreatedTasks] = useState([])

    useEffect(() => {

        (async () => {

            const loadedTasks = (await (await fetch("http://localhost:3000/api/getTasks", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                next: { tags: ["tasks"] },
                body: JSON.stringify({  userId: session.user.id })

            })).json()).tasks

            setLoadedTasks(loadedTasks.map(data => <Task data={ data } key={ data.id } onDelete={ handleLoadedTaskDeletion } index={ data.id }/>))
        })()
    }, [])
    
    const handleTaskCreation = useCallback(() => setCreatedTasks(tasks => {
        
        const timestamp = Date.now()
        return [<CreatedTask key={ timestamp } index={ timestamp } onDelete={ handleCreatedTaskDeletion } session={ session } />, ...tasks]
    }), [createdTasks])
     
    return (

        <div className="w-full flex flex-col flex-grow rounded-3xl items-center space-y-6 overflow-y-scroll">
            <CreateTaskButton key="create-task-button" onClick={ handleTaskCreation } />
            <AnimatePresence>
                { createdTasks }
                { loadedTasks }
            </AnimatePresence>
        </div>
    )
}
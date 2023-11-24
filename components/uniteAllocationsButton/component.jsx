"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"

export default function UniteAllocationsButton({ selectedAllocationsData, session, onSubmit })
{

    const [formFlag, setFormFlag] = useState(false)
    const [name, setName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleUnite = () => { 
        
        const remindFlag = selectedAllocationsData[0].remindToPutTo

        for(let i = 1; i < selectedAllocationsData.length; i++ ) {

            if(selectedAllocationsData[i].remindToPutTo != remindFlag) {

                setErrorMessage("All selected allocaitons must be with the same remind flag!")
                return
            }
        }

        fetch("/api/createAllocationsGroup", { 
            
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { userId: session.user.id, name: name, allocationsIds: selectedAllocationsData.map(allocation => allocation.id) } 
        
        }).then((response) => {

            const allocationsGroup = response.data.allocationsGroup

            if(!allocationsGroup) {

                setErrorMessage("Group with this name already exists!")
                return
            }

            setFormFlag(false)
            setErrorMessage("")
            setName("")
            onSubmit(allocationsGroup)
        })
    }

    return (
        <motion.div layout { ...fadeInOut }>
            <button className={ "transition-all duration-300 hover:scale-105 rounded-3xl h-20 text-xl font-extrabold m-4 p-3"
                + (formFlag ? " hidden" : "") 
                + ( selectedAllocationsData.length ? " bg-cyan-500 text-white" : " bg-cyan-700 text-slate-300")}
                onClick={ selectedAllocationsData.length ? () => setFormFlag(true) : undefined }>
                Unite selected allocations
            </button>
            <div className={ (formFlag ? "" : "hidden ") 
                + "bg-white flex flex-col space-y-4 transition-all duration-300 hover:scale-105 rounded-3xl h-fit text-xl font-extrabold m-4 p-3" } >
                { errorMessage ? <div className="bg-red-500 text-sm text-center rounded-3xl text-white p-3">{ errorMessage }</div> : ""}
                <div className="flex flex-row text-base"> 
                    <input className="bg-slate-400 createAllocationInput w-2/3" type="text" placeholder="Group name" 
                        value={ name } onChange={ (event) => setName(event.target.value) }/>
                    <button className="bg-blue-700 createAllocationInput ml-4 text-lg" type="button" 
                        onClick={ handleUnite }>Submit</button>
                </div>
                <button className="bg-orange-500 transition-all duration-300 hover:scale-105 
                    text-white ml-2 h-auto rounded-3xl font-extrabold items-center p-1 px-3" type="button" 
                    onClick={ () => { setFormFlag(false); setName(""); setErrorMessage("") }}>Cancel</button>
            </div>
        </motion.div>
    )
}

"use client"
import { useCallback, useState } from "react"
import Allocation from "../allocation/component"
import AllocationForm from "../allocationForm/component"
import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"

export default function CreatedAllocation({ session, index, onCancel, onDelete, onSelect})
{
    const [allocationData, setAllocationData] = useState({})

    const databaseFunction = useCallback(async (formData) => {
        
        return (await fetch("/api/createAllocation", { 
                
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: {

                userId: session.user.id,
                name: formData.name,
                percent: Number(formData.percent),
                money: Number(formData.money),
                remindToPutTo: formData.remindToPutTo,
                currency: formData.currency
            }
    
        })).data.allocation

    }, [])
    
    const onSubmit = useCallback((allocationData) => setAllocationData(allocationData), [])

    return (

        <motion.div layout { ...fadeInOut }>  
            { !Object.keys(allocationData).length 
                ? <AllocationForm databaseFunction={ databaseFunction } onCancel={ () => onCancel(index) } onSubmit={ onSubmit }/>
                : <Allocation data={ allocationData } onSelect={ onSelect } onDelete={ onDelete } index={ index }/>  
            }
        </motion.div>
    )
}
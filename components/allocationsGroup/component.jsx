"use client"
import { useCallback, useEffect, useState } from "react"
import Allocation from "../allocation/component"
import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import PutOnAccountButton from "../putOnAccountButton/component"
const axios = require("@/libs/axios").default.axios

export default function AllocationsGroup({ data, onDelete, index, ununiteAllocations })
{
    const [selectedAllocationsData, setSelectedAllocationsData] = useState([])
    const [moneyToPut, setMoneyToPut] = useState(data.allocationsData.reduce((money, allocaiton) => money + allocaiton.moneyToPut, 0))

    const removeAllocation = (allocationIndex) => { 
        
        setAllocations(allocations => { return allocations.filter((value) => { return value.props.index != allocationIndex }) })
    }

    const allocationHandleSelect = useCallback((allocationData, active) => {

        if(!active) setSelectedAllocationsData(allocationsData => [...allocationsData, { ...allocationData }])

        else setSelectedAllocationsData(allocationsData => { return allocationsData.filter((value) => value.id != allocationData.id) })
    }, [])

    const [allocations, setAllocations] = useState(data.allocationsData.map(
        
        (allocationData) => <Allocation data={ allocationData } key={ allocationData.id } index={ allocationData.id } onDelete={ removeAllocation }
            onSelect={ allocationHandleSelect } />
    ))

    const handlePutOnAccount = (amount) => setAllocations(prevAllocations => {

            const newAllocations = prevAllocations.map(allocation => {

                const difference = amount * allocation.props.data.moneyToPut / moneyToPut
                const newMoney = allocation.props.data.money + difference
                const newMoneyToPut = allocation.props.data.moneyToPut - difference
                axios.post("/api/editAllocation", { id: allocation.props.data.id, money: newMoney, moneyToPut: newMoneyToPut })
                return <Allocation { ...allocation.props } data={{ ...allocation.props.data, money: newMoney, moneyToPut: newMoneyToPut }} 
                    key={ allocation.props.id }/>
            })

            setMoneyToPut(moneyToPut - amount)
            return newAllocations
    })

    useEffect(() => {

        if(allocations.length == 0) {
            
            onDelete(index)
            axios.post("/api/deleteAllocationsGroup", { id: data.allocationsData[0].allocationsGroupId })
        }
        
    }, [allocations])

    const handleUnunite = () => axios.post("/api/ununiteAllocations", 
        { allocationsGroupId: data.allocationsData[0].allocationsGroupId, allocationsIds: selectedAllocationsData.map(allocation => allocation.id) })
        .then(() => {

            selectedAllocationsData.map(allocation => removeAllocation(allocation.id))
            ununiteAllocations(selectedAllocationsData.map(data => ({ ...data, allocationsGroupId: null })))
            setSelectedAllocationsData([])
        })

    return (

        <motion.div layout { ...fadeInOut } className="bg-slate-400 flex flex-col rounded-3xl m-4">
            { moneyToPut  
                ?   <div className="m-4">
                        <PutOnAccountButton moneyToPut={ moneyToPut } currency={ (data.allocationsData[0].currency == "Rouble" ? "₽" : (data.allocationData[0].currency == "Dollar" ? "$" : "€")) } 
                            onSubmit={ handlePutOnAccount }/>
                    </div>
                : "" }
            <div className="h-fit m-4 p-3 text-black bg-slate-300 rounded-3xl font-extrabold">
                <div className="ml-3 text-lg">
                    <span>{ data.name }</span>
                </div>
            </div>
                { allocations }
            <button type="button" className={ "text-lg m-4 rounded-3xl font-extrabold transition-all hover:scale-105 duration-300 h-10" 
                + (!selectedAllocationsData.length ? " bg-red-800 text-slate-300" : " bg-red-500 text-white" )} onClick={ handleUnunite }>
                Ununite allocations
            </button> 
        </motion.div>
    )
}
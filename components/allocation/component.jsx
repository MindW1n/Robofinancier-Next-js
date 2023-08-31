"use client"
import { memo, useCallback, useState } from "react"
import AllocationForm from "../allocationForm/component"
import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import PutOnAccountButton from "../putOnAccountButton/component"
const axios = require("@/libs/axios").default.axios

const Allocation = memo(({ data, index, onDelete, onSelect }) => {

    const [editFormFlag, setEditFormFlag] = useState(false)
    const [allocationData, setAllocationData] = useState(data)
    const [active, setActive] = useState(false)
    const moneyString = String(allocationData.money.toFixed(2))
    const currency = (allocationData.currency == "Rouble" ? "₽" : (allocationData.currency == "Dollar" ? "$" : "€"))

    const databaseFunction = useCallback(async (formData) => {
        
        return (await axios.post("/api/editAllocation", { 
                
            id: data.id,
            name: formData.name,
            percent: Number(formData.percent),
            money: Number(formData.money),
            remindToPutTo: formData.remindToPutTo,
            currency: formData.currency
    
        })).data.allocation
    }, [])

    const onSubmit = useCallback((allocationData) => {

        setAllocationData(allocationData)
        setEditFormFlag(false)
    }, [])

    const handleDelete = useCallback(() => {

        axios.post("/api/deleteAllocation", { id: data.id })
        onDelete(index)
    }, [])

    const handlePutOnAccount = (amount) => {

        const newMoneyToPut = allocationData.moneyToPut - amount
        const newMoney = allocationData.money + amount
        axios.post("/api/editAllocation", { id: allocationData.id, moneyToPut: newMoneyToPut, money: newMoney })
        setAllocationData({ ...allocationData, moneyToPut: newMoneyToPut, money: newMoney })
    }

    return (

        <motion.div layout { ...fadeInOut }>
            { editFormFlag 
                ?   <AllocationForm databaseFunction={ databaseFunction } onCancel={ () => setEditFormFlag(false) } onDelete={ handleDelete }
                        onSubmit={ onSubmit } placeholder={ ...allocationData }/> 
                :   <div className="h-fit bg-white font-bold rounded-3xl m-4 p-3 flex flex-col hover:scale-105 transform duration-300">
                        { !allocationData.allocationsGroupId && allocationData.moneyToPut
                          ? <div className="mb-6">
                                <PutOnAccountButton currency={ currency } moneyToPut={ allocationData.moneyToPut } onSubmit={ handlePutOnAccount }/> 
                            </div>
                          : "" }
                        <div className="flex flex-row h-fit">
                            <div className="w-2/3">
                                <div className="bg-blue-700 h-auto rounded-3xl w-fit text-white font-extrabold items-center p-1 px-3">
                                    { allocationData.name }
                                </div>
                            </div>
                            <div className="text-center w-1/3 text-xl flex justify-end mr-3">
                                { allocationData.percent + "%" }
                            </div>
                        </div>  
                        { moneyString.length > 6 && typeof allocationData.allocationsGroupId == "number" || moneyString.length >= 9 
                            ?   <div className="w-full my-2 ml-2">
                                    <div className="font-bold w-fit text-xl">
                                        { allocationData.money.toFixed(2) + currency } 
                                    </div>
                                </div> : "" }
                        <div className=" text-xl flex flex-row space-y-4">
                            { moneyString.length <= 9 && typeof allocationData.allocationsGroupId != "number" || moneyString.length <= 6
                                ?   <div className="w-1/3">
                                        <div className="font-bold ml-4 mt-4 w-fit text-xl">
                                            { allocationData.money.toFixed(2) + (allocationData.currency == "Rouble" ? "₽" : (allocationData.currency == "Dollar" ? "$" : "€"))}
                                        </div>
                                    </div> : "" }
                            <div className={ "flex flex-row justify-end space-x-3 pr-2" + (moneyString.length <= 5 ? " w-2/3" : " w-full") }>
                                <button type="button" onClick={ () => setEditFormFlag(true) } className="bg-cyan-400 rounded-3xl flex justify-center 
                                    items-center hover:scale-105 transition-transform duration-300 w-16">
                                    edit
                                </button>
                                { onSelect ? <button type="button" className= { "transition-all duration-300 border border-slate-500 h-7 w-7 rounded-full" 
                                    + (active ? " bg-green-400" : "") } onClick={ () => { setActive(!active); 
                                    onSelect({ ...data, index }, active) } }></button> : <></> }
                            </div>
                        </div>
                    </div> }
        </motion.div>
    )
})

export default Allocation
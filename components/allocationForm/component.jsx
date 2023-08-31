"use client"
import { useState } from "react"

export default function AllocationForm({ databaseFunction, onCancel, onDelete, onSubmit, placeholder})
{
    const [name, setName] = useState(placeholder?.name ? placeholder.name : "")
    const [percent, setpercent] = useState(placeholder?.percent ? placeholder.percent : "")
    const [money, setMoney] = useState(placeholder?.money != undefined ? String(placeholder.money) : "0")
    const [currency, setCurrency] = useState(placeholder?.currency ? placeholder.currency : "Rouble")
    const [remindToPutTo, setRemindToPutTo] = useState(placeholder?.remindToPutTo || false)
    const [incorrectInputValue, setIncorrectInputValue] = useState("")

    const handleSubmit = () => {

        if(!name || !percent || !money || !currency) {

            setIncorrectInputValue("All inputs must be completed!")
            return
        }

        if(percent <= 0) {

            setIncorrectInputValue("Percent must be more than 0!")
            return
        }
        
        (async () => {

            const allocation = await databaseFunction({ name, percent, money, remindToPutTo, currency })

            if(!allocation) { 
                
                setIncorrectInputValue("Incorrect data!")
                return
            }

            onSubmit(allocation)
        })()
    }

    return (

        <div className="w-[calc(100% - 24px)] h-fit bg-white rounded-3xl m-4 p-3 flex flex-col hover:scale-105 transform duration-300 space-y-4">
            <div className={ "bg-red-500 w-full createAllocationInput flex justify-center items-center text-center" + (incorrectInputValue ? "" : " hidden") }>
                { incorrectInputValue }
            </div>
            <div className="flex flex-row space-x-3 h-fit">
                <input type="text" className="bg-blue-700 w-4/6 createAllocationInput"
                    defaultValue={ placeholder?.name ? placeholder.name : "" } placeholder="Name" onChange={ (event) => setName(event.target.value) }/>
                <div className="bg-slate-400 w-2/6 createAllocationInput text-sm flex flex-row justify-end">
                    <input type="number" className="bg-slate-400 text-white placeholder-white w-full focus:outline-none" 
                    defaultValue={ (placeholder?.percent ? placeholder.percent : "0") } onChange={ (event) => setpercent(event.target.value) }/> %
                </div>
            </div>
            <div className="flex flex-row space-x-3 h-fit">
                <input type="number" className="bg-slate-400 w-4/6 createAllocationInput" 
                    defaultValue={ placeholder?.money != undefined ? String(placeholder.money) : "" }
                    placeholder="Money (0)" onChange={ (event) => setMoney(event.target.value) }/>
                <select className="bg-slate-400 w-2/6 createAllocationInput" 
                    defaultValue={ placeholder?.currency ? placeholder.currency : "" }
                    placeholder="₽, $, €" onChange={ (event) => setCurrency(event.target.value) }>
                    <option value="Rouble">₽</option>
                    <option value="Dollar">$</option>
                    <option value="Euro">€</option>
                </select> 
            </div>  
            <div className="flex flex-row space-x-3 h-fit">
                <p className="ml-4 w-4/6">Remind to put to?</p>
                <input type="checkbox" className="bg-slate-400 w-7 rounded-t-full" onChange={ () => setRemindToPutTo(!remindToPutTo) }
                    defaultChecked={ placeholder?.remindToPutTo ? true : false }/>
            </div>
            <button type="button" className="bg-blue-700 w-full createAllocationInput
                hover:scale-105 transform transition-transform duration-300" onClick={ handleSubmit }>Submit</button>
            { onDelete ? <button type="button" className="bg-rose-500 w-full createAllocationInput
                hover:scale-105 transform transition-transform duration-300" onClick={ onDelete }>Delete</button> : "" }
            <button type="button" className="bg-orange-500 w-full createAllocationInput
                hover:scale-105 transform transition-transform duration-300" onClick={ onCancel }>Cancel</button>
        </div>
    )
}
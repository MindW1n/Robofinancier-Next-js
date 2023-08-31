import { useState } from "react"
import { motion } from "framer-motion"

export default function PutOnAccountButton({ moneyToPut, currency, onSubmit })
{
    const [formFlag, setFormFlag] = useState(false)
    const [amount, setAmount] = useState(String(moneyToPut))
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = () => {

        const amountNumber = Number(amount) 
        if(!amountNumber || amountNumber <= 0){ setErrorMessage("You need to enter the amount to put to account more than 0 in current currency!"); return }
        if(amountNumber > moneyToPut) { setErrorMessage("Amount you entered is more than money you need to put!"); return }
        setFormFlag(false)
        setAmount(String(moneyToPut - amountNumber))
        onSubmit(amountNumber)
    }

    return (  
       
        <motion.div layout className="h-fit">
            <button className={ "w-full h-12 text-white bg-rose-500 rounded-3xl flex justify-center items-center p-1 font-extrabold text-lg"
                + "transition-all duration-300 hover:scale-105" + (formFlag ? " hidden" : "") } onClick={ () => setFormFlag(true) }>
                { "Put " + moneyToPut + currency }
            </button>
            <div className={ (formFlag ? "" : "hidden ") + " transition-all duration-300"
                + " bg-slate-500 flex flex-col space-y-4 rounded-3xl h-fit text-xl font-extrabold p-3" } >
                { errorMessage ? <div className="bg-red-500 text-sm text-center rounded-3xl text-white p-3">{ errorMessage }</div> : ""}
                <div className="flex flex-row text-base"> 
                    <input className="bg-slate-400 createAllocationInput w-2/3" type="text" value={ amount }
                        onChange={ (event) => setAmount(event.target.value) }/>
                    <button className="bg-blue-700 createAllocationInput ml-4 text-lg" type="button" 
                        onClick={ handleSubmit }>Submit</button>
                </div>
                <button className="bg-orange-500 transition-all duration-300 hover:scale-105 
                    text-white ml-2 h-auto rounded-3xl font-extrabold items-center p-1 px-3" type="button" 
                    onClick={ () => { setFormFlag(false); setAmount(String(moneyToPut)); setErrorMessage("") }}>Cancel</button>
            </div>
        </motion.div>
    )
}
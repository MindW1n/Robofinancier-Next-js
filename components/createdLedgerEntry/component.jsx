import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import { useState } from "react"
import LedgerEntry from "../ledgerEntry/component"
import LedgerForm from "../ledgerForm/component"

export default function CreatedLedgerEntry({ session, index, onDelete })
{
    const [ledgerEntry, setLedgerEntry] = useState()

    const databaseFunction = async (data) => { return (await fetch("/api/createLedgerEntry", {
        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data

    })).data.ledgerEntry }

    return (

        <motion.div layout { ...fadeInOut } >  
            { ledgerEntry 
              ? ledgerEntry 
              : <LedgerForm onSubmit={ (data) => setLedgerEntry(<LedgerEntry data={ data } session={ session } index={ index } onDelete={ onDelete }/>) } 
                    session={ session } index={ index } onCancel={ onDelete } databaseFunction={ databaseFunction } /> }  
        </motion.div>
    )
}
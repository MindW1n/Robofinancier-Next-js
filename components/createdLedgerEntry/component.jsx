import { motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import { useState } from "react"
import LedgerEntry from "../ledgerEntry/component"
import LedgerForm from "../ledgerForm/component"
const axios = require("@/libs/axios").default.axios

export default function CreatedLedgerEntry({ session, index, onDelete })
{
    const [ledgerEntry, setLedgerEntry] = useState()

    const databaseFunction = async (data) => { return (await axios.post("/api/createLedgerEntry", data)).data.ledgerEntry }

    return (

        <motion.div layout { ...fadeInOut } >  
            { ledgerEntry 
              ? ledgerEntry 
              : <LedgerForm onSubmit={ (data) => setLedgerEntry(<LedgerEntry data={ data } session={ session } index={ index } onDelete={ onDelete }/>) } 
                    session={ session } index={ index } onCancel={ onDelete } databaseFunction={ databaseFunction } /> }  
        </motion.div>
    )
}
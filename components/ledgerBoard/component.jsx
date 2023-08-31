"use client"
import { useEffect, useState } from "react"
import CreatedLedgerEntry from "../createdLedgerEntry/component" 
import CreateLedgerEntryButton from "../createLedgerEntryButton/component"
import { AnimatePresence } from "framer-motion"
import LedgerEntry from "../ledgerEntry/component"

export default function LedgerBoard({ session })
{
    const [createdLedgerEntries, setCreatedLedgerEntries] = useState([])
    const [loadedLedgerEntries, setLoadedLedgerEntries] = useState([])

    useEffect(() => {

        (async () => {

            const loadedLedgerEntries = (await (await fetch("http://localhost:3000/api/getLedgerEntries", {

                method: "POST",
                next: { tags: ["ledgerEntries"] },
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  userId: session.user.id, orderBy: { date: "desc" } })

            })).json()).ledgerEntries

            setLoadedLedgerEntries(loadedLedgerEntries.map(ledgerEntryData => 
                <LedgerEntry data={ ledgerEntryData } key={ ledgerEntryData.id } index={ ledgerEntryData.id } session={ session } 
                    onDelete={ removeLoadedLedgerEntry } />))
        })()
    }, [])

    const removeComponent = (components, index) => { return components.filter(component => { return component.props.index != index }) }

    const removeCreatedLedgerEntry = (index) => setCreatedLedgerEntries(prevEntries => removeComponent(prevEntries, index))

    const removeLoadedLedgerEntry = (index) => setLoadedLedgerEntries(prevEntries => removeComponent(prevEntries, index))

    const createLedgerEntry = () => setCreatedLedgerEntries(entries => {
    
        const timestamp = Date.now()
        return [<CreatedLedgerEntry key={ timestamp } index={ timestamp } session={ session } onDelete={ removeCreatedLedgerEntry } />, ...entries]
    })

    

    return (

        <div className="w-full h-full bg-gray-300 rounded-3xl p-4 overflow-y-auto mt-4">
            <div className="grid grid-cols-4 gap-y-4">
                <AnimatePresence>
                    <CreateLedgerEntryButton onClick={ createLedgerEntry } key="create-ledger-entry-button"/>
                    { createdLedgerEntries }
                    { loadedLedgerEntries }
                </AnimatePresence>
            </div>
        </div>
    )
}
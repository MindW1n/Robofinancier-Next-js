import { useEffect, useState } from "react"

export default function LedgerForm({ session, index, databaseFunction, placeholder, onCancel, onSubmit, onDelete })
{
    const [categories, setCategories] = useState([])
    const [allocations, setAllocations] = useState([])
    const [allocationsGroups, setAllocationsGroups] = useState([])
    const [date, setDate] = useState(placeholder ? placeholder.date.slice(0, 10) : "")
    const [amount, setAmount] = useState(placeholder ? placeholder.amount : "0")
    const [categoryName, setCategoryName] = useState("")
    const [record, setRecord] = useState(placeholder ? placeholder.record : "")
    const [selectedCategory, setSelectedCategory] = useState(placeholder ? String(placeholder.categoryId) : "new")
    const [selectedAllocation, setSelectedAllocation] = useState(placeholder?.allocationId ? "allocation " + placeholder.allocationId : "all")
    const [incorrectInputValue, setIncorrectInputValue] = useState("")

    useEffect(() => {

        fetch("/api/getCategories", { 
            
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id })
        
        }).then((response) => response.json()).then((data) => setCategories(data.categories))

        fetch("/api/getAllocations", { 
            
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id })
        
        }).then((response) => response.json()).then((data) => setAllocations(data.allocations))

        fetch("/api/getAllocationsGroups", { 
            
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id })
        
        }).then((response) => response.json()).then((data) => setAllocationsGroups(data.allocationsGroups))

    }, [])

    const handleSubmit = async () => {

        let categoryId = selectedCategory
        
        if(selectedCategory == "new") {

            if(!categoryName) {

                setIncorrectInputValue("All inputs must be completed!")
                return
            }

            categoryId = (await fetch("/api/createCategory", { 
                
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id, name: categoryName })
            
            }).then((response) => response.json())).category.id

        }
        
        if(!date || !amount) {

            setIncorrectInputValue("All inputs must be completed!")
            return
        }

        const selectedAllocationValues = selectedAllocation.split(" ")

        if(selectedAllocationValues[0].charAt(0) == 'a') {

            var allocationId = Number(selectedAllocationValues[1])
            var allocationsGroupId = null
        }

        else {

            var allocationId = null
            var allocationsGroupId = Number(selectedAllocationValues[1])
        }

        const ledgerEntry = await databaseFunction({ 
            
            userId: session.user.id, 
            date: new Date(date).toISOString(), 
            amount: Number(amount), 
            record, 
            categoryId: Number(categoryId), 
            allocationId,
            allocationsGroupId
        }) 

        if(!ledgerEntry) { 
            
            setIncorrectInputValue("Incorrect data!")
            return
        }

        onSubmit(ledgerEntry)
    }

    return (

        <div className="w-96 bg-white rounded-3xl flex flex-col p-4 text-center h-full space-y-4">
            <div className={ "bg-red-500 w-full createAllocationInput flex justify-center items-center text-center" 
                + (incorrectInputValue ? "" : " hidden") }>
                { incorrectInputValue }
            </div>
            <div className="flex flex-row space-x-3">
                <input type="date" className="createAllocationInput bg-blue-700 w-1/2" onChange={ (event) => setDate(event.target.value) }
                    defaultValue={ date }/>
                <select className="transition-all duration-300 w-1/2 createAllocationInput bg-slate-400" 
                    onChange={ (event) => setSelectedAllocation(event.target.value) } value={ selectedAllocation }>

                    {   allocations.length ? [
                      
                            <option value="all" key="allocation all">All</option>,
                            <optgroup label="Allocations" key="allocations optgroup">
                                { allocations.map((allocation, index) => <option value={ "allocation " + String(allocation.id) } key={ "allocation " + index }>{ allocation.name }</option>) }
                            </optgroup>,
                            allocationsGroups.length 
                              ? <optgroup label="Allocations groups" key="groups optgroup">
                                    { allocationsGroups.map((allocationsGroup, index) => <option value={ "group " + String(allocationsGroup.id) } key={ "group" + index }>{ allocationsGroup.name }</option>)}
                                </optgroup> : ""

                        ] : <option value={ "none" } key="no allocations">No allocations</option> 
                    } 

                </select>
            </div>
            <div className="flex flex-row space-x-4">
                <input type="text" className="w-1/2 bg-slate-400 createAllocationInput" placeholder="Amount(0)" 
                    onChange={ (event) => setAmount(event.target.value) } defaultValue={ amount }/>
                <select className="w-1/2 bg-slate-400 createAllocationInput" onChange={ (event) => setSelectedCategory(event.target.value) }
                    value={ selectedCategory }>
                    { categories.map((category, index) => <option value={ category.id } key={ "category" + index}>{ category.name }</option>)}
                    <option value="new">New category</option>
                </select>
            </div>
            { selectedCategory == "new" 
                ?   
                    <div className="rounded-3xl bg-slate-300 p-4 space-x-4 text-white">
                        <input type="text" className="w-full bg-slate-400 createAllocationInput" placeholder="Name" 
                            onChange={ (event) => setCategoryName(event.target.value) }/>
                    </div>
                : "" }
            <textarea className="flex-grow bg-slate-400 createAllocationInput" placeholder="Record" 
                onChange={ (event) => setRecord(event.target.value) } defaultValue={ record }/>
            <button type="button" className="bg-blue-700 w-full createAllocationInput
                hover:scale-105 transition-transform duration-300" onClick={ handleSubmit }>Submit</button>
            { onDelete ? <button type="button" className="bg-rose-500 w-full createAllocationInput
                hover:scale-105 transform transition-transform duration-300" onClick={ onDelete }>Delete</button> : "" }
            <button type="button" className="bg-orange-500 w-full createAllocationInput
                hover:scale-105 transition-transform duration-300" onClick={ () => onCancel(index) }>Cancel</button>
        </div>
    )   
}
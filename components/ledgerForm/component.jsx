import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
const axios = require("@/libs/axios").default.axios

function isIncomeCategory(categories, categoryId)
{
    var i; for(i = 0; i < categories.length && categories[i].id != categoryId; i++);   
    return categories[i].type == "Income"
}

export default function LedgerForm({ session, index, databaseFunction, placeholder, onCancel, onSubmit, onDelete })
{
    const [categories, setCategories] = useState([])
    const [allocations, setAllocations] = useState([])
    const [date, setDate] = useState(placeholder ? placeholder.date.slice(0, 10) : "")
    const [amount, setAmount] = useState(placeholder ? placeholder.amount : "0")
    const [categoryName, setCategoryName] = useState("")
    const [categoryType, setCategoryType] = useState("Income")
    const [record, setRecord] = useState(placeholder ? placeholder.record : "")
    const [selectedCategory, setSelectedCategory] = useState(placeholder ? String(placeholder.categoryId) : "")
    const [selectedAllocation, setSelectedAllocation] = useState(placeholder?.allocationId ? placeholder.allocationId : "")
    const [incorrectInputValue, setIncorrectInputValue] = useState("")
    const [incomeFlag, setIncomeFlag] = useState(true)
    const [, setCategorySelectionCounter] = useState(0)

    useEffect(() => {

        axios.post("/api/getCategories", { userId: session.user.id })
            .then((response) => {

                if(!response.data.categories.length) setSelectedCategory("new")
                if(placeholder) setIncomeFlag(isIncomeCategory(response.data.categories, placeholder.categoryId))
                setCategories(response.data.categories)
            })

        axios.post("/api/getAllocations", { userId: session.user.id })
            .then((response) => {

                setAllocations(response.data.allocations)
                if(response.data.allocations.length && !selectedAllocation) setSelectedAllocation(String(response.data.allocations[0].id))
            })
    }, [])

    const handleSubmit = async () => {

        let categoryId = selectedCategory
        
        if(selectedCategory == "new") {

            if(!categoryName || !categoryType) {

                setIncorrectInputValue("All inputs must be completed!")
                return
            }

            categoryId = (await axios.post("/api/createCategory", { userId: session.user.id, name: categoryName, type: categoryType })).data.category.id
        }
        
        if(!date || !amount || !record) {

            setIncorrectInputValue("All inputs must be completed!")
            return
        }

        const ledgerEntry = await databaseFunction({ 
            
            userId: session.user.id, 
            date: date, 
            amount: Number(amount), 
            record, 
            categoryId: Number(categoryId ? categoryId : categories[0].id), 
            allocationId: !incomeFlag ? Number(selectedAllocation) : null
        }) 

        if(!ledgerEntry) { 
            
            setIncorrectInputValue("Incorrect data!")
            return
        }

        onSubmit(ledgerEntry)
    }

    const handleCategorySelection = (event) => {
        
        setSelectedCategory(event.target.value)

        if(event.target.value == "new") {

            setIncomeFlag(true)
            return
        }

        const desiredId = Number(event.target.value)
        setIncomeFlag(flag => {

            const newFlag = isIncomeCategory(categories, desiredId)
            
            if(flag != newFlag) setCategorySelectionCounter(counter => {

                if((counter + 1) % 3 == 0) toast("You can select allocation only when the category type is cost.", { icon: "⚠️" })
                return counter + 1
            })

            return newFlag
        })
    }

    const handleCreatedCategoryTypeSelection = (event) => setIncomeFlag(event.target.value[0] == "I" ? true : false)

    return (

        <div className="w-96 bg-white rounded-3xl flex flex-col p-4 text-center h-full space-y-4">
            <div className={ "bg-red-500 w-full createAllocationInput flex justify-center items-center text-center" 
                + (incorrectInputValue ? "" : " hidden") }>
                { incorrectInputValue }
            </div>
            <div className="flex flex-row space-x-3">
                <input type="date" className="createAllocationInput bg-blue-700 w-1/2" onChange={ (event) => setDate(event.target.value) }
                    defaultValue={ date }/>
                <select className={ "transition-all duration-300 w-1/2 createAllocationInput bg-slate-400 " + (incomeFlag ? "opacity-50" : "") } 
                    disabled={ incomeFlag }
                    onChange={ (event) => setSelectedAllocation(event.target.value) } value={ selectedAllocation } >
                    { allocations.length 
                      ? allocations.map((allocation, index) => <option value={ String(allocation.id) } key={ index }>{ allocation.name }</option>) 
                      : <option value={ "none" }>No allocations</option> } 
                </select>
            </div>
            <div className="flex flex-row space-x-4">
                <input type="text" className="w-1/2 bg-slate-400 createAllocationInput" placeholder="Amount(0)" 
                    onChange={ (event) => setAmount(event.target.value) } defaultValue={ amount }/>
                <select className="w-1/2 bg-slate-400 createAllocationInput" onChange={ (event) => handleCategorySelection(event)}
                    value={ selectedCategory }>
                    <optgroup label="Incomes categories:" key="incomes-optgroup">
                    { categories.filter(category => { return category.type == "Income" })
                        .map((category, index) => <option value={ String(category.id) } key={ "income-category-" + index }>{ category.name }</option>) }
                    </optgroup> 
                    <optgroup label="Costs categories:" key="costs-optgroup">
                    { categories.filter(category => { return category.type == "Cost" })
                        .map((category, index) => <option value={ String(category.id) } key={ "cost-category-" + index }>{ category.name }</option>) }
                    </optgroup>     
                    <option value="new">New category</option>
                </select>
            </div>
            { selectedCategory == "new" 
                ?   
                    <div className="flex flex-row rounded-3xl bg-slate-300 p-4 space-x-4 text-white">
                        <input type="text" className="w-3/5 bg-slate-400 createAllocationInput" placeholder="Name" 
                            onChange={ (event) => setCategoryName(event.target.value) }/>
                        <select type="text" className="w-2/5 bg-slate-400 createAllocationInput" defaultValue={ categoryType }
                            onChange={ (event) => { setCategoryType(event.target.value); handleCreatedCategoryTypeSelection(event) } }>
                            <option value={ "Income" }>Income</option>
                            <option value={ "Cost" }>Cost</option>
                        </select>
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
"use client"
import { useCallback, useEffect, useState } from "react"
import Allocation from "../allocation/component"
import CreateAllocationButton from "../createAllocationButton/component"
import AllocationsInfoBoard from "../allocationsInfoBoard/component"
import CreatedAllocation from "../createdAllocation/component"
import AllocationsGroup from "../allocationsGroup/component"
import UniteAllocationsButton from "../uniteAllocationsButton/component"
import { AnimatePresence } from "framer-motion"

export default function Sidebar({ session })
{
    const [createdAllocations, setCreatedAllocations] = useState([])
    const [selectedAllocationsData, setSelectedAllocationsData] = useState([])
    const [allocations, setAllocations] = useState([])
    const [allocationsGroups, setAllocationsGroups] = useState([])


    useEffect(() => {

        (async () => {

            const databaseRequests = [
                
                fetch("http://localhost:3000/api/getAllocations", {

                    method: "POST",
                    next: { tags: ["allocations"] },
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({  userId: session.user.id })

                }).then(response => response.json()), 
                
                fetch("http://localhost:3000/api/getAllocationsGroups", {

                    method: "POST",
                    next: { tags: ["allocationsGroups"] },
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({  userId: session.user.id })

                }).then(response => response.json())
            ]

            const [loadedAllocationsResponse, loadedAllocationsGroupsResponce] = await Promise.all(databaseRequests)
            let loadedAllocations = loadedAllocationsResponse.allocations
            const loadedAllocationsGroups = loadedAllocationsGroupsResponce.allocationsGroups
 
            let allocationsGroupsMap = {}

            for(const groupData of loadedAllocationsGroups) {

                if(!allocationsGroupsMap[groupData.id]) allocationsGroupsMap[groupData.id] = {}
                allocationsGroupsMap[groupData.id] = { name: groupData.name, allocationsData: [] }
            }

            for (const allocationData of loadedAllocations) {

                if (!allocationData.allocationsGroupId) continue
                allocationsGroupsMap[allocationData.allocationsGroupId].allocationsData.push(allocationData)
            }

            loadedAllocations = loadedAllocations.filter((value) => !value.allocationsGroupId)

            setAllocations(loadedAllocations.map(
            
                allocationData => <Allocation data={ allocationData } key={ allocationData.id } index={ allocationData.id } 
                    onDelete={ removeAllocation } onSelect={ allocationHandleSelect } animate={ true } />
            ))
            
            setAllocationsGroups(Object.values(allocationsGroupsMap).map(
            
                (allocationsGroupData) => <AllocationsGroup data={ allocationsGroupData } key={ Math.random().toString(36).substring(7) } 
                    index={ allocationsGroupData.id } onDelete={ removeAllocationsGroup } ununiteAllocations={ ununiteAllocations }/>
            ))
        })()
    }, [])

    const allocationHandleSelect = useCallback((allocationData, active) => {

        if(!active) setSelectedAllocationsData(allocationsData => [...allocationsData, { ...allocationData }])

        else setSelectedAllocationsData(allocationsData => { return allocationsData.filter((value) => value.id != allocationData.id) })
    }, [])

    const handleAllocationCreate = useCallback(() => {

        const timestamp = Date.now()

        setCreatedAllocations(createdAllocations =>  { return [...createdAllocations, <CreatedAllocation session={ session } 
            key={ timestamp } index={ timestamp } onCancel={ removeCreatedAllocation }
            onSelect={ allocationHandleSelect } onDelete= { removeCreatedAllocation } />] })
    }, [createdAllocations])

    const removeComponent = (components, index) => { return components.filter((value) => { return value.props.index != index }) }

    const removeCreatedAllocation = (index) => setCreatedAllocations(components => removeComponent(components, index))
 
    const removeAllocation = (index) => setAllocations(components => removeComponent(components, index))

    const removeAllocationsGroup = (index) => setAllocationsGroups(components => removeComponent(components, index))

    const ununiteAllocations = (ununitedAllocationsData) => {

        setAllocations(allocations => { 

            return [...allocations, ...ununitedAllocationsData.map(
            
                (allocationData) => <Allocation data={ allocationData } key={ allocationData.id }
                    index={ allocationData.id } onSelect={ allocationHandleSelect } onDelete= { removeAllocation }/>
            )]
        })
    }

    const uniteAllocations = useCallback((allocationsGroup) => {

        selectedAllocationsData.map(allocation => {
                
            removeAllocation(allocation.id)
            removeCreatedAllocation(allocation.index)
        })

        let data = {}
        data.allocationsData = selectedAllocationsData.map(allocation => ({ ...allocation, allocationsGroupId: allocationsGroup.id }))
        data.name = allocationsGroup.name

        setAllocationsGroups([...allocationsGroups, <AllocationsGroup data={ data } key={ Math.random().toString(36).substring(7) } 
            index={ selectedAllocationsData[0].id } onDelete={ removeAllocationsGroup } ununiteAllocations={ ununiteAllocations }/>])

        setSelectedAllocationsData([])
    }, [selectedAllocationsData])
    
    return (

        <div className="w-96 rounded-3xl bg-slate-600 overflow-y-auto flex flex-col m-3">
            <AnimatePresence>
                { (!allocations.length && !createdAllocations.length && !allocationsGroups.length)
                    ? <AllocationsInfoBoard key={ "allocations-info-board" } text="You have no allocations" /> 
                    : <UniteAllocationsButton selectedAllocationsData={ selectedAllocationsData } 
                        onSubmit={ uniteAllocations } session={ session } key={ "unite-allocations-button" }/> }
                { allocations }
                { allocationsGroups }
                { createdAllocations }
                <CreateAllocationButton onClick={ handleAllocationCreate } key={ "create-allocations-button" } />
            </AnimatePresence>
        </div>
    )
}
export function getMaxAllocationPercent(allocations, currentAllocationId) {

    let maxValue = 100

    for(let i = 0; i < allocations.length; i++) { 
        
        if(allocations[i].id == currentAllocationId) continue
        maxValue -= allocations[i].percent
    }
    
    return maxValue
}
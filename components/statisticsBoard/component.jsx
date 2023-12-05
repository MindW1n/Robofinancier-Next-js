"use client"
import { Line, Pie } from "react-chartjs-2"
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from "chart.js"
import { AnimatePresence, motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import { greenShades, redShades } from "../colorsSets/component"
import { useEffect, useState } from "react"
import Filter from "../filter/component"
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement)

let [loadedLedgerEntries, loadedCategories] = [[], []]

export default function StatisticsBoard({ session })
{
    const [statistics, setStatistics] = useState([])
    const [incomesCategoriesMap, setIncomesCategoriesMap] = useState([])
    const [costsCategoriesMap, setCostsCategoriesMap] = useState([])

    const [scope, setScope] = useState({ 
        
        fromDate: (() => { 
            
            let date = new Date()
            date.setDate(1)
            return date

        })(),

        toDate: (() => { 
            
            let date = new Date()
            date.setDate(31)
            return date
            
        })(),
    })

    const getStatistics = () => {

        let [incomesCategoriesMap, costsCategoriesMap, loadedCategoriesMap] = [{}, {} ,{}]
        loadedCategories.map((category) => { loadedCategoriesMap[category.id] = { name: category.name } })

        let total = 0
        let statistics = []

        for(let i = 0; i < loadedLedgerEntries.length; i++) {

            total += loadedLedgerEntries[i].amount
            let entryDate = new Date(loadedLedgerEntries[i].date)

            if(entryDate >= scope.fromDate && entryDate <= scope.toDate) {

                if(loadedLedgerEntries[i].amount > 0) {

                    if(!incomesCategoriesMap.hasOwnProperty(loadedLedgerEntries[i].categoryId)) 
                        incomesCategoriesMap[loadedLedgerEntries[i].categoryId] = { name: loadedCategoriesMap[loadedLedgerEntries[i].categoryId].name, total: 0 }

                    incomesCategoriesMap[loadedLedgerEntries[i].categoryId].total += loadedLedgerEntries[i].amount
                }

                else {
                    
                    if(!costsCategoriesMap.hasOwnProperty(loadedLedgerEntries[i].categoryId))
                        costsCategoriesMap[loadedLedgerEntries[i].categoryId] = { name: loadedCategoriesMap[loadedLedgerEntries[i].categoryId].name, total: 0 }

                    costsCategoriesMap[loadedLedgerEntries[i].categoryId].total += loadedLedgerEntries[i].amount
                }

                statistics.push({ date: loadedLedgerEntries[i].date, money: total })
            }

        } 

        setStatistics(statistics)
        setIncomesCategoriesMap(incomesCategoriesMap)
        setCostsCategoriesMap(costsCategoriesMap)
    }

    useEffect(() => {
    
        (async () => {

            loadedLedgerEntries = (await fetch("/api/getLedgerEntries", {

                method: "POST",
                next: { tags: ["ledgerEntries"] },
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  userId: session.user.id, orderBy: { date: "asc" } })

            }).then((response) => response.json())).ledgerEntries

            loadedCategories = (await fetch("/api/getCategories", {

                method: "POST",
                next: { tags: ["categories"] },
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  userId: session.user.id })

            }).then((response) => response.json())).categories

            getStatistics()

        })()

    }, [])

    useEffect(() => getStatistics(), [scope])

    const filterOnSubmit = (fromDate, toDate) => setScope({ fromDate, toDate })

    return (
    
        <AnimatePresence>
            <div className="w-full flex-1 bg-gray-300 rounded-3xl mt-5 flex flex-col overflow-y-auto">
                <div className="h-full overflow-y-auto">
                    <Filter onSubmit={ filterOnSubmit } defaultValue={ { fromDate: scope.fromDate?.toISOString().slice(0, 10), toDate: scope.toDate?.toISOString().slice(0, 10) } }/>
                    <motion.div key="amount-line-chart" { ...fadeInOut } className="h-96 m-4 rounded-3xl bg-slate-500">
                        <Line 
                            
                            data={{
                                
                                labels: statistics.map(value => value.date.slice(0, 10)),

                                datasets: [{

                                    label: "Account amount",
                                    data: statistics.map(value => value.money),
                                    backgroundColor: "rgb(34, 211, 238)",
                                    borderColor: "rgb(37, 99, 235)",
                                    borderWidth: 5
                                }]
                            }} 
                                
                            options={{ 

                                responsive: true,
                                aspectRatio: 4.063829787,

                                scales: {

                                    x: { 
                                        
                                        grid: { color: "rgb(160, 160, 160)" },

                                        ticks: { 
                                            
                                            color: "rgb(233, 233, 233)",
                                            font: { weight: "bold" }
                                        }
                                    },

                                    y: { 
                                        
                                        grid: { color: "rgb(160, 160, 160)" },

                                        ticks: { 
                                            
                                            color: "rgb(233, 233, 233)",
                                            font: { weight: "bold" } 
                                        }
                                    }
                                },

                                plugins: { legend: { labels: { 
                                    
                                    color: "rgb(233, 233, 233)",
                                    font: { weight: "bold" }
                                }}}
                            }} 
                        />
                    </motion.div>
                    <div className="" style={{ height: "35rem"}}>
                        <div className="flex flex-row h-full w-full">
                            <AnimatePresence>
                                <motion.div key="incomes-pie-chart" { ...fadeInOut } className="m-4 rounded-3xl bg-slate-500 w-1/2 flex justify-center">
                                    <Pie 
                                        data={{ 
                                            
                                            labels: Object.entries(incomesCategoriesMap).map(category => category[1].name),

                                            datasets: [{

                                                    data: Object.entries(incomesCategoriesMap).map(category => category[1].total),
                                                    backgroundColor: greenShades
                                            }]
                                        }}
                                        options={{

                                            plugins: { legend: { labels: { 
                                                
                                                color: "rgb(233, 233, 233)",
                                                font: { weight: "bold" }
                                            }}}
                                        }}
                                    />
                                </motion.div>
                                <motion.div key="costs-pie-chart" { ...fadeInOut } className="m-4 rounded-3xl bg-slate-500 w-1/2 flex justify-center">
                                    <Pie 
                                        data={{ 
                                            
                                            labels: Object.entries(costsCategoriesMap).map(category => category[1].name),

                                            datasets: [{

                                                    data: Object.entries(costsCategoriesMap).map(category => category[1].total),
                                                    backgroundColor: redShades
                                            }]
                                        }}
                                        options={{

                                            plugins: { legend: { labels: { 
                                                
                                                color: "rgb(233, 233, 233)",
                                                font: { weight: "bold" }
                                            }}}
                                        }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    )
}
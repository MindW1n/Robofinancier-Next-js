"use client"
import { Line, Pie } from "react-chartjs-2"
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from "chart.js"
import { AnimatePresence, motion } from "framer-motion"
import { fadeInOut } from "../animations/component"
import { greenShades, redShades } from "../colorsSets/component"
import { useEffect, useState } from "react"
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement)

export default function StatisticsBoard({ session })
{
    const [statistics, setStatistics] = useState([])
    const [incomesCategoriesMap, setIncomesCategoriesMap] = useState([])
    const [costsCategoriesMap, setCostsCategoriesMap] = useState([])

    useEffect(() => {

        (async () => {

            const loadedLedgerEntries = (await (await fetch("http://localhost:3000/api/getLedgerEntries", {

                method: "POST",
                next: { tags: ["ledgerEntries"] },
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  userId: session.user.id, orderBy: { date: "asc" } })

            })).json()).ledgerEntries

            const loadedCategories = (await (await fetch("http://localhost:3000/api/getCategories", {

                method: "POST",
                next: { tags: ["categories"] },
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  userId: session.user.id })

            })).json()).categories

            let incomesCategoriesMap = {}
            let costsCategoriesMap = {}
            let total = 0
            let statistics = []

            for(const category of loadedCategories) {
                
                if(category.type[0] == 'I') incomesCategoriesMap[category.id] = { name: category.name, total: 0 }
                else costsCategoriesMap[category.id] = { name: category.name, total: 0 }
            }

            for(let i = 0; i < loadedLedgerEntries.length; i++) {

                if(incomesCategoriesMap.hasOwnProperty(loadedLedgerEntries[i].categoryId)) {

                    incomesCategoriesMap[loadedLedgerEntries[i].categoryId].total += loadedLedgerEntries[i].amount
                    total += loadedLedgerEntries[i].amount
                }

                else {
                    
                    costsCategoriesMap[loadedLedgerEntries[i].categoryId].total += loadedLedgerEntries[i].amount
                        total -= loadedLedgerEntries[i].amount
                }

                statistics.push({ date: loadedLedgerEntries[i].date, money: total  })
            } 

            setStatistics(statistics)
            setIncomesCategoriesMap(incomesCategoriesMap)
            setCostsCategoriesMap(costsCategoriesMap)
        })()
    }, [])

    return (
    
        <AnimatePresence>
            <div className="w-full h-full bg-gray-300 rounded-3xl mt-5 flex flex-col">
                <motion.div key="amount-line-chart" { ...fadeInOut } className="h-2/5 m-4 rounded-3xl bg-slate-500">
                    <Line data={{
                            
                        labels: statistics.map(value => value.date.slice(0, 10)),
                        datasets: [

                            {
                                label: "Account amount",
                                data: statistics.map(value => value.money),
                                backgroundColor: "rgb(34, 211, 238)",
                                borderColor: "rgb(37, 99, 235)",
                                borderWidth: 5
                            }
                        ]
                        }} options={{ 

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
                        }} />
                    </motion.div>
                <div className="h-3/5">
                    <div className="flex flex-row h-full w-full">
                        <AnimatePresence>
                            <motion.div key="incomes-pie-chart" { ...fadeInOut } className="m-4 rounded-3xl bg-slate-500 w-1/2 flex justify-center">
                                <Pie 
                                    data={{ 
                                        
                                        labels: Object.entries(incomesCategoriesMap).map(category => category[1].name),
                                        datasets: [

                                            {
                                                data: Object.entries(incomesCategoriesMap).map(category => category[1].total),
                                                backgroundColor: greenShades
                                            }
                                        ]
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
                                        datasets: [

                                            {
                                                data: Object.entries(costsCategoriesMap).map(category => category[1].total),
                                                backgroundColor: redShades
                                            }
                                        ]
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
        </AnimatePresence>
    )
}
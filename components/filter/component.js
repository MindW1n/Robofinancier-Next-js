"use client"
import { useEffect, useState } from "react"

export default function Filter({ onSubmit, defaultValue }) {

	const [fromDate, setfromDate] = useState(defaultValue?.fromDate)
	const [toDate, setToDate] = useState(defaultValue?.toDate)

	return (
		
		<div className="m-4 p-3 rounded-3xl bg-slate-500 flex flex-row items-center space-x-7">
			<div className="w-fit">
				<label htmlFor="fromDate" className="block mb-1 text-base font-semibold text-white w-full text-center">
					From date:
				</label>
				<input type="date" id="fromDate" className="h-12 text-white text-xl text-center p-3 font-bold w-48 
					rounded-3xl bg-blue-700" onChange={ (event) => setfromDate(event.target.value) } defaultValue={ defaultValue?.fromDate }/>
			</div>
			<div className="w-fit ml-4">
				<label htmlFor="fromDate" className="block mb-1 text-base font-semibold text-white w-full text-center">
					To date:
				</label>
				<input type="date" id="fromDate" className="h-12 text-white text-xl text-center p-3 font-bold w-48 
					rounded-3xl bg-blue-700" onChange={ (event) => setToDate(event.target.value) } defaultValue={ defaultValue?.toDate }/>
			</div>
			<button type="button" className="transition-all duration-300 hover:scale-105 h-12 text-black text-xl text-center p-3 
				font-bold w-36 rounded-3xl bg-green-300 hover:bg-green-400 hover:text-white" 
				onClick={ () => onSubmit(new Date(fromDate), new Date(toDate)) }>
				Submit
			</button>
		</div>
	)
}
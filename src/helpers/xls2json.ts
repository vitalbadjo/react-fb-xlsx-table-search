import * as XLSX from "xlsx"
import { Thing } from "../models/thing"
import { Part } from "../models/part"

export const Xls2jsonHelprer = (workSheet: XLSX.WorkSheet) => {
	const merges = (workSheet["!merges"] as XlsxMerge[]).filter(el => {
		return JSON.stringify(el) !== JSON.stringify(xlsxSourceFileConfig.mergesToExclude[0]) &&
			JSON.stringify(el) !== JSON.stringify(xlsxSourceFileConfig.mergesToExclude[1])
	}).filter(el => el.e.c === 1)
	delete workSheet["!merges"]
	delete workSheet["!autofilter"]
	delete workSheet["!ref"]
	delete workSheet["!margins"]
	console.log("merges", merges)
	console.log("workSheet", workSheet)
	const {
		leftTableSchema,
		rightTableSchema,
		leftTableColumns,
		rightTableColumns,
		startDataRowXlsxIndex,
	} = xlsxSourceFileConfig
	return Object.keys(workSheet).reduce<DataForUpload>((p, c) => {
		const trueRowIndex = +c.slice(1)
		const columnChar = c[0]
		// conversion for left table
		if (trueRowIndex >= startDataRowXlsxIndex) {
			if (leftTableColumns.includes(columnChar)) {
				const id = workSheet[`C${trueRowIndex}`]
				const key = leftTableSchema[columnChar]
				if (id) {
					p.things[id.w] = {
						...p.things[id.w],
						[key]: workSheet[c].w
					}
					// write parts ids and amount
					const isMerged = merges.filter(merg => {
						return trueRowIndex >= (merg.s.r+1) && trueRowIndex <= (merg.e.r+1)
					})

					if (isMerged.length === 1) {
						for (let i = isMerged[0].s.r+1; i<= isMerged[0].e.r+1; i++) {
							const partId = workSheet[`H${i}`]
							const amount = workSheet[`I${i}`]
							if (partId && amount) {
								p.things[id.w].parts = {
									...p.things[id.w].parts,
									[partId.w]:{partId: partId.w, amount: amount.w}
								}
							}
						}
					}
				}
				// conversion for right table
			} else if (rightTableColumns.includes(columnChar)) {
				const id = workSheet[`H${trueRowIndex}`]
				if (id) {
					const key = rightTableSchema[columnChar]
					p.parts[id.w] = {
						...p.parts[id.w],
						[key]: workSheet[c].w
					}
				}
			} else {
				return p
			}

		}
		return p
	}, {things: {}, parts: {}})
}


const xlsxSourceFileConfig = {
	headerRowXlsxIndex: 2,
	startDataRowXlsxIndex: 3,
	leftTableColumns: ["B", "C", "D", "E", "F"],
	leftTableSchema: {
		"B": "name",
		"C": "id",
		"D": "amount",
		"E": "size",
		"F": "details",
	} as Record<string, string>,
	rightTableSchema: {
		"G": "name",
		"H": "id",
		"I": "amount"
	} as Record<string, string>,
	rightTableColumns: ["G", "H", "I"],
	mergesToExclude: [
		{s: {c: 1, r: 0}, e: {c: 5, r: 0}},
		{s: {c: 6, r: 0}, e: {c: 8, r: 0}},
	],
	mergesIndexesToExclude: [25,26]
}

type XlsxMerge = {
	e: {c: number, r: number}
	s: {c: number, r: number}
}

type DataForUpload = {
	things: Record<string, Thing>
	parts: Record<string, Part>
}

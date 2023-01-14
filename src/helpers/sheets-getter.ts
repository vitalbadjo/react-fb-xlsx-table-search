import { APP_CONFIG } from "../config"
import axios from "axios"
import { DataForUpload } from "./xls2json"

export async function getSheetData(page: "products" = "products"): Promise<DataForUpload> {
	const response = await axios
		.create()
		.get(
			`${APP_CONFIG.sheets.apiUrl}/${process.env.REACT_APP_SHEETS_GID}/values/${encodeURI(`${page}!B2:I${APP_CONFIG.sheets.rowsLimit}`)}?key=${
				process.env.REACT_APP_SHEETS_APIK
			}&majorDimension=ROWS`,
		)

	const data: {values: string[][]} = response.data
	const rawData: string[][] = data.values.splice(1)
	return rawData.reduce<DataForUpload>((p, c) => {

		const newPart = c[6] ? {
			[c[6]]: {
				name: c[5],
				id: c[6],
				partId: c[6],
				amount: c[7]
			}
		}: {}

		const newThing = c[1] ?
			{
				[c[1]]: {
					...p.things[c[1]],
					name: c[0],
					id: c[1],
					amount: c[2],
					size: c[3],
					parts: {
						...( p.things[c[1]] ? p.things[c[1]].parts : {}),
						...newPart
					}
				}
			} :
			{}

		p = {
			...p,
			things: {
				...p.things,
				...newThing
			},
			parts: {
				...p.parts,
				...newPart
			}
		}
		return p
	}, {things: {}, parts: {}})
}

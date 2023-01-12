import * as XLSX from "xlsx"
import { GroupedListState } from "../components/grouped-search-list"
import { Part } from "../models/part"

const TABLE_HEADERS = [
	"Номер этажа",
	"Название фигуры",
	"Артикул фигуры",
	"Тип фигуры 1-4",
	"Номер помещения",
	"Кол.квадратов",
	"Габариты квадратов",
	"АРТИКУЛ",
	"НАЗВАНИЕ",
	"Кол-во"
]

const EMPTY_ROW = {
	floorNumber: "",
	name: "",
	id: "",
	amount: "",
	roomNumber: "",
	roomArea: "",
	size: "",
	partId: "",
	partName: "",
	partAmount: "",
}

export function generateXlsx(data: GroupedListState, parts: Record<string, Part>) {

	/* flatten objects */
	const rows = Object.keys(data).reduce<Record<string, string>[]>((p, c) => {
		const {floorNumber, roomNumber, roomArea, list} = data[c]
		let resultRows: Record<string, string>[] = []
		Object.keys(list).forEach((listElKey) => {
			if (list[listElKey].result) {
				list[listElKey].result?.forEach(resultEl => {
					const { id, name, size, amount } = resultEl
					const tempRows = Object.keys(resultEl.parts).map(partItemKey => {
						const {partId, amount: partAmount} = resultEl.parts[partItemKey]
						return {
							floorNumber,
							name,
							id,
							amount,
							roomNumber: "",
							roomArea: "",
							size,
							partId,
							partName: parts[partId].name,
							partAmount
						}
					})
					resultRows = [...resultRows, ...(resultRows.length ? [EMPTY_ROW, EMPTY_ROW]:[]), ...tempRows]
				})
			}

		})
		const groupRow = {...EMPTY_ROW, roomNumber, roomArea, floorNumber}
		p = [...p, groupRow ,...resultRows]
		return p
	}, []);

	/* generate worksheet and workbook */
	const worksheet = XLSX.utils.json_to_sheet(rows);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

	/* fix headers */
	XLSX.utils.sheet_add_aoa(worksheet, [TABLE_HEADERS], { origin: "A1" });

	/* calculate column width */
	worksheet["!cols"] = [
		{ wch: Math.max(10, rows[1].floorNumber.length) },
		{ wch: Math.max(10, rows[1].name.length) },
		{ wch: Math.max(10, rows[1].id.length) },
		{ wch: Math.max(10, rows[1].amount.length) },
		{ wch: Math.max(10, rows[1].roomNumber.length) },
		{ wch: Math.max(10, rows[1].roomArea.length) },
		{ wch: Math.max(10, rows[1].size.length) },
		{ wch: Math.max(10, rows[1].partId.length) },
		{ wch: Math.max(10, rows[1].partName.length) },
		{ wch: Math.max(10, rows[1].partAmount.length) }
	];

	/* create an XLSX file and try to save to Presidents.xlsx */
	XLSX.writeFile(workbook, "Test.xlsx");
}

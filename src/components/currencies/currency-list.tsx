import { List, ListSubheader } from "@mui/material"
import CurrencyItem from "./currency-item"
import React, { useContext } from "react"
import { UserContext } from "../../providers/userContext"

export type ICurrencyListProps = {}

const CurrencyList: React.FunctionComponent<ICurrencyListProps> = () => {
	const {settings} = useContext(UserContext)

	return <List
		subheader={
			<ListSubheader component="div" id="nested-list-subheader">
				Currencies
			</ListSubheader>
		}
	>
		{Object.values(settings.currencies).map(cat => {
			return <CurrencyItem
				key={cat.id}
				id={cat.id}
				displayName={cat.displayName}
				isFiat={cat.isFiat}
				visible={cat.visible}
				rate={cat.rate}
			/>
		})}
	</List>
}
export default CurrencyList

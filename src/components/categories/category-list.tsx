import { List, ListSubheader } from "@mui/material"
import CategoryItem from "./category-item"
import React, { useContext } from "react"
import { UserContext } from "../../providers/userContext"

export type ICategoryListProps = {
	type: "outcomes" | "incomes"
}

const CategoryList: React.FunctionComponent<ICategoryListProps> = ({type}) => {
	const {settings} = useContext(UserContext)

	return <List
		subheader={
			<ListSubheader component="div" id="nested-list-subheader">
				{type === "incomes" ? "Icome categories" : "Expense categories"}
			</ListSubheader>
		}
	>
		{Object.values(settings[type === "incomes" ? "incomeCategories" : "outcomeCategories"]).map(cat => {
			return <CategoryItem
				key={cat.id}
				id={cat.id}
				displayName={cat.displayName}
				icon={cat.icon}
			/>
		})}
	</List>
}
export default CategoryList

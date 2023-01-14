import { GroupedListState } from "../components/grouped-search-list"
import { APP_CONFIG } from "../config"

export function setDataToLocalStorage(data: GroupedListState) {
	localStorage.setItem(APP_CONFIG.localStorageDataKey, JSON.stringify(data))
}

export function getDataToLocalStorage(): GroupedListState|null {
	const data = localStorage.getItem(APP_CONFIG.localStorageDataKey)
	if (data) {
		return JSON.parse(data)
	}
	return null
}

export function clearLocalStorage() {
	localStorage.setItem(APP_CONFIG.localStorageDataKey, "")
}

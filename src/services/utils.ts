import { DataSnapshot } from "firebase/database"

export const checkSnapshotExist = (snapshot: DataSnapshot) => {
	if (snapshot.exists()) {
		return snapshot.val()
	} else {
		//todo show error dialog
		console.log("This data is not exist")
	}
}

import { Part } from "./part"
import { Thing } from "./thing"

export type UserData = {
	parts: Record<string, Part>
	things: Record<string, Thing>
}

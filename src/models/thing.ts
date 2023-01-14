import { Part } from "./part"

export type Thing = {
	name: string
	id: string
	amount: string
	size: string
	details: string
	parts: Record<string, Part & {partId: string}>
}

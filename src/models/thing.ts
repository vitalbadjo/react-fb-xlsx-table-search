export type Thing = {
	name: string
	id: string
	amount: string
	size: string
	details: string
	parts: Record<string, {partId: string, amount: string}>
}

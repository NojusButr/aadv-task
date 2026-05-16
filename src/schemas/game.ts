export type Game = {
    uuid: string
    id: number
    startTime: string
    startDelta: number
    startDeltaUs: number
    fakeStartDelta: number
    duration: number
    result: number | null
    outcome: string | null
}
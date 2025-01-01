export type Rule = { id?: string } & Record<string, unknown>

export type Recipe = Rule & {
    id: string
    type: string
}

export type SpawnRule = Rule & {
    type: string
    biomes: string
    spawners: Spawner[]
}

export interface Spawner {
    type: string
    weight: number
    minCount: number
    maxCount: number
}

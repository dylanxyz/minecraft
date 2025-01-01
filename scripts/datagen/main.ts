import { parseRules, writeRules } from "./api.ts"
import { Recipe, SpawnRule } from "./types.ts"

const Instance = {
    recipes: parseRules<Recipe>("recipes"),
    spawns: parseRules<SpawnRule>("spawns")
}

writeRules("recipes", Instance.recipes)
writeRules("spawns", Instance.spawns, { at: "forge/biome_modifier" })

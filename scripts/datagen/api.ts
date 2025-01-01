import * as fs from "@std/fs"
import * as path from "@std/path"
import * as yaml from "@std/yaml"
import { Recipe, Rule } from "./types.ts"

const DIRNAME = path.dirname(path.fromFileUrl(Deno.mainModule))
const DATADIR = path.normalize(path.join(DIRNAME, "..", "..", "resourcepacks", "@integrated", "data"))
const DATAGEN = path.normalize(path.join(DIRNAME, "..", "..", "datagen"))

export function parseFile<R>(path: string, multi = false): R {
    const content = Deno.readTextFileSync(path)
    return multi ? yaml.parseAll(content) as R : yaml.parse(content) as R
}

export function writeJson(path: string, object: unknown) {
    fs.ensureFileSync(path)
    Deno.writeTextFileSync(path, JSON.stringify(object, null, 4))
}

export function parseRules<T extends Rule>(type: string) {
    const result = [] as T[]

    for (const file of fs.walkSync(path.join(DATAGEN, type))) {
        if (file.isDirectory) continue

        const rules = parseFile(file.path, true) as T[]

        for (const rule of rules.filter(Boolean)) {
            if (!rule.id)
                throw new Error(`@${file.path} property id is required.`)

            result.push(rule)
        }
    }

    return result
}

export function writeRules(type: string, rules: Rule[], { at } = { at: type }) {
    for (const recipe of rules) {
        if (!recipe.id) continue

        const [from, name] = recipe.id.split(":").map(s => s.trim())
        const filepath = path.join(DATADIR, from, at, name + ".json")
        const output = Object.assign({}, recipe) as Partial<Recipe>

        delete output.id
        console.log(`writing ${type} rule at ${from}/${at}/${name + ".json"}`)
        writeJson(filepath, output)
    }
}

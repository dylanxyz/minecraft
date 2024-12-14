import { existsSync, ensureFileSync } from "jsr:@std/fs"
import { basename } from "jsr:@std/path"

async function download(url: string, filename?: string): Promise<Error | void> {
    try {
        filename ??= basename(url)
        const res = await fetch(url)
        const file = await Deno.open(filename, { create: true, write: true })
        await res.body?.pipeTo(file.writable)
        // https://github.com/denoland/deno/issues/15442
        // file.close()
    } catch (error) {
        return error as Error
    }
}

function parseOptions(file: string) {
    const result = new Map<string, string>()

    for (const line of Deno.readTextFileSync(file).trim().split(/\r?\n/)) {
        const index = line.indexOf(':')
        const key = line.substring(0, index)
        const val = line.substring(index + 1, line.length)

        if (key.trim())
            result.set(key.trim(), val.trim())
    }

    return result
}

const PackwizInstallerLink = "https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar"
const [profile, java] = Deno.args

if (!profile)
    throw new Error("Invalid profile")

if (!existsSync("packwiz-installer-bootstrap.jar")) {
    console.warn("[launch.ts] WARN: packwiz-installer-bootstrap.jar not found, downloading it...")

    const error = await download(PackwizInstallerLink)

    if (!error)
        console.info("[launch.ts] INFO: packwiz-installer-bootstrap.jar was downloaded!")
    else {
        console.error("[launch.ts] ERROR: Failed to download packwiz-installer-bootstrap.jar:")
        throw error
    }
} else
    console.info("[launch.ts] INFO: packwiz-installer-bootstrap.jar exists already")

console.info("[launch.ts] INFO: Running packwiz installer...")

const profileLink = profile.startsWith("file:///") ? profile :
    `https://raw.githubusercontent.com/dylanxyz/minecraft/refs/heads/${profile}/pack.toml`

const process = await new Deno.Command(java, {
    args: [
        "-jar",
        "packwiz-installer-bootstrap.jar",
        profileLink
    ],
}).output()

if (process.code !== 0)
    Deno.exit(process.code)
else
    console.log((new TextDecoder()).decode(process.stdout))

ensureFileSync("options.txt")
const newkeys = parseOptions("keys.txt")
const options = parseOptions("options.txt")
const count = Array.from(newkeys.keys()).filter(k => !options.has(k)).length

for (const key of newkeys.keys())
    if (!options.has(key))
        options.set(key, newkeys.get(key)!)

const file = options.keys().map(k => `${k}:${options.get(k)}`)
Deno.writeTextFileSync("options.txt", Array.from(file).join('\n') + '\n')
console.info(`[override.ts] ${count} options were added to options.txt`)

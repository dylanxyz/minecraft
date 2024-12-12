import * as fs from "@std/fs"
import * as path from "@std/path"
import { MetaFile, readtoml } from "./utils.ts"
import icons from "./icons.ts";

const filename = path.fromFileUrl(Deno.mainModule)
const rootdir = path.dirname(path.dirname(filename))

interface ModInfo {
    name: string
    file: string
    link: string
    side: string
    platform: string
}

const getModInfo = (filepath: string) => {
    const meta = readtoml<MetaFile>(filepath)
    const type = path.basename(path.dirname(filepath))

    const modinfo: ModInfo = {
        file: filepath.split("Modpack@v2\\").at(-1)?.replaceAll("\\", "/") ?? "#",
        name: meta.name,
        side: (meta.side as ModInfo["side"]) ?? "both",
        link: "#",
        platform: "#"
    }

    if (meta.update.modrinth) {
        const typemap: Record<string, string | null> = {
            resourcepacks: "resourcepack",
            shaderpacks: "shader"
        }

        modinfo.platform = "modrinth"
        modinfo.link = `https://modrinth.com/${typemap[type] ?? "mod"}/${meta.update.modrinth["mod-id"]}`
    } else if (meta.update.curseforge) {
        const typemap: Record<string, string | null> = {
            resourcepacks: "texture-packs",
            shaderpacks: "shaders"
        }

        modinfo.platform = "curseforge"
        modinfo.link = `https://curseforge.com/minecraft/${typemap[type] ?? "mc-mods"}/${path.basename(filepath).replace(".pw.toml", "")}`
    }

    return modinfo
}

const getMods = () => {
    const res = {} as Record<string, ModInfo[]>
    const dir = path.join(rootdir, "mods")

    for (const entry of fs.walkSync(dir)) {
        if (!entry.isFile) continue

        const filepath = entry.path
        const category = path.basename(path.dirname(entry.path))
        const modinfo = getModInfo(filepath)

        res[category] ??= []
        res[category].push(modinfo)
    }

    return res
}

const getPack = (pack: string) => {
    const dir = path.join(rootdir, pack)
    const res = [] as ModInfo[]

    for (const entry of fs.walkSync(dir, { maxDepth: 1 }))
        if (entry.isFile && entry.name.endsWith(".pw.toml"))
            res.push(getModInfo(entry.path))
        else if (entry.isDirectory && entry.name !== pack)
            res.push({
                name: entry.name,
                file: path.join(dir, entry.name).replaceAll("\\", "/"),
                side: "client",
                link: entry.path,
                platform: "github"
            })

    return res
}

const tableEntry = (modinfo: ModInfo) => {
    const { file, link, name, platform } = modinfo

    return (
        `<tr>\n` +
        `<td><img src="${icons[platform]}" width=26 title="${platform}"></td>\n` +
        `<td><a href="${link}">${name}</a></td>\n` +
        `<td><a href="${file}" title="Go to file">${icons.link}</a></td>\n` +
        "</tr>\n"
    )
}

const index = {
    mods: getMods(),
    shaderpacks: getPack("shaderpacks"),
    resourcepacks: getPack("resourcepacks"),
}


let README = "# Modpack\n"

README += "\n"
README += "## Mods\n"

for (const category in index.mods) {
    const categoryName = category.charAt(0).toUpperCase() + category.substring(1)

    README += "\n"
    README += `<table>\n`
    README += `<tr>\n`
    README += `<th width="32">${icons[category]}</th>\n`
    README += `<th width="1024">${categoryName}</th>\n`
    README += `<th width="24"></th>\n`
    README += `</tr>\n`

    for (const modinfo of index.mods[category])
        README += tableEntry(modinfo)

    README += `</table>\n`
    README += "\n---\n"
}

README += "\n"
README += "## Resource Packs\n"
README += "\n"
README += `<table>\n`
README += `<tr>\n`
README += `<th width="32"></th>\n`
README += `<th width="1024"></th>\n`
README += `<th width="24"></th>\n`
README += `</tr>\n`

for (const modinfo of index.resourcepacks)
    README += tableEntry(modinfo)

README += `</table>\n`

README += "\n"
README += "## Shader Packs\n"
README += "\n"
README += `<table>\n`
README += `<tr>\n`
README += `<th width="32"></th>\n`
README += `<th width="1024"></th>\n`
README += `<th width="24"></th>\n`
README += `</tr>\n`

for (const modinfo of index.shaderpacks)
    README += tableEntry(modinfo)

README += `</table>\n`

Deno.writeTextFileSync("README.md", README)

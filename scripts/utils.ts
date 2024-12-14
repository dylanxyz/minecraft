import { parse, stringify } from "jsr:@std/toml"
import { basename } from "jsr:@std/path"

export interface MetaFile {
    filename: string
    name: string
    side: string

    download: {
        "hash-format": string
        hash: string
        url: string
    }

    option: {
        default: boolean
        optional: boolean
        description: string
    }

    update: {
        modrinth?: {
            "mod-id": string
            version: string
        },

        curseforge?: {
            "file-id": number
            "project-id": number
        }
    }
}

export function updateFile(path: string) {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const bytes = Deno.readFileSync(path);
    const meta = parse(decoder.decode(bytes));
    const filename = meta["filename"] as string;

    if (!filename.startsWith("../")) {
        meta["filename"] = "../" + filename;
        Deno.writeFileSync(path, encoder.encode(stringify(meta)));
    }
}

export function readtoml<T>(path: string): T {
    const decoder = new TextDecoder()
    const bytes = Deno.readFileSync(path)
    const result = parse(decoder.decode(bytes)) as unknown

    return result as T
}

export async function download(url: string, filename?: string): Promise<Error | void> {
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

export function parseOptions(file: string) {
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

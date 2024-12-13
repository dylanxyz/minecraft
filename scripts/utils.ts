import { parse, stringify } from "@std/toml"

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

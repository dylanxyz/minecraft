import { parse, stringify } from "@std/toml"

export function updateFile(path: string) {
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    const bytes = Deno.readFileSync(path)
    const meta = parse(decoder.decode(bytes))
    const filename = meta["filename"] as string

    if (!filename.startsWith("../")) {
        meta["filename"] = "../" + filename
        Deno.writeFileSync(path, encoder.encode(stringify(meta)))
    }
}

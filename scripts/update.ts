import { walk } from "@std/fs"
import { dirname, fromFileUrl, join } from "@std/path"
import { updateFile } from "./utils.ts";

const rootdir = dirname(dirname(fromFileUrl(Deno.mainModule)))
const moddir = join(rootdir, "mods")

for await (const entry of walk(moddir)) {
    if (entry.isFile) updateFile(entry.path)
}

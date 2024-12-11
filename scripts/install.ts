import { $, usePowerShell } from "zx"
import { ensureDir, existsSync, moveSync } from "@std/fs"
import { dirname, fromFileUrl, join } from "@std/path"
import { updateFile } from "./utils.ts";

usePowerShell()

const rootdir = dirname(dirname(fromFileUrl(Deno.mainModule)))

const isMod = (cat: string) =>
    existsSync(join(rootdir, "mods", cat)) && !existsSync(join(rootdir, cat))

async function main(args: Record<'platform' | 'source' | 'category', string>) {
    const tempdir = join(rootdir, ".temp")
    const platform = args.platform.toLowerCase()
    const filename = args.source.split('/').at(-1) + ".pw.toml"

    await ensureDir(tempdir)

    if (isMod(args.category)) {
        const modfile = join(tempdir, filename)
        await $`packwiz -y ${platform} add ${args.source} --meta-folder .\\.temp`

        if (!existsSync(modfile)) throw new Error(`${modfile} does not exist`)

        for await (const path of Deno.readDir(tempdir)) {
            if (!path.isFile) continue

            const category = path.name === filename ? args.category : "library"
            const targetpath = join(rootdir, "mods", category, path.name)

            updateFile(join(tempdir, path.name))

            if (!existsSync(targetpath))
                moveSync(join(tempdir, path.name), targetpath)
        }
        await Deno.remove(tempdir, { recursive: true })
    } else
        await $`packwiz -y ${platform} add ${args.source} --meta-folder ${args.category}`
}

const args = {} as Record<'platform' | 'source' | 'category', string>

[args.platform, args.category, args.source] = Deno.args;

await main(args)

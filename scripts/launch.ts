import { $ } from "npm:zx"

const [profile] = Deno.args

if (!profile)
    throw new Error("Invalid profile")

console.log(Deno.cwd())

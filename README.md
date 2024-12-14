# Modpack

## Modpack Details

- **Minecraft Version**: `1.20.1`
- **Mod Loader**: `Forge 47.3.0`

## Setup

Set environment variables:

| Name          | Value |
|---------------|-------|
|`LAUNCH_SCRIPT`|`https://raw.githubusercontent.com/dylanxyz/minecraft/refs/heads/main/scripts/launch.ts`|

Then set the pre-launch command:

```shell
deno run --allow-read --allow-net --allow-write --allow-run --reload="$LAUNCH_SCRIPT" "$LAUNCH_SCRIPT" main "$INST_JAVA"
```

For the *optimized* version, use:

```shell
deno run --allow-read --allow-net --allow-write --allow-run --reload="$LAUNCH_SCRIPT" "$LAUNCH_SCRIPT" optimized "$INST_JAVA"
```

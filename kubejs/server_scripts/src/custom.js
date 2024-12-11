ServerEvents.recipes((event) => {
    // Remove some recipes
    event.remove("minecraft:glass")
    event.remove("immersive_weathering:glass_from_vitrified_sand_smelting")

    event.remove({ output: "notreepunching:iron_mattock" })
    event.remove({ output: "notreepunching:gold_mattock" })
    event.remove({ output: "notreepunching:diamond_mattock" })
    event.remove({ output: "notreepunching:netherite_mattock" })

    event.remove({ output: "notreepunching:iron_knife" })
    event.remove({ output: "notreepunching:gold_knife" })
    event.remove({ output: "notreepunching:diamond_knife" })
    event.remove({ output: "notreepunching:netherite_knife" })

    // Recipe for campfire
    event.shaped("minecraft:campfire", ["--", "=="], {
        "-": ["minecraft:stick", "#minecraft:saplings", "notreepunching:plant_fiber"],
        "=": ["#minecraft:logs_that_burn"]
    })

    // Recipe for glass
    event.recipes.create.mixing(
        [
            Item.of("minecraft:glass", 2),
            Item.of("minecraft:glass", 2).withChance(0.5),
        ],
        [
            "#minecraft:coals",
            "#minecraft:sand",
            "minecraft:dried_kelp"
        ]
    ).heated()

    // Recipe for leather
    event.recipes.create.mixing(
        [
            Item.of("minecraft:leather", 2),
            Item.of("minecraft:leather", 2).withChance(0.5),
        ],
        [
            "#minecraft:coals",
            "minecraft:dried_kelp",
            [
                "minecraft:beef",
                "minecraft:mutton",
                "minecraft:porkchop",
                "minecraft:rotten_flesh",
            ]
        ]
    ).lowheated()

    // Recipe for campfire
    event.shaped("minecraft:campfire", ["~~", "=="], {
        "~": ["#minecraft:saplings", "#minecraft:planks", "mincraft:stick", "notreepunching:plant_fiber"],
        "=": "#minecraft:logs_that_burn"
    })

    event.shaped("map_atlases:atlas", ["~/^"], {
        "~": "minecraft:map",
        "/": "minecraft:paper",
        "^": "minecraft:lapis_lazuli"
    })
})

/**
 *
 * @param {any} level
 * @param {$SoundEvent_} source
 * @param {$SoundSource_} type
 * @param {$BlockPos_} pos
 * @param {number} volume
 */
function playsound(level, source, type, pos, volume) {
    level.runCommandSilent(`playsound ${source} ${type} @a ${pos.x} ${pos.y} ${pos.z} ${volume}`)
}

// Lit/Unlit campfire with torch
BlockEvents.rightClicked("minecraft:campfire", (event) => {
    const block = event.getBlock()
    const player = event.getPlayer()
    const heldItem = player.getHeldItem("main_hand")
    const blockState = block.getBlockState()
    const torchInHand = Ingredient.of("#kubejs:torch_like").test(heldItem)
    const isLit = blockState.getValue(BlockProperties.LIT)

    if (torchInHand && !isLit) {
        player.swing()
        block.setBlockState(blockState.setValue(BlockProperties.LIT, Utils.copy(true)), 0)
        playsound(event.level, "item.flintandsteel.use", "block", block.getPos(), 1)
        event.cancel()
    } else if (heldItem.isEmpty() && isLit) {
        player.swing()
        block.setBlockState(blockState.setValue(BlockProperties.LIT, Utils.copy(false)), 0)
        playsound(event.level, "block.fire.extinguish", "block", block.getPos(), 0.5)
        event.cancel()
    }
})

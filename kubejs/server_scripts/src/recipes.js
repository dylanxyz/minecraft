ServerEvents.recipes((event) => {
    // Remove some recipes
    event.remove("minecraft:glass")
    event.remove("immersive_weathering:glass_from_vitrified_sand_smelting")

    event.remove({ output: "notreepunching:iron_mattock" })
    event.remove({ output: "notreepunching:gold_mattock" })
    event.remove({ output: "notreepunching:diamond_mattock" })
    event.remove({ output: "notreepunching:netherite_mattock" })
    event.remove({ output: "samurai_dynasty:steel_ingot" })

    event.remove({ output: "notreepunching:iron_knife" })
    event.remove({ output: "notreepunching:gold_knife" })
    event.remove({ output: "notreepunching:diamond_knife" })
    event.remove({ output: "notreepunching:netherite_knife" })

    // Recipe for campfire
    event.shaped("minecraft:campfire", ["--", "=="], {
        "-": ["minecraft:stick", "#minecraft:saplings", "notreepunching:plant_fiber"],
        "=": ["#minecraft:logs_that_burn"]
    })

    event.recipes.create.mixing(
        [
            Item.of("kubejs:processed_diamond"),
            Item.of("create:experience_nugget").withChance(0.95)
        ],
        [
            "minecraft:diamond",
            "minecraft:diamond",
            "#minecraft:coals"
        ]
    ).superheated()

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

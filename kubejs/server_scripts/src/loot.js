LootJS.modifiers((event) => {
    event.addBlockLootModifier("minecraft:crafting_table")
        .removeLoot(Ingredient.all)
        .addLoot("6x minecraft:stick")

    event.addBlockLootModifier("minecraft:smithing_table")
        .removeLoot(Ingredient.all)
        .addLoot("6x minecraft:stick")
        .addLoot("2x minecraft:iron_ingot")

    event.addBlockLootModifier("minecraft:cartography_table")
        .removeLoot(Ingredient.all)
        .addLoot("6x minecraft:stick")
        .addLoot("2x minecraft:paper")

    event.addBlockLootModifier("minecraft:fletching_table")
        .removeLoot(Ingredient.all)
        .addLoot("6x minecraft:stick")
        .addLoot("2x minecraft:obsidian")

    event.addBlockLootModifier("minecraft:enchanting_table")
        .removeLoot(Ingredient.all)
        .addLoot("1x minecraft:book")
        .addLoot("2x minecraft:diamond")
        .addLoot("2x minecraft:flint")

    event.addBlockLootModifier("minecraft:loom")
        .removeLoot(Ingredient.all)
        .addLoot("4x minecraft:stick")
        .addLoot("2x minecraft:string")

    event.addBlockLootModifier("minecraft:smoker")
        .removeLoot(Ingredient.all)
        .addLoot("12x minecraft:stick")
        .addLoot("4x minecraft:cobblestone")

    event.addBlockLootModifier("minecraft:chest")
        .removeLoot(Ingredient.all)
        .addLoot("10x minecraft:stick")

    event.addBlockLootModifier("minecraft:barrel")
        .removeLoot(Ingredient.all)
        .addLoot("8x minecraft:stick")

    event.addBlockLootModifier("minecraft:furnace")
        .removeLoot(Ingredient.all)
        .addLoot("4x minecraft:cobblestone")

    event.addBlockLootModifier("minecraft:blast_furnace")
        .removeLoot(Ingredient.all)
        .addLoot("8x minecraft:cobblestone")
        .addLoot("4x minecraft:iron_ingot")

    event.addBlockLootModifier("minecraft:anvil")
        .removeLoot(Ingredient.all)
        .addLoot("3x minecraft:iron_block")

    event.addBlockLootModifier("minecraft:chipped_anvil")
        .removeLoot(Ingredient.all)
        .addLoot("2x minecraft:iron_block")

    event.addBlockLootModifier("minecraft:damaged_anvil")
        .removeLoot(Ingredient.all)
        .addLoot("1x minecraft:iron_block")
})

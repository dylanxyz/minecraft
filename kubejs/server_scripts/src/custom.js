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

// Lit campfire with torch
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
    }
})

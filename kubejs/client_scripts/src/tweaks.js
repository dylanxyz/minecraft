// BlockEvents.rightClicked((event) => {
//     const offhandItem = event.getPlayer().getHeldItem("off_hand")
//     const emptyMainHand = event.getPlayer().getHeldItem("main_hand").isEmpty()
//     const blockItem = event.getBlock().getItem()

//     if (!Ingredient.of("#kubejs:torch_like").test(offhandItem))
//         return

//     const isGate = Ingredient.of("#minecraft:fence_gates").test(blockItem)
//     const isDoor = Ingredient.of("#minecraft:doors").test(blockItem)
//     const isTrapDoor = Ingredient.of("#minecraft:trapdoors").test(blockItem)

//     if (!isDoor && !isTrapDoor && !isGate && emptyMainHand)
//         event.cancel()
// })

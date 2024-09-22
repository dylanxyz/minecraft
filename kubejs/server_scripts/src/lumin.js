// NetworkEvents.dataReceived("lumin_toggle", event => {
//     const player = event.getPlayer()
//     const hand   = event.getData().getString("hand")
//     const energy = event.getData().getInt("energy")
//     const item   = player.getHeldItem(hand)

//     if (item.getId() === "kubejs:diode")
//         player.setHeldItem("main_hand", Item.of("kubejs:diode_off").withNBT({ energy: energy  }))
//     else if (item.getId() === "kubejs:diode_off" && energy > 0)
//         player.setHeldItem("main_hand", Item.of("kubejs:diode").withNBT({ energy: energy  }))
// })

// NetworkEvents.dataReceived("lumin_off", event => {
//     const player = event.getPlayer()
//     const hand = event.getData().getString("hand")
//     const heldItem = player.getHeldItem(hand)

//     if (heldItem.getId() === "kubejs:diode")
//         player.setHeldItem("main_hand", Item.of("kubejs:diode_off"))
// })

// BlockEvents.placed("#kubejs:led_block", (event) => {
//     const player = event.getPlayer()
//     const item = player.getHeldItem("main_hand")
//     const energy = item.hasNBT() ? item.getNbt().getInt("energy") : 0
//     event.block.getEntity().persistentData.put("energy", energy)
// })

// BlockEvents.broken("#kubejs:led_block", (event) => {
//     const energy = event.getBlock().getEntity().persistentData.getInt("energy")
//     event.block.popItemFromFace(Item.of(event.block.id).withNBT({ energy: energy }), Direction.UP)
//     event.block.set("minecraft:air")
//     event.cancel()
// })

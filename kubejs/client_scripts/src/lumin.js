// /**
//  *
//  * @param {$LocalPlayer_} player
//  * @param {$ItemStack_} item
//  * @param {string} hand
//  */
// function tickLumin(player, item, hand) {
//     if (item.getId() === "kubejs:diode") {
//         if (!item.hasNBT()) item.setNbt({ energy: 0 })

//         const stored = item.getNbt().getInt("energy")
//         const energy = Math.max(stored - 8, 0)
//         item.setNbt({ energy: energy })

//         if (energy <= 0)
//             player.sendData("lumin_off", { hand: hand })
//     }
// }

// ClientEvents.tick((event) => {
//     const player = event.getPlayer()
//     const mainHand = player.getHeldItem("main_hand")
//     const offHand = player.getHeldItem("off_hand")

//     const led = Ingredient.of("#kubejs:led")

//     if (led.test(mainHand)) tickLumin(player, mainHand, "main_hand")
//     if (led.test(offHand)) tickLumin(player, offHand, "off_hand")
// })

// ItemEvents.rightClicked("#kubejs:led", (event) => {
//     const item = event.getItem()
//     if (!item.hasNBT()) item.setNbt({ energy: 0 })
//     const energy = item.getNbt().getInt("energy")
//     event.player.sendData("lumin_toggle", { energy: energy, hand: event.getHand().toString() })
// })

// ItemEvents.tooltip(event => {
//     event.addAdvanced("#kubejs:led", (item, advanced, text) => {
//         const energy = item.hasNBT() ? item.getNbt().getInt("energy") : 0
//         text.add(1, Text.green("Charge: " + energy.toString()).bold(true))
//     })
// })

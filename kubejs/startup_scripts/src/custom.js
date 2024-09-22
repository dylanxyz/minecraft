// StartupEvents.registry("block", event => {
//     const LuminBlocks = [
//         {
//             name: "diode",
//             displayName: "Diode",
//             lightLevel: 8/16,
//             maxEnergy: 2048,
//             batteryDecay: 1,
//             tickFrequency: 5,
//         }
//     ]

//     for (const lumin of LuminBlocks)
//     {
//         event.create(lumin.name)
//             .lightLevel(lumin.lightLevel)
//             .tagItem("kubejs:led")
//             .tagBlock("kubejs:led_block")
//             .defaultCutout()
//             .noCollision()
//             .hardness(0)
//             .blockEntity(info => {
//                 info.attachCapability(CapabilityBuilder.ENERGY.customBlockEntity()
//                     .canReceive(() => true)
//                     .receiveEnergy((be, amount, sim) => {
//                         const energy = be.persistentData.getInt("energy")
//                         const received = Math.min(lumin.maxEnergy - energy, amount)
//                         if (!sim) be.persistentData.putInt("energy", energy + received)
//                         return received
//                     })
//                     .getEnergyStored(be => be.persistentData.getInt("energy"))
//                     .getMaxEnergyStored(() => lumin.maxEnergy)
//                 )
//                 .serverTick(lumin.tickFrequency, 0, be => {
//                     const energyStored = be.persistentData.getInt("energy")
//                     const newEnergy = Math.max(energyStored - lumin.batteryDecay, 0)
//                     be.persistentData.putInt("energy", newEnergy)

//                     if (newEnergy === 0)
//                         be.getLevel().setBlockAndUpdate(be.getBlockPos(), Block.getBlock("kubejs:diode_off").defaultBlockState())
//                 })
//             })
//             .displayName(lumin.displayName)

//         event.create(lumin.name + "_off")
//             .tagItem("kubejs:led")
//             .tagItem("kubejs:led_off")
//             .tagBlock("kubejs:led_block")
//             .defaultCutout()
//             .noCollision()
//             .hardness(0)
//             .blockEntity(info => {
//                 info.attachCapability(CapabilityBuilder.ENERGY.customBlockEntity()
//                     .canReceive(() => true)
//                     .receiveEnergy((be, amount, sim) => {
//                         if (!sim && amount > 0) {
//                             const blockState = Block.getBlock("kubejs:" + lumin.name).defaultBlockState()
//                             be.getLevel().setBlockAndUpdate(be.getBlockPos(), blockState)
//                         }
//                         return amount
//                     })
//                     .getEnergyStored(be => be.persistentData.getInt("energy"))
//                     .getMaxEnergyStored(() => lumin.maxEnergy)
//                 )
//             })
//             .displayName(lumin.displayName)
//     }
// })

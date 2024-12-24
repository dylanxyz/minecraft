// const Registries = Java.loadClass("net.minecraft.core.registries.Registries")
// const ResourceKey = Java.loadClass("net.minecraft.resources.ResourceKey")

const skeletonWeapons = [
    "simplyswords:iron_twinblade",
    "simplyswords:gold_twinblade",
    "simplyswords:iron_katana",
    "simplyswords:gold_katana",
    "simplyswords:iron_spear",
    "simplyswords:gold_spear",
]

const getSkeletonWeapon = () => skeletonWeapons[Math.floor(Math.random() * skeletonWeapons.length)]

EntityEvents.spawned("minecraft:skeleton", (event) => {
    /** @type {$Skeleton_} */
    const entity = event.entity

    entity.setMainHandItem(getSkeletonWeapon())
})

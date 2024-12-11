const LunarPhaseData = Java.loadClass("com.mrbysco.lunar.LunarPhaseData")

const LunarPhase = {
    "lunar:regular"       : 0,
    "lunar:bad_omen_moon" : 1,
    "lunar:big_moon"      : 2,
    "lunar:blood_moon"    : 3,
    "lunar:crimson_moon"  : 4,
    "lunar:eclipse_moon"  : 5,
    "lunar:hero_moon"     : 6,
    "lunar:miner_moon"    : 7,
    "lunar:tiny_moon"     : 8,
    "lunar:white_moon"    : 9,
}

ServerEvents.tick((event) => {
    const level = event.getServer().getLevel("minecraft:overworld")
    const dayTime = level.getLevelData().getDayTime()

    if (dayTime === 13400) {
        const lunarPhaseData = LunarPhaseData.get(level)
        const activeEvent = lunarPhaseData.getActiveLunarEvent()

        if (activeEvent) {
            const phase = LunarPhase[activeEvent.getID().toString()]
            event.getServer().runCommandSilent(`incontrol setnumber lunarPhase ${phase}`)
        }
    } else if (dayTime === 24000) {
        event.getServer().runCommandSilent(`incontrol setnumber lunarPhase 0`)
    }
})

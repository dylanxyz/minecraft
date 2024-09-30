const SculkHorde = Java.loadClass("com.github.sculkhorde.core.SculkHorde")
const HordeState = Java.loadClass("com.github.sculkhorde.core.ModSavedData").HordeState

global.putIfAbsent("dayCount", 0)
global.putIfAbsent("lastDay", 0)
global.putIfAbsent("firstHorde", true)
global.putIfAbsent("firstMessageTicks", -1)

const DaysBeforeInvocation = 7
const DaysAfterFullyActivating = 90

function isHordeActive() {
    return SculkHorde.savedData.isHordeActive()
}

function pauseHorde() {
    SculkHorde.savedData.setHordeState(HordeState.UNACTIVATED)
}

function resumeHorde(day) {
    // check if is the first time we activating the horde
    if (global.getOrDefault("firstHorde", true)) {
        global.put("firstHorde", false)
        global.put("firstMessageTicks", 0)
    } else
        SculkHorde.savedData.setHordeState(HordeState.ACTIVE)

    global.put("lastDay", day)
}

ServerEvents.tick((event) => {
    const overworld = event.getServer().getLevel("minecraft:overworld")
    const time = overworld.levelData.getDayTime()
    const ticks = global.getOrDefault("firstMessageTicks", -1)

    if (ticks > -1) {
        if (ticks == 160)
            event.getServer().tell("⠂☧⼂┡ⴴ⬲⿊⁤ⳙ◊∔⻣➏⍆┄⤊❋➯Ⱏ‗⿺⦭⯿ⶒ℣Ⱞ⒵↦ⴱ⓳✵⑔ⵐ⢦⹜⤌⍪")
        else if (ticks == 220)
            Utils.getServer().tell("They are here. Is it too late?")
        else if (ticks > 220)
            global.put("firstMessageTicks", -1)

        global.put("firstMessageTicks", ticks + 1)
    }

    if (time % 24000 == 0) {
        const day = Math.floor(time / 24000)
        const lastDay = global.getOrDefault("lastDay", 0)
        const dayDiff = day - lastDay
        const isActive = isHordeActive()

        global.put("dayCount", day)

        if (day < DaysBeforeInvocation)
            return

        else if (!isActive && day > DaysAfterFullyActivating)
            resumeHorde(day)

        else if (isActive)
            pauseHorde()

        else if (dayDiff > 6) {
            // the probability of resuming the horde increases
            // with the amount of inactive days passed, also
            // increases with the amount of days since the
            // start of the world
            const k = 0.14*dayDiff + 0.0078*day

            if (k > Math.random())
                resumeHorde(day)
        }
    }
})

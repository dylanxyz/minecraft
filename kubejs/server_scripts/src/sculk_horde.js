// ---
const Settings = {
    checkDayTime: 2000,
    hordeTime: 5000,

    daysForActivation: 1,
    daysForEvolution: 72,

    baseProbability: 0.002,
    daysPassedFactor: 0.005,
    daysInactiveFactor: 0.01,
}
// ---

// const Class = Java.loadClass("java.lang.Class")
const SculkHorde = Java.loadClass("com.github.sculkhorde.core.SculkHorde")
const ModSavedData = Java.loadClass("com.github.sculkhorde.core.ModSavedData")

/** @type {Record<'UNACTIVATED' | 'ACTIVE' | 'DEFEATED', number>} */
const HordeState = ModSavedData.HordeState

/** @returns {boolean} */
const isHordeUnactivated = () => SculkHorde.savedData.isHordeUnactivated()

/** @returns {boolean} */
const isHordeActive = () => SculkHorde.savedData.isHordeActive()

const setHordeState = (state) => SculkHorde.savedData.setHordeState(state)

function activateHorde() {
    console.log('Activating horde')

    setHordeState(HordeState.ACTIVE)

    if(SculkHorde.savedData.getSculkAccumulatedMass() <= 0) {
        SculkHorde.savedData.addSculkAccumulatedMass(1000)
        SculkHorde.statisticsData.addTotalMassFromNodes(1000)
    }

    isHordeAwaken.set(true)
}

const savedData = () => Utils.getServer().persistentData

const isHordeAwaken =
    Object.assign(() => savedData().getBoolean("m_isHordeAwaken"), {
        set: (value) => savedData().putBoolean("m_isHordeAwaken", value),
    })

const daysInactive =
    Object.assign(() => savedData().getInt("m_daysInactive"), {
        set: (value) => savedData().putInt("m_daysInactive", value),
    })

function calculateProbability(daysPassed, daysInactive) {
    const baseProbability = Settings.baseProbability
    const daysPassedFactor = Settings.daysPassedFactor
    const daysInactiveFactor = Settings.daysInactiveFactor

    // Calculate probability dynamically
    const probability = baseProbability + (daysPassed * daysPassedFactor) + (daysInactive * daysInactiveFactor);

    // Cap the probability at 1 (100%)
    return Math.min(probability, 1);
}

/**
 * @param {$Level_} level
 */
function killInfectors(level) {
    for (const entity of level.getEntities())
        if (entity.type === "sculkhorde:cursor_surface_infector")
            entity.kill()
}

ServerEvents.tick((event) => {
    const level = event.server.getLevel('minecraft:overworld')
    const time = level.getDayTime()
    const currentDay = Math.floor(time / 24000)
    const currentTime = time % 24000
    const endTime = Settings.checkDayTime + Settings.hordeTime

    if (isHordeAwaken() && isHordeActive() && currentDay > Settings.daysForEvolution)
        return

    if (!isHordeAwaken() && currentDay < Settings.daysForActivation)
        return

    if (currentTime != Settings.checkDayTime && currentTime != endTime)
        return

    if (!isHordeAwaken() && isHordeActive())
        isHordeAwaken.set(true)

    console.log("Checking day")
    console.log("   currentDay = " + currentDay)
    console.log("   currentTime = " + currentTime)
    console.log("   isHordeAwaken = " + isHordeAwaken())
    console.log("   daysInactive = " + daysInactive())

    if (!isHordeAwaken() && currentDay >= Settings.daysForActivation) {
        console.log("The horde is not awaken but enough days passed")
        event.server.getPlayers().forEach(player => player.sendData("isTooLate"))
        activateHorde()
    }

    else if (isHordeActive() && currentTime == endTime) {
        console.log("Setting horde to inactive")
        daysInactive.set(0)
        killInfectors(level)
        setHordeState(HordeState.UNACTIVATED)
    }

    else if (!isHordeActive() && currentTime == Settings.checkDayTime) {
        const probability = calculateProbability(currentDay, daysInactive())
        const shouldActivate = (Math.random() < probability) || daysInactive() > 4

        console.log("Probability of activation: " + Math.floor(probability * 100) + "%")

        if (shouldActivate) {
            activateHorde()
            daysInactive.set(0)
            console.log("Activating the horde...")
        } else {
            daysInactive.set(daysInactive() + 1)
            console.log("Not today...")
        }
    }
})

ServerEvents.customCommand("checkTime", (event) => {
    const level = event.server.getLevel('minecraft:overworld')
    const time = level.getDayTime()
    const currentDay = Math.floor(time / 24000)
    const currentTime = time % 24000

    event.server.tell("currentDay = " + currentDay)
    event.server.tell("currentTime = " + currentTime)
})

ServerEvents.customCommand("toggleHorde", (event) => {
    if (isHordeActive()) {
        killInfectors(event.level)
        setHordeState(HordeState.UNACTIVATED)
    }

    else setHordeState(HordeState.ACTIVE)
})

ServerEvents.customCommand("cursorCount", (event) => {
    const count = event.level.getEntities()
        .filter(entity => entity.type === "sculkhorde:cursor_surface_infector")
        .size()

    event.server.tell("Infectors count = " + count)
})

EntityEvents.spawned("sculkhorde:cursor_surface_infector", (event) => {
    const count = event.level.getEntities()
        .filter(entity => entity.type === event.entity.type)
        .size()

    // event.server.tell("Trying to spawn cursor infector. Count = " + count)

    if (isHordeUnactivated() || count > 64)
        event.cancel()
})

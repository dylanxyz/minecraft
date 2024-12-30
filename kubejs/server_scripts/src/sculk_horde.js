// ---
const Settings = {
    hordeTime: 5000,

    daysForActivation: 1,
    daysForEvolution: 72,

    baseProbability: 0.002,
    daysPassedFactor: 0.005,
    daysInactiveFactor: 0.01,
}

// ---

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

const timer =
    Object.assign(() => savedData().getInt("m_HordeTimer"), {
        reset: () => savedData().putInt("m_HordeTimer", 0),
        update: () => savedData().putInt("m_HordeTimer", savedData().getInt("m_HordeTimer") + 1),
    })

const isHordeAwaken =
    Object.assign(() => savedData().getBoolean("m_isHordeAwaken"), {
        set: (value) => savedData().putBoolean("m_isHordeAwaken", value),
    })

const daysInactive =
    Object.assign(() => savedData().getInt("m_daysInactive"), {
        set: (value) => savedData().putInt("m_daysInactive", value),
    })

const lastTimeCheck =
    Object.assign(() => savedData().getInt("m_lastTimeActive"), {
        set: (value) => savedData().putInt("m_lastTimeActive", value),
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

    const isAwaken = isHordeAwaken()
    const isActive = isHordeActive()
    const timeSinceActive = time - lastTimeCheck()

    let probability = 0

    const shouldSkip =
        (isAwaken && isActive && currentDay > Settings.daysForEvolution) ||
        (!isAwaken && currentDay < Settings.daysForActivation)

    if (shouldSkip)
        return

    if (!isAwaken && isActive)
        isHordeAwaken.set(true)

    if (isActive) {
        timer.update()
        lastTimeCheck.set(time)

        if (timer() > Settings.hordeTime) {
            console.log("Setting horde to inactive")
            timer.reset()
            lastTimeCheck.set(time)
            daysInactive.set(0)
            killInfectors(level)
            setHordeState(HordeState.UNACTIVATED)
        }
    } else if (!isAwaken && currentDay >= Settings.daysForActivation && timeSinceActive > 18000) {
        console.log("The horde is not awaken but enough days passed")
        event.server.getPlayers().forEach(player => player.sendData("isTooLate"))
        timer.reset()
        lastTimeCheck.set(time)
        activateHorde()
    }

    else if (!isActive && timeSinceActive > 18000) {
        probability = calculateProbability(currentDay, daysInactive())
        console.log("Probability of activation: " + Math.floor(probability * 100) + "%")

        if ((Math.random() < probability) || daysInactive() > 4) {
            activateHorde()
            timer.reset()
            daysInactive.set(0)
            console.log("Activating the horde...")
        } else {
            daysInactive.set(daysInactive() + 1)
            console.log("Not today...")
        }

        lastTimeCheck.set(time)
    }
})

ServerEvents.customCommand("checkParams", (event) => {
    const level = event.server.getLevel('minecraft:overworld')
    const time = level.getDayTime()
    const currentDay = Math.floor(time / 24000)
    const currentTime = time % 24000
    const count = event.level.getEntities()
        .filter(entity => entity.type === "sculkhorde:cursor_surface_infector")
        .size()

    event.server.tell("---------------------------------")
    event.server.tell(`currentDay = ${currentDay}, currentTime = ${currentTime}`)
    event.server.tell(`isAwaken = ${isHordeAwaken()}, isActive = ${isHordeActive()}`)
    event.server.tell(`daysInactive = ${daysInactive()}, lastCheck = ${lastTimeCheck()}`)
    event.server.tell(`hordeTimer = ${timer()}, timeInactive = ${time - lastTimeCheck()}`)
    event.server.tell(`number of cursor entities = ${count}`)
})

// ServerEvents.customCommand("toggleHorde", (event) => {
//     if (isHordeActive()) {
//         killInfectors(event.level)
//         setHordeState(HordeState.UNACTIVATED)
//     }

//     else setHordeState(HordeState.ACTIVE)
// })

// ServerEvents.customCommand("cursorCount", (event) => {
//     const count = event.level.getEntities()
//         .filter(entity => entity.type === "sculkhorde:cursor_surface_infector")
//         .size()

//     event.server.tell("Infectors count = " + count)
// })

EntityEvents.spawned("sculkhorde:cursor_surface_infector", (event) => {
    const count = event.level.getEntities()
        .filter(entity => entity.type === event.entity.type)
        .size()

    // event.server.tell("Trying to spawn cursor infector. Count = " + count)

    if (isHordeUnactivated() || count > 64)
        event.cancel()
})

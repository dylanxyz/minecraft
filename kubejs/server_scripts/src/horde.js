let prevDay = 0

ServerEvents.tick((event) => {
    const overworld = event.getServer().getLevel("minecraft:overworld")
    const time = overworld.levelData.getGameTime()

    if (time % 24000 == 0) {
        const day = Math.floor(time / 24000)
        event.getServer().tell("1 day has passed")

        if (day - prevDay > 7) {
            event.getServer().tell("7 days have passed")
            prevDay = day
        }
    }
})

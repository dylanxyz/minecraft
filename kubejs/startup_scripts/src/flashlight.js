StartupEvents.registry('block', event => {
    event.create("basic_flashlight")
        .requiresTool(false)
        .defaultCutout()
        .displayName("Laterna Básica")

    event.create("basic_flashlight_lit")
        .requiresTool(false)
        .defaultCutout()
        .lightLevel(1.2)
        .displayName("Laterna Básica")
})

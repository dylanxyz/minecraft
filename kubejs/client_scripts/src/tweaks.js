BlockEvents.rightClicked((event) => {
    const offhandItem = event.getPlayer().getHeldItem("off_hand")
    const emptyMainHand = event.getPlayer().getHeldItem("main_hand").isEmpty()

    if (emptyMainHand && Ingredient.of("#kubejs:torch_like").test(offhandItem))
        event.cancel()
})

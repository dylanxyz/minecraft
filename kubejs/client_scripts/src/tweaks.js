BlockEvents.rightClicked((event) => {
    const offhandItem = event.getPlayer().getHeldItem("off_hand")

    if (Ingredient.of("#kubejs:torch_like").test(offhandItem))
        event.cancel()
})

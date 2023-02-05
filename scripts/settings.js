Hooks.once("init", () => {
    game.settings.register("pf2e-alignment-damage", "ignoreAlignment", {
        scope: "world",
        config: true,
        name: game.i18n.localize("pf2e-alignment-damage.settings.ignoreAlignment.name"),
        hint: game.i18n.localize("pf2e-alignment-damage.settings.ignoreAlignment.hint"),
        type: Boolean,
        default: false
    });
});
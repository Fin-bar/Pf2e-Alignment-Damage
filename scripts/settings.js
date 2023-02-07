Hooks.once("init", () => {
    game.settings.register("pf2e-alignment-damage", "alignmentConfig", {
        scope: "world",
        config: true,
        name: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.name"),
        hint: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.hint"),
        type: String,
        default: "default",
        choices: {
            all: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.all"),
            nonMatching: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.nonMatching"),
            default: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.default"),
            none: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.none"),
        }
    });
});
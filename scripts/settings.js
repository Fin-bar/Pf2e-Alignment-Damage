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
            none: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.none")
        }
    });
    game.settings.register("pf2e-alignment-damage", "bleedConfig", {
        scope: "world",
        config: true,
        name: game.i18n.localize("pf2e-alignment-damage.settings.bleedConfig.name"),
        hint: game.i18n.localize("pf2e-alignment-damage.settings.bleedConfig.hint"),
        type: String,
        default: "default",
        choices: {
            all: game.i18n.localize("pf2e-alignment-damage.settings.bleedConfig.all"),
            default: game.i18n.localize("pf2e-alignment-damage.settings.bleedConfig.default"),
            nonConstructs: game.i18n.localize("pf2e-alignment-damage.settings.bleedConfig.nonConstructs"),
            nonUndead: game.i18n.localize("pf2e-alignment-damage.settings.bleedConfig.nonUndead")
        }
    });
    game.settings.register("pf2e-alignment-damage", "positiveConfig", {
        scope: "world",
        config: true,
        name: game.i18n.localize("pf2e-alignment-damage.settings.positiveConfig.name"),
        hint: game.i18n.localize("pf2e-alignment-damage.settings.positiveConfig.hint"),
        type: String,
        default: "default",
        choices: {
            all: game.i18n.localize("pf2e-alignment-damage.settings.positiveConfig.all"),
            default: game.i18n.localize("pf2e-alignment-damage.settings.positiveConfig.default"),
            nonConstructs: game.i18n.localize("pf2e-alignment-damage.settings.positiveConfig.nonConstructs"),
        }
    });
    game.settings.register("pf2e-alignment-damage", "negativeConfig", {
        scope: "world",
        config: true,
        name: game.i18n.localize("pf2e-alignment-damage.settings.negativeConfig.name"),
        hint: game.i18n.localize("pf2e-alignment-damage.settings.negativeConfig.hint"),
        type: String,
        default: "default",
        choices: {
            all: game.i18n.localize("pf2e-alignment-damage.settings.negativeConfig.all"),
            default: game.i18n.localize("pf2e-alignment-damage.settings.negativeConfig.default"),
            nonConstructs: game.i18n.localize("pf2e-alignment-damage.settings.negativeConfig.nonConstructs"),
        }
    });
    game.settings.register("pf2e-alignment-damage", "precisionConfig", {
        scope: "world",
        config: true,
        name: game.i18n.localize("pf2e-alignment-damage.settings.precisionConfig.name"),
        hint: game.i18n.localize("pf2e-alignment-damage.settings.precisionConfig.hint"),
        type: String,
        default: "default",
        choices: {
            default: game.i18n.localize("pf2e-alignment-damage.settings.precisionConfig.default"),
            replace: game.i18n.localize("pf2e-alignment-damage.settings.precisionConfig.replace"),
            remove: game.i18n.localize("pf2e-alignment-damage.settings.precisionConfig.remove"),
        }
    });
});
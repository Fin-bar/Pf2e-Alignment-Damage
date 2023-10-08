Hooks.once("init", () => {
    game.settings.register("pf2e-alignment-damage", "alignmentConfig", {
        scope: "world",
        requiresReload: true,
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
            applySpirit: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.applySpirit"),
            replace: game.i18n.localize("pf2e-alignment-damage.settings.alignmentConfig.replace"),
        }
    });
    game.settings.register("pf2e-alignment-damage", "bleedConfig", {
        scope: "world",
        requiresReload: true,
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
    game.settings.register("pf2e-alignment-damage", "vitalityConfig", {
        scope: "world",
        requiresReload: true,
        config: true,
        name: game.i18n.localize("pf2e-alignment-damage.settings.vitalityConfig.name"),
        hint: game.i18n.localize("pf2e-alignment-damage.settings.vitalityConfig.hint"),
        type: String,
        default: "default",
        choices: {
            all: game.i18n.localize("pf2e-alignment-damage.settings.vitalityConfig.all"),
            default: game.i18n.localize("pf2e-alignment-damage.settings.vitalityConfig.default"),
            nonConstructs: game.i18n.localize("pf2e-alignment-damage.settings.vitalityConfig.nonConstructs"),
        }
    });
    game.settings.register("pf2e-alignment-damage", "voidConfig", {
        scope: "world",
        requiresReload: true,
        config: true,
        name: game.i18n.localize("pf2e-alignment-damage.settings.voidConfig.name"),
        hint: game.i18n.localize("pf2e-alignment-damage.settings.voidConfig.hint"),
        type: String,
        default: "default",
        choices: {
            all: game.i18n.localize("pf2e-alignment-damage.settings.voidConfig.all"),
            default: game.i18n.localize("pf2e-alignment-damage.settings.voidConfig.default"),
            nonConstructs: game.i18n.localize("pf2e-alignment-damage.settings.voidConfig.nonConstructs"),
        }
    });
    game.settings.register("pf2e-alignment-damage", "precisionConfig", {
        scope: "world",
        requiresReload: true,
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
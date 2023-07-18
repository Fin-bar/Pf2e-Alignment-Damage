const MODULE_ID = 'pf2e-alignment-damage';

Hooks.on('init', () =>
    libWrapper.register(
        MODULE_ID,
        'CONFIG.Actor.documentClass.prototype.isAffectedBy',
        modifyAlignmentImmunity,
        'OVERRIDE'
    )
)

function modifyAlignmentImmunity(...args) {
    let damage = args[0];

    const alignments = ["good", "evil", "lawful", "chaotic"];
    const possiblyUnaffected = ["negative", "positive", "bleed"];

    const damageType = (damage in CONFIG.PF2E.damageTypes)
        ? damage
        : damage.isOfType("condition")
            ? damage.system.persistent?.damageType ?? null
            : null;

    const alignmentSetting = game.settings.get("pf2e-alignment-damage", "alignmentConfig");
    if (alignments.includes((damageType))) {
        if (alignmentSetting === "all") return true;
        else if (alignmentSetting === "none") return false;
        else possiblyUnaffected.push(...alignments)
    }

    if (!possiblyUnaffected.includes((damageType))) return true;

    const bleedSetting = game.settings.get("pf2e-alignment-damage", "bleedConfig");
    const positiveSetting = game.settings.get("pf2e-alignment-damage", "positiveConfig");
    const negativeSetting = game.settings.get("pf2e-alignment-damage", "negativeConfig");

    const { traits } = this;
    let damageIsApplicable;
    damageIsApplicable = {
        positive: positiveIsApplicable(positiveSetting, this.modeOfBeing, this.attributes.hp?.negativeHealing),
        negative: negativeIsApplicable(positiveSetting, this.modeOfBeing, this.attributes.hp?.negativeHealing),
        bleed: bleedIsApplicable(bleedSetting, this.modeOfBeing) || isReallyPC(this),
    };
    addAlignmentFields(damageIsApplicable, alignmentSetting, traits)

    return damageIsApplicable[damageType];
}

function isReallyPC(actor) {
    if (!actor.isOfType("character")) return false;
    const classItemSourceID = this.class?.sourceId;
    return !(
        [ANIMAL_COMPANION_SOURCE_ID, CONSTRUCT_COMPANION_SOURCE_ID].includes(classItemSourceID ?? "") ||
        actor.traits.has("eidolon")
    );
}

function addAlignmentFields(isApplicable, moduleSetting, traits) {
    let alignmentIsApplicable;
    if (moduleSetting === "default") {
        alignmentIsApplicable = {
            good: traits.has("evil"),
            evil: traits.has("good"),
            lawful: traits.has("chaotic"),
            chaotic: traits.has("lawful")
        };
    }
    else if (moduleSetting === "nonMatching") {
        alignmentIsApplicable = {
            good: !traits.has("good"),
            evil: !traits.has("evil"),
            lawful: !traits.has("lawful"),
            chaotic: !traits.has("chaotic")
        };
    }
    else {
        alignmentIsApplicable = {};
    }
    Object.keys(alignmentIsApplicable).forEach(k => isApplicable[k] = alignmentIsApplicable[k])
}

function bleedIsApplicable(moduleSetting, modeOfBeing) {
    if (moduleSetting === "default")
        return modeOfBeing === "living";
    else if (moduleSetting === "nonConstructs")
        return modeOfBeing !== "construct";
    else if (moduleSetting === "nonUndead")
        return modeOfBeing !== "undead";
    else return true;
}

function positiveIsApplicable(moduleSetting, modeOfBeing, negativeHealing) {
    if (moduleSetting === "default")
        return !!negativeHealing;
    else if (moduleSetting === "nonConstructs")
        return modeOfBeing !== "construct";
    else return true;
}
function negativeIsApplicable(moduleSetting, modeOfBeing, negativeHealing) {
    if (moduleSetting === "default")
        return !(modeOfBeing === "construct" || negativeHealing);
    else if (moduleSetting === "nonConstructs")
        return modeOfBeing !== "construct";
    else return true;
}

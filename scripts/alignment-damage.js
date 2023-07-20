const MODULE_ID = 'pf2e-alignment-damage';

const resistanceMap = new Map([[-1, 1], [0, 1], [1, 2], [2, 2], [3, 3], [4, 4], [5, 4], [6, 5], [7, 5], [8, 6], [9, 6], [10, 7], [11, 7], [12, 8],
    [13, 8], [14, 9], [15, 9], [16, 9], [17, 10], [18, 10], [19, 11], [20, 11], [21, 12], [22, 12], [23, 13], [24, 13], [25, 14] //Level 25 resistance value: https://www.youtube.com/watch?v=3_lAb8m9MpI
])

const ephemeralEffect = {
    _id: 'sixteencharacter',
    name: 'Precision Immunity Replacement',
    system: {
        rules: [
            {
                key: "Immunity",
                mode: "remove",
                type:"precision",
            },
            {
                key: "Resistance",
                type: "bludgeoning",
                value: "replace"
            },
            {
                key: "Resistance",
                type: "piercing",
                value: "replace"
            },
            {
                key: "Resistance",
                type: "slashing",
                value: "replace"
            },
            {
                key: "Resistance",
                type: "bleed",
                value: "replace"
            }
        ]
    },
    type: 'effect'
}

Hooks.on('init', () => {
        libWrapper.register(
            MODULE_ID,
            'CONFIG.Actor.documentClass.prototype.isAffectedBy',
            modifyAlignmentImmunity,
            'OVERRIDE'
        )
        libWrapper.register(
            MODULE_ID,
            'CONFIG.Actor.documentClass.prototype.getContextualClone',
            modifyPrecisionImmunity,
            'WRAPPER'
        )
    }
)
function modifyPrecisionImmunity(wrapped, rollOptions, ephemeralEffects) {
    const precisionSetting = game.settings.get("pf2e-alignment-damage", "precisionConfig");
    let isImmune = false;
    this.attributes.immunities.forEach(immunity => {
        if (immunity.type === "precision")
            isImmune = true;
    })
    if (precisionSetting === "default" || !isImmune)
        return wrapped(rollOptions, ephemeralEffects);
    const level = this.level;
    ephemeralEffect.system.rules.forEach(rule => {
        if (rule.key === "Resistance")
        rule.value = (precisionSetting === "remove") ? 0 : resistanceMap.get(level);
    })
    ephemeralEffects.push(ephemeralEffect);
    return wrapped(rollOptions, ephemeralEffects);
}

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

    const {traits} = this;
    let damageIsApplicable;
    damageIsApplicable = {
        positive: positiveIsApplicable(positiveSetting, this.modeOfBeing, this.attributes.hp?.negativeHealing),
        negative: negativeIsApplicable(negativeSetting, this.modeOfBeing, this.attributes.hp?.negativeHealing),
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
    } else if (moduleSetting === "nonMatching") {
        alignmentIsApplicable = {
            good: !traits.has("good"),
            evil: !traits.has("evil"),
            lawful: !traits.has("lawful"),
            chaotic: !traits.has("chaotic")
        };
    } else {
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

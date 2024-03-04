const MODULE_ID = 'pf2e-alignment-damage';

const resistanceMap = new Map([[-1, 1], [0, 1], [1, 2], [2, 2], [3, 3], [4, 4], [5, 4], [6, 5], [7, 5], [8, 6], [9, 6], [10, 7], [11, 7], [12, 8],
    [13, 8], [14, 9], [15, 9], [16, 9], [17, 10], [18, 10], [19, 11], [20, 11], [21, 12], [22, 12], [23, 13], [24, 13], [25, 14] //Level 25 resistance value: https://www.youtube.com/watch?v=3_lAb8m9MpI
])

const alignments = ["good", "evil", "lawful", "chaotic"];
const uppercaseAlignments = ["Good", "Evil", "Lawful", "Chaotic"];

const precisionEphemeralEffect = {
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

const alignmentEphemeralEffect = {
    _id: 'alignmentresists',
    name: 'Alignment Damage Immunity Replacement',
    system: {
        rules: [
            {
                key: "Resistance",
                type: "good",
                value: "replace"
            },
            {
                key: "Resistance",
                type: "evil",
                value: "replace"
            },
            {
                key: "Resistance",
                type: "lawful",
                value: "replace"
            },
            {
                key: "Resistance",
                type: "chaotic",
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
        getContextualCloneWrapper,
        'WRAPPER'
      )
      libWrapper.register(
        MODULE_ID,
        'CONFIG.Actor.documentClass.prototype.applyDamage',
        substituteDamage,
        'WRAPPER'
      )
  }
)

Hooks.on("preCreateChatMessage", (message) => {
    const replaceSetting = game.settings.get("pf2e-alignment-damage", "alignmentConfig");
    if (replaceSetting !== "replace" || !message.isRoll)
        return;
    // This is some aggressive jank
    let rolls = JSON.stringify(message.rolls);
    alignments.forEach(alignment => rolls = rolls.replaceAll(alignment, "spirit"));
    uppercaseAlignments.forEach(alignment => rolls = rolls.replaceAll(alignment, "Spirit"));
    let flavor = message.flavor;
    alignments.forEach(alignment => flavor = flavor.replaceAll(alignment, "spirit"));
    uppercaseAlignments.forEach(alignment => flavor = flavor.replaceAll(alignment, "Spirit"));
    message.updateSource({ rolls: JSON.parse(rolls), flavor: flavor })
    console.log(JSON.stringify(message))
})

function substituteDamage(wrapped, ...args) {
    const substituteSetting = game.settings.get("pf2e-alignment-damage", "alignmentConfig");
    if (substituteSetting !== "applySpirit")
        return wrapped(...args);
    let damage = args[0].damage;
    //probably just healing
    if (typeof damage === "number")
        return wrapped(...args);

    let terms = damage.terms;
    let finalTerms = [];
    terms.forEach(term => {
        let data = term.rolls[0].type;
        alignments.forEach(alignment => {
            if (data.includes(alignment))
                term.rolls[0].type = data.replace(alignment, "spirit");
        })
        finalTerms.push(term);
    })
    args[0].damage.terms = finalTerms;
    return wrapped(...args);
}

function getContextualCloneWrapper(wrapped, rollOptions, ephemeralEffects) {
    let effects = modifyPrecisionImmunity(this, rollOptions, ephemeralEffects);
    effects = addAlignmentResistance(this, rollOptions, effects);
    return wrapped(rollOptions, effects);
}

function modifyPrecisionImmunity(actor, rollOptions, ephemeralEffects) {
    const precisionSetting = game.settings.get("pf2e-alignment-damage", "precisionConfig");
    let isImmune = false;
    actor.attributes.immunities.forEach(immunity => {
        if (immunity.type === "precision")
            isImmune = true;
    })
    if (precisionSetting === "default" || !isImmune)
        return ephemeralEffects;

    let level = actor.level;
    let effect = structuredClone(precisionEphemeralEffect);
    effect.system.rules.forEach(rule => {
        if (rule.key === "Resistance")
            rule.value = (precisionSetting === "remove") ? 0 : resistanceMap.get(level);
    })
    ephemeralEffects.push(effect);
    return ephemeralEffects;
}

function addAlignmentResistance(actor, rollOptions, ephemeralEffects) {
    const alignmentSetting = game.settings.get("pf2e-alignment-damage", "alignmentConfig");
    if (alignmentSetting !== "matchingResists" && alignmentSetting !== "othersResist")
        return ephemeralEffects;

    let alignmentTraits = alignments.filter(alignment => actor.traits.has(alignment));
    let resist = resistanceMap.get(actor.level);
    let othersResist = alignmentSetting === "othersResist";
    let effect = structuredClone(alignmentEphemeralEffect);
    effect.system.rules.forEach(rule => {
        switch(rule.type) {
            case "good":
                if (alignmentTraits.includes("good"))
                    rule.value = resist;
                else if (othersResist && !alignmentTraits.includes("evil"))
                    rule.value = resist;
                else rule.value = 0;
                break;
            case "evil":
                if (alignmentTraits.includes("evil"))
                    rule.value = resist;
                else if (othersResist && !alignmentTraits.includes("good"))
                    rule.value = resist;
                else rule.value = 0;
                break;
            case "lawful":
                if (alignmentTraits.includes("lawful"))
                    rule.value = resist;
                else if (othersResist && !alignmentTraits.includes("chaotic"))
                    rule.value = resist;
                else rule.value = 0;
                break;
            case "chaotic":
                if (alignmentTraits.includes("chaotic"))
                    rule.value = resist;
                else if (othersResist && !alignmentTraits.includes("lawful"))
                    rule.value = resist;
                else rule.value = 0;
                break;

        }
    })
    ephemeralEffects.push(effect);
    return ephemeralEffects;
}

function modifyAlignmentImmunity(...args) {
    let damage = args[0];

    const possiblyUnaffected = ["void", "vitality", "bleed"];

    const damageType = (damage in CONFIG.PF2E.damageTypes)
      ? damage
      : damage.isOfType("condition")
        ? damage.system.persistent?.damageType ?? null
        : null;

    const alignmentSetting = game.settings.get("pf2e-alignment-damage", "alignmentConfig");
    if (alignments.includes((damageType))) {
        if (alignmentSetting === "all" || alignmentSetting === "matchingResists" || alignmentSetting === "othersResist") return true;
        else if (alignmentSetting === "none") return false;
        else possiblyUnaffected.push(...alignments)
    }

    if (!possiblyUnaffected.includes((damageType))) return true;

    const bleedSetting = game.settings.get("pf2e-alignment-damage", "bleedConfig");
    const vitalitySetting = game.settings.get("pf2e-alignment-damage", "vitalityConfig");
    const voidSetting = game.settings.get("pf2e-alignment-damage", "voidConfig");

    const {traits} = this;
    let damageIsApplicable;
    damageIsApplicable = {
        vitality: vitalityIsApplicable(vitalitySetting, this.modeOfBeing, this.attributes.hp?.negativeHealing),
        void: voidIsApplicable(voidSetting, this.modeOfBeing, this.attributes.hp?.negativeHealing),
        bleed: bleedIsApplicable(bleedSetting, this.modeOfBeing) || isReallyPC(this),
    };
    addAlignmentFields(damageIsApplicable, alignmentSetting, traits)

    return damageIsApplicable[damageType];
}

function isReallyPC(actor) {
    const traits = actor.traits;
    return actor.isOfType("character") && !(traits.has("minion") || traits.has("eidolon"));
}

function addAlignmentFields(isApplicable, moduleSetting, traits) {
    let alignmentIsApplicable;
    if (moduleSetting === "none") {
        alignmentIsApplicable = {};
    } else if (moduleSetting === "nonMatching") {
        alignmentIsApplicable = {
            good: !traits.has("good"),
            evil: !traits.has("evil"),
            lawful: !traits.has("lawful"),
            chaotic: !traits.has("chaotic")
        };
    } else {
        alignmentIsApplicable = {
            good: traits.has("evil"),
            evil: traits.has("good"),
            lawful: traits.has("chaotic"),
            chaotic: traits.has("lawful")
        };
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

function vitalityIsApplicable(moduleSetting, modeOfBeing, negativeHealing) {
    if (moduleSetting === "default")
        return !!negativeHealing;
    else if (moduleSetting === "nonConstructs")
        return modeOfBeing !== "construct";
    else return true;
}

function voidIsApplicable(moduleSetting, modeOfBeing, negativeHealing) {
    if (moduleSetting === "default")
        return !(modeOfBeing === "construct" || negativeHealing);
    else if (moduleSetting === "nonConstructs")
        return modeOfBeing !== "construct";
    else return true;
}

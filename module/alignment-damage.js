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
    if (!game.settings.get("pf2e-alignment-damage", "ignoreAlignment")) {
        possiblyUnaffected.push(...alignments);
    }

    const damageType = (damage in CONFIG.PF2E.damageTypes)
        ? damage
        : damage.isOfType("condition")
            ? damage.system.persistent?.damageType ?? null
            : null;

    if (!possiblyUnaffected.includes(damageType)) return true;

    const { traits } = this;
    let damageIsApplicable;
    damageIsApplicable = {
        good: !traits.has("good"),
        evil: !traits.has("evil"),
        lawful: !traits.has("lawful"),
        chaotic: !traits.has("chaotic"),
        positive: !!this.attributes.hp?.negativeHealing,
        negative: !(this.modeOfBeing === "construct" || this.attributes.hp?.negativeHealing),
        bleed: this.modeOfBeing === "living" || isReallyPC(this),
    };

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
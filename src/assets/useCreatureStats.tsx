import { Creature } from "../type";

export default function useCreatureStats() {

    const harm = (creature: Creature, dmg: number) => {
        let newCreature = creature;
        let newHp = creature.general.combat.hp - dmg;
        if (newHp > 0) {
            newCreature.general.combat.hp = newHp;
        } else {
            newCreature.general.combat.hp = 0;
        }
        return newCreature;
    }

    const heal = (creature: Creature, dmg: number) => {
        let newCreature = creature;
        let newHp = creature.general.combat.hp + dmg;
        const maxHp = creature.general.combat.hpMax;
        if (newHp < maxHp) {
            newCreature.general.combat.hp = newHp;
        } else {
            newCreature.general.combat.hp = maxHp;
        }
        return newCreature;
    }

    const tire = (creature: Creature, en: number) => {
        let newCreature = creature;
        let newEn = creature.general.energy.stamina - en;
        if (newEn > 0) {
            newCreature.general.energy.stamina = newEn;
        } else {
            newCreature.general.energy.stamina = 0;
        }
        return newCreature;
    }

    const rest = (creature: Creature, en: number) => {
        let newCreature = creature;
        let newEn = creature.general.energy.stamina + en;
        const maxEn = creature.general.energy.staminaMax;
        if (newEn < maxEn) {
            newCreature.general.energy.stamina = newEn;
        } else {
            newCreature.general.energy.stamina = maxEn;
        }
        return newCreature;
    }

    return {
        harm,
        heal,
        tire,
        rest
    }
}
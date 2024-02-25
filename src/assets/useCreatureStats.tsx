import { Creature } from "../type";

export default function useCreatureStats() {

    const harm = (creature: Creature, dmg: number) => {
        let newCreature = creature;
        let newHp = creature.general.health.hp - dmg;
        if (newHp > 0) {
            newCreature.general.health.hp = newHp;
        } else {
            newCreature.general.health.hp = 0;
        }
        return newCreature;
    }

    const heal = (creature: Creature, dmg: number) => {
        let newCreature = creature;
        let newHp = creature.general.health.hp + dmg;
        const maxHp = creature.general.health.hpMax;
        if (newHp < maxHp) {
            newCreature.general.health.hp = newHp;
        } else {
            newCreature.general.health.hp = maxHp;
        }
        return newCreature;
    }

    const tire = (creature: Creature, en: number) => {
        let newCreature = creature;
        let newEn = creature.general.health.energy - en;
        if (newEn > 0) {
            newCreature.general.health.energy = newEn;
        } else {
            newCreature.general.health.energy = 0;
        }
        return newCreature;
    }

    const rest = (creature: Creature, en: number) => {
        let newCreature = creature;
        let newEn = creature.general.health.energy + en;
        const maxEn = creature.general.health.energyMax;
        if (newEn < maxEn) {
            newCreature.general.health.energy = newEn;
        } else {
            newCreature.general.health.energy = maxEn;
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
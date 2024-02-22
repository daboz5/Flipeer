import { Creature } from "../type";
import useAppStore from "../useAppStore"
import useMap from "./useMap";


export default function useGame() {

    const {
        player,
        mapNums,
        setMapData,
    } = useAppStore();
    const { createMapData } = useMap();

    const newGame = () => {
        let newData = createMapData(mapNums.mapSize);
        newData[Math.floor(newData.length / 2)].creature = player;
        setMapData(newData);
    };

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
        let newEn = creature.general.food.energy - en;
        if (newEn > 0) {
            newCreature.general.food.energy = newEn;
        } else {
            newCreature.general.food.energy = 0;
        }
        return newCreature;
    }

    const rest = (creature: Creature, en: number) => {
        let newCreature = creature;
        let newEn = creature.general.food.energy + en;
        const maxEn = creature.general.food.energyMax;
        if (newEn < maxEn) {
            newCreature.general.food.energy = newEn;
        } else {
            newCreature.general.food.energy = maxEn;
        }
        return newCreature;
    }

    return {
        newGame,
        harm,
        heal,
        tire,
        rest
    }
}
import { Creature } from "../type";
import useAppStore from "../useAppStore"
import useMap from "./useMap";

export default function useGame() {

    const {
        mapNums,
        setMapData,
        setPlayer
    } = useAppStore();
    const { createMapData } = useMap();

    const newGamePlayer: Creature = {
        id: "player",
        orientation: 0,
        general: {
            body: {
                color: "pink",
                size: 1,
                sizeMax: 2,
                segmentation: [],
            },
            combat: {
                attack: 0,
                defence: 0,
            },
            health: {
                energy: 3,
                energyMax: 3,
                energySourse: [],
                hp: 5,
                hpMax: 5,
                storage: 0,
                storageMax: 0,
            },
            movements: [],
            resistences: [],
            temperature: [{ scale: 2, description: "hot" }],
        },

    }

    const newGame = () => {
        let newData = createMapData(mapNums.mapSize);
        newData[Math.floor(newData.length / 2)].creature = newGamePlayer;
        setPlayer(newGamePlayer);
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
        newGame,
        harm,
        heal,
        tire,
        rest
    }
}
import { Creature, Tile } from "../type";
import useAppStore from "../useAppStore";
import useBasicFunction from "./useBasicFunction";
import useCreatureStats from "./useCreatureStats";

export default function useCreature() {

    const {
        mapNums,
        mapData,
        setMapData
    } = useAppStore();
    const { getRandomNum } = useBasicFunction();
    const {
        harm,
        heal,
        tire,
        rest,
    } = useCreatureStats();

    const creatureDataBase: Creature[] = [
        {
            name: "vektor gamus",
            type: "alien",
            orientation: 0,
            general: {
                body: {
                    color: "yellow",
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

        },
    ]

    const createCreatureData = (name: string, str: number) => {
        const ranNum = getRandomNum(10);
        const presence = str / ranNum;
        if (presence >= 1) {
            const creature = creatureDataBase.find(
                creature => creature.name === name
            );
            return creature
        } else {
            return null;
        }
    }

    const testMove = (mapData: Tile) => {
        const occupants = mapData.creature;
        // const terrain = mapData.terrain;

        if (occupants) {
            return {
                move: false
            }
        }

        return {
            move: true
        }
    }

    const afterMove = (creature: Creature, mapData: Tile) => {
        // const occupants = mapData.creature;
        const terrain = mapData.terrain;

        if (terrain.type === "vulcano") {
            creature = harm(creature, 2);
            creature = rest(creature, 3);
        }

        if (terrain.type === "atVulcano") {
            creature = heal(creature, 1);
            creature = rest(creature, 2);
        }

        if (terrain.type === "sea") {
            creature = tire(creature, 1);
        }
    }

    const startMove = (
        creature: Creature,
        mapFromData: Tile,
        mapToData: Tile,
        mapData: Tile[]
    ) => {
        if (testMove(mapToData)) {
            afterMove(creature, mapToData);
            mapFromData.creature = null;
            mapToData.creature = creature;
            setMapData(mapData);
        }
    }

    const rotate = (howMuch: number, creature: Creature, fromIndex: number, mapData: Tile[]) => {
        creature.orientation = creature.orientation + howMuch;
        mapData[fromIndex].creature = creature;
        setMapData(mapData);
    }

    const forceRest = (creature: Creature) => {
        if (!creature.general.health.energy) {
            creature.general.health.energy++;
            setMapData(mapData);
            return false;
        } else { return true }
    }

    const eventListenerMove = (event: KeyboardEvent) => {
        if (!mapData) { return }
        const key = event.key;
        const moveKeys = [
            "q", "Q",
            "w", "W",
            "e", "E",
            "a", "A",
            "s", "S",
            "d", "D",
            "r", "R",
            "f", "F"
        ]

        if (moveKeys.includes(key)) {

            const fromIndex = mapData.findIndex((hex) => hex.creature?.type === "player");
            if (fromIndex === -1) { return }
            let creature = mapData[fromIndex].creature;
            if (!creature) { return }

            /*CHECK IF ALIVE*/
            if (!creature.general.health.hp) { return }

            /*ROTATE CREATURE THEN EXIT*/
            if (key === "r" || key === "R") {
                rotate(-60, creature, fromIndex, mapData);
                return
            } else if (key === "f" || key === "F") {
                rotate(60, creature, fromIndex, mapData);
                return
            }

            /*MOVE TO TILE CHECKS*/
            if (key === "q" || key === "Q") {
                moveLF(creature, fromIndex, mapData);
            }
            else if (key === "w" || key === "W") {
                moveF(creature, fromIndex, mapData);
            }
            else if (key === "e" || key === "E") {
                moveRF(creature, fromIndex, mapData);
            }
            else if (key === "a" || key === "A") {
                moveLB(creature, fromIndex, mapData);
            }
            else if (key === "s" || key === "S") {
                moveB(creature, fromIndex, mapData);
            }
            else if (key === "d" || key === "D") {
                moveRB(creature, fromIndex, mapData);
            }
        }
    }

    const moveLF = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const { y: pcY, z: pcZ } = mapData[fromIndex].coor;
        const mapRadius = mapNums.mapRadius;
        if (pcZ < mapRadius && pcY > -mapRadius) {
            const moveToIndex = fromIndex - 1;
            creature.orientation = -60;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData[fromIndex],
                    mapData[moveToIndex],
                    mapData
                );
            }
        }
    };

    const moveF = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const { x: pcX, y: pcY } = mapData[fromIndex].coor;
        const mapRadius = mapNums.mapRadius;
        const radius = mapRadius * 2;
        let midDistance = Math.abs(pcX);
        if (pcX < 0) { midDistance-- }
        if (pcX < mapRadius && pcY > -mapRadius) {
            const moveToIndex = fromIndex + radius - midDistance;
            creature.orientation = 0;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData[fromIndex],
                    mapData[moveToIndex],
                    mapData
                );
            }
        }
    };

    const moveRF = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const { x: pcX, z: pcZ } = mapData[fromIndex].coor;
        const mapRadius = mapNums.mapRadius;
        let radius = mapRadius * 2;
        let midDistance = Math.abs(pcX);
        if (pcX < 0) { midDistance-- }
        if (pcX < mapRadius && pcZ > -mapRadius) {
            const moveToIndex = fromIndex + (radius + 1) - midDistance;
            creature.orientation = 60;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData[fromIndex],
                    mapData[moveToIndex],
                    mapData
                );
            }
        }
    };

    const moveLB = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const { x: pcX, z: pcZ } = mapData[fromIndex].coor;
        const mapRadius = mapNums.mapRadius;
        let radius = mapRadius * 2;
        let midDistance = Math.abs(pcX);
        if (pcX > 0) { midDistance-- }
        if (pcZ < mapRadius && pcX > -mapRadius) {
            const moveToIndex = fromIndex - (radius + 1) + midDistance;
            creature.orientation = -120;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData[fromIndex],
                    mapData[moveToIndex],
                    mapData
                );
            }
        }
    };

    const moveB = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const { x: pcX, y: pcY } = mapData[fromIndex].coor;
        const mapRadius = mapNums.mapRadius;
        let radius = mapRadius * 2;
        let midDistance = Math.abs(pcX);
        if (pcX > 0) { midDistance-- }
        if (pcY < mapRadius && pcX > -mapRadius) {
            const moveToIndex = fromIndex - radius + midDistance;
            creature.orientation = 180;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData[fromIndex],
                    mapData[moveToIndex],
                    mapData
                );
            }
        }
    };

    const moveRB = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const { y: pcY, z: pcZ } = mapData[fromIndex].coor;
        const mapRadius = mapNums.mapRadius;
        if (pcZ > -mapRadius && pcY < mapRadius) {
            const moveToIndex = fromIndex + 1;
            creature.orientation = 120;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData[fromIndex],
                    mapData[moveToIndex],
                    mapData
                );
            }
        }
    };

    return {
        eventListenerMove,
        createCreatureData
    }
}
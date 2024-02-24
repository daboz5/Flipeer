import { Creature, Tile } from "../type";
import useAppStore from "../useAppStore";
import useGame from "./useGame";

export default function useCreature() {

    const {
        mapNums,
        mapData,
        setMapData
    } = useAppStore();
    const {
        harm,
        heal,
        tire,
        rest,
    } = useGame();

    const testMove = (mapData: Tile) => {
        const occupants = mapData.creature;
        const terrain = mapData.terrain;

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
        const occupants = mapData.creature;
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

            const fromIndex = mapData.findIndex((hex) => hex.creature?.id === "player");
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
        const mapSize = mapNums.mapSize;
        if (pcZ < mapSize && pcY > -mapSize) {
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
        const mapSize = mapNums.mapSize;
        const radius = mapSize * 2;
        let midDistance = Math.abs(pcX);
        if (pcX < 0) { midDistance-- }
        if (pcX < mapSize && pcY > -mapSize) {
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
        const mapSize = mapNums.mapSize;
        let radius = mapSize * 2;
        let midDistance = Math.abs(pcX);
        if (pcX < 0) { midDistance-- }
        if (pcX < mapSize && pcZ > -mapSize) {
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
        const mapSize = mapNums.mapSize;
        let radius = mapSize * 2;
        let midDistance = Math.abs(pcX);
        if (pcX > 0) { midDistance-- }
        if (pcZ < mapSize && pcX > -mapSize) {
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
        const mapSize = mapNums.mapSize;
        let radius = mapSize * 2;
        let midDistance = Math.abs(pcX);
        if (pcX > 0) { midDistance-- }
        if (pcY < mapSize && pcX > -mapSize) {
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
        const mapSize = mapNums.mapSize;
        if (pcZ > -mapSize && pcY < mapSize) {
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
        eventListenerMove
    }
}
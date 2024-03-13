import { Creature, Tile } from "../type";
import useAppStore from "../useAppStore";
import useAI from "./useAI";
import useBasicFunction from "./useBasicFunction";
import useCompass from "./useCompass";
import useCreatureStats from "./useCreatureStats";

export default function useCreature() {

    const {
        mapNums,
        mapData,
        setMapData
    } = useAppStore();
    const { getRandomNum } = useBasicFunction();
    const { prioritize } = useAI();
    const {
        guessLF, guessF, guessRF,
        guessLB, guessB, guessRB,
        roundReach
    } = useCompass();
    const {
        harm,
        heal,
        tire,
        rest,
    } = useCreatureStats();

    const creatureDataBase: Creature[] = [
        {
            alive: true,
            genepool: [],
            general: {
                awareness: {
                    all: 1,
                    lf: 0,
                    f: 0,
                    rf: 0,
                    lb: 0,
                    b: 0,
                    rb: 0,
                },
                body: {
                    color: "yellow",
                    size: 1,
                    sizeMax: 2,
                    segmentation: [],
                },
                combat: {
                    attack: 0,
                    defence: 0,
                    hp: 5,
                    hpMax: 5,
                },
                energy: {
                    stamina: 3,
                    staminaMax: 3,
                    metabolizes: [],
                    storage: 0,
                    storageMax: 0,
                },
                movements: [],
                resistences: [],
                temperature: [{ scale: 2, description: "hot" }],
            },
            interest: -1,
            name: "vektor gamus",
            orientation: 0,
            type: "NPC",
        },
    ]

    const createCreatureData = (name: string, str: number, biom: number) => {
        const ranNum = getRandomNum(10); // RANDOMIZIRAJ KJE JE TIP BITJA
        const presence = (str / ranNum) / (5 / biom); // VSA POLJA NE MOREJO BITI ZASEDENA BREZ MOČNEGA BIOMA
        if (presence >= 1) {
            const creature = creatureDataBase.find(
                creature => creature.name === name
            );
            return creature
        } else {
            return null;
        }
    }

    const checkForCombatAndLoot = (creature: Creature, mapToData: Tile) => {
        const occupants = mapToData.creature?.general;
        const attacker = creature.general;

        if (occupants !== undefined) {
            const dmg = attacker.combat.attack - occupants.combat.defence
            const newOccHp = occupants.combat.hp - dmg;

            if (dmg > 0 && newOccHp <= 0) {
                occupants.combat.hp = 0;
                const energyGain = Math.floor(attacker.body.size / 100) + 1;
                const newEnergy = attacker.energy.stamina + energyGain;
                const energyMax = attacker.energy.staminaMax;

                if (energyMax < newEnergy) {
                    attacker.energy.stamina = energyMax;
                } else {
                    attacker.energy.stamina = newEnergy;
                }

                if (((occupants.body.size * 2) <= attacker.body.size)) {
                    return true;
                } else {
                    const bodyEaten = occupants.body.size / 2;
                    occupants.body.size - bodyEaten;
                    return false;
                }

            } else if (dmg > 0) {
                occupants.combat.hp = newOccHp;
                return false;

            } else {
                return false;
            }
        }

        return true;
    }

    const afterMove = (creature: Creature, mapData: Tile[], toIndex: number) => {
        // const occupants = mapData.creature;

        const terrain = mapData[toIndex].terrain;

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

        if (creature.type === "player") {
            pcSight(creature, mapData, toIndex)
        }
    }

    const startMove = (
        creature: Creature,
        mapData: Tile[],
        fromIndex: number,
        toIndex: number,
    ) => {

        const checkCombat = checkForCombatAndLoot(creature, mapData[toIndex]);
        if (checkCombat) {
            afterMove(creature, mapData, toIndex);
            mapData[fromIndex].creature = null;
            mapData[toIndex].creature = creature;
        } else {
            afterMove(creature, mapData, fromIndex);
        }

        setMapData(mapData);
    }

    const rotate = (howMuch: number, creature: Creature, fromIndex: number, mapData: Tile[]) => {
        creature.orientation = creature.orientation + howMuch;
        mapData[fromIndex].creature = creature;
        setMapData(mapData);
    }

    const forceRest = (creature: Creature) => {
        if (!creature.general.energy.stamina) {
            creature.general.energy.stamina++;
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
            if (!creature.general.combat.hp) { return }

            /*ROTATE CREATURE THEN EXIT*/
            if (key === "r" || key === "R") {
                rotate(-60, creature, fromIndex, mapData);
                return
            } else if (key === "f" || key === "F") {
                rotate(60, creature, fromIndex, mapData);
                return
            }

            aiTurn(mapData);

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

    const aiTurn = (mapData: Tile[]) => {
        mapData.forEach((tile, index) => {
            const creature = tile.creature;
            if (
                creature &&
                creature.alive
                // creature.type !== "player"
            ) {
                evaluate(creature, mapData, index);
            }
        });
    }

    const evaluate = (
        creature: Creature,
        mapData: Tile[],
        index: number
    ) => {
        const result = roundReach(mapData, index, creature.general.awareness.all);
        return result;
    }

    const pcSight = (
        creature: Creature,
        mapData: Tile[],
        index: number
    ) => {
        mapData.map(tile => tile.seen = 0);
        const extraSight = roundReach(mapData, index, (creature.general.awareness.all + 1));
        extraSight.forEach(ind => mapData[ind].seen = 25);
        const sight = roundReach(mapData, index, creature.general.awareness.all);
        sight.forEach(index => mapData[index].seen = 100);
    }

    const moveLF = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const coor = mapData[fromIndex].info.coor;
        const mapRad = mapNums.mapRadius;
        if (coor.z < mapRad && coor.y > -mapRad) {
            creature.orientation = -60;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData,
                    fromIndex,
                    guessLF(fromIndex, coor)
                );
            }
        }
    };

    const moveF = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const coor = mapData[fromIndex].info.coor;
        const mapRad = mapNums.mapRadius;
        if (coor.x < mapRad && coor.y > -mapRad) {
            creature.orientation = 0;
            const rested = forceRest(creature);
            if (rested) {
                /*TESTNO OKOLJE*/
                const arr = roundReach(mapData, fromIndex, 2);
                const newMapData = prioritize(fromIndex, arr, mapData);
                console.log(newMapData)
                /*TESTNO OKOLJE*/
                // startMove(
                //     creature,
                //     mapData,
                //     fromIndex,
                //     guessF(fromIndex, coor, mapRad)
                // );
            }
        }
    };

    const moveRF = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const coor = mapData[fromIndex].info.coor;
        const mapRad = mapNums.mapRadius;
        if (coor.x < mapRad && coor.z > -mapRad) {
            creature.orientation = 60;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData,
                    fromIndex,
                    guessRF(fromIndex, coor, mapRad)
                );
            }
        }
    };

    const moveLB = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const coor = mapData[fromIndex].info.coor;
        const mapRad = mapNums.mapRadius;
        if (coor.z < mapRad && coor.x > -mapRad) {
            creature.orientation = -120;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData,
                    fromIndex,
                    guessLB(fromIndex, coor, mapRad)
                );
            }
        }
    };

    const moveB = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const coor = mapData[fromIndex].info.coor;
        const mapRad = mapNums.mapRadius;
        if (coor.y < mapRad && coor.x > -mapRad) {
            creature.orientation = 180;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData,
                    fromIndex,
                    guessB(fromIndex, coor, mapRad)
                );
            }
        }
    };

    const moveRB = (
        creature: Creature,
        fromIndex: number,
        mapData: Tile[]
    ) => {
        const coor = mapData[fromIndex].info.coor;
        const mapRadius = mapNums.mapRadius;
        if (coor.z > -mapRadius && coor.y < mapRadius) {
            creature.orientation = 120;
            const rested = forceRest(creature);
            if (rested) {
                startMove(
                    creature,
                    mapData,
                    fromIndex,
                    guessRB(fromIndex, coor)
                );
            }
        }
    };

    return {
        eventListenerMove,
        createCreatureData,
        pcSight
    }
}
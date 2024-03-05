import { Coor, Creature, Tile, TileEvaluation } from "../type"
import useAppStore from "../useAppStore";

export default function useAI() {

    const { mapNums } = useAppStore();
    const mapRad = mapNums.mapRadius;

    const evaluate = (
        creature: Creature,
        indexArr: number[],
        mapData: Tile[]
    ) => {
        const evalArr = indexArr.map(
            (index) => {
                const tile = mapData[index];
                const occupied = tile.creature;
                const terrain = tile.terrain;
                const context = tile.context;
                const crGen = creature.general;
                const crCom = crGen.combat;

                let desire = 0;
                let hardNo = false;
                let flee = false;
                let hunt = false;

                if (occupied) {
                    const ocGen = occupied.general;
                    const ocCom = ocGen.combat;
                    if (occupied.alive === false) {
                        desire++;
                        desire++;
                    } else if (occupied.name === creature.name) {
                        desire++;
                        hardNo = true;
                    } else {
                        if (ocCom.attack > crCom.defence) {
                            desire--;
                        }
                        if (ocCom.attack > (crCom.defence * 2)) {
                            desire--;
                        }
                        if (ocCom.attack > (crCom.defence + crCom.hp - ocCom.attack)) {
                            desire--;
                            desire--;
                            flee = true;
                        }
                        if (ocCom.defence < crCom.attack) {
                            desire++;
                        }
                        if (crCom.attack > (ocCom.defence + ocCom.hp - crCom.attack)) {
                            desire++;
                        }
                    }
                }

                if (terrain) {
                    if (terrain.type === "atVulcano") {
                        desire++;
                    }
                    if (terrain.type === "vulcano") {
                        desire--;
                        desire--;
                    }
                }

                if (context) {
                    if (context.border) {
                        desire--;
                    }
                    if (context.tileTypes.includes("atVulcano")) {
                        desire++;
                    }
                }

                return {
                    index: index,
                    desire: desire,
                    hardNo: hardNo,
                    flee: flee,
                    hunt: hunt,
                }
            }
        )
        return evalArr;
    };

    const findPath = (
        whereFrom: number,
        whereTo: number,
        mapData: Tile[],
    ) => {
        const startCoor = mapData[whereFrom].info.coor;
        const finishCoor = mapData[whereTo].info.coor;
        let fromCoor = startCoor;
        finishCoor
        fromCoor
        mapRad

        if (whereFrom === whereTo) {
            return;
        } else {
            let srcCoor: {
                to: Coor,
                from: Coor
            }[] = [];

            let found = false;
            while (!found || srcCoor.length >= mapData.length) {
                /*NOT FINISHED*/
            }
        }
    }

    const prioritize = (
        center: number,
        creature: Creature,
        indexArr: number[],
        mapData: Tile[],
    ) => {

        /*EVALUATE SURROUNDING*/
        const evalArr = evaluate(creature, indexArr, mapData);

        /*MAKE SELECTION*/
        const finalSelection: TileEvaluation[] = [];
        const flee: TileEvaluation[] = [];
        const hunt: TileEvaluation[] = [];
        const hardNo: TileEvaluation[] = [];
        evalArr.forEach((el) => {
            if (el.flee) { flee.push(el) }
            if (el.hunt) { hunt.push(el) }
            if (el.hardNo) { hardNo.push(el) }
            if (el.desire > 0 && finalSelection.length < 6) {
                finalSelection.push(el);
            } else if (el.desire > 0) {
                finalSelection.map(fin => {
                    if (fin.desire < el.desire) { return el } else { return fin }
                });
            }
        })

        /*PRIORITIZE*/
        /*NE POZABI VKLJUČITI NO NO*/
        if (flee.length > hunt.length) {
            /*FLEE*/
        } else if (hunt) {
            /*HUNT*/
        } else {
            /*MOVE*/
        }
        const path = findPath(center, 23, mapData);
        console.log(path);
    }

    return {
        prioritize
    }
}
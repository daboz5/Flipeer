import { Creature, Tile, TileEvaluation } from "../type"

export default function useAI() {

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
        inxFrom: number,
        inxTo: number,
        searchData: number[],
        mapData: Tile[],
    ) => {

        const start = { from: inxFrom, to: inxFrom }

        /*MARK POSSIBLE WAYS*/
        let markCoor: {
            from: number,
            to: number
        }[] = [start];
        let fromInx = inxFrom;
        let found = false;

        for (let i = 0; i < searchData.length; i++) {
            if (i > 0 && markCoor.length === 1) {
                i = searchData.length;
            } else {
                let mD = mapData[fromInx];

                for (let j = 0; j < 6; j++) {
                    if (markCoor.findIndex(mark => mark.to === mD.context.indexes[j]) === -1) {
                        let newLocation = {
                            from: fromInx,
                            to: mD.context.indexes[j]
                        }
                        markCoor.push(newLocation);
                        if (mD.context.indexes[j] === inxTo) { found = true }
                    }
                }

                if (found) { i = searchData.length }
                else { fromInx = markCoor[i + 1].to }
            }
        }

        /*DETERMINE PATH*/
        if (found) {
            let path = [];
            let where = inxTo;
            let finished = false;
            while (!finished) {
                const track = markCoor.find(mark => mark.to === where);
                if (track) {
                    path.push(track);
                    where = track.from;
                    if (track.to === track.from) { finished = true }
                } else { finished = true }
            }

            return path.reverse();
        } else {
            return start;
        }
    };

    const prioritize = (
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

        /*PRODUKT MORA BITI SPECIFIČNI INDEX + OPOZORILO*/
        // console.log(path);
    }

    return {
        prioritize,
        findPath
    }
}
import { Creature, MoveEval, Tile, TileEvaluation } from "../type"
import useCompass from "./useCompass";

export default function useAI() {

    const { findOppositeIndex, findTowardsIndex } = useCompass();

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

        /*MARK POSSIBLE WAYS*/
        let markCoor: {
            from: number,
            to: number
        }[] = [];
        let fromInx = inxFrom;
        let found = false;

        for (let i = 0; i < searchData.length; i++) {
            if (i > 0 && markCoor.length === 0) {
                i = searchData.length;
            } else {
                const mD = mapData[fromInx];
                const conLength = mD.context.indexes.length;

                for (let j = 0; j < conLength; j++) {
                    if (
                        markCoor.findIndex(mark => mark.to === mD.context.indexes[j]) === -1 &&
                        mD.context.indexes[j] !== inxFrom) {
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
            return [{ from: inxFrom, to: inxFrom }];
        }
    };

    const prioritize = (
        fromIndex: number,
        limitArr: number[],
        mapData: Tile[],
    ) => {

        /*EVALUATE SURROUNDING*/
        const creature = mapData[fromIndex].creature;
        let evalArr: TileEvaluation[] = []
        let pastInterest = -1;
        if (creature) {
            evalArr = evaluate(creature, limitArr, mapData);
            if (fromIndex === pastInterest) {
                pastInterest = -1;
            } else {
                pastInterest = creature.interest;
            }
        }

        /*MAKE SELECTION*/
        const bestArr: {
            desire: number,
            path: { from: number; to: number; }[]
        }[] = [];
        const fleeArr: {
            path: { from: number; to: number; }[]
        }[] = [];
        const huntArr: {
            path: { from: number; to: number; }[]
        }[] = [];
        const hardNoArr: number[] = [];

        evalArr.forEach((el, index) => {
            const elPath = findPath(fromIndex, el.index, limitArr, mapData);
            if (el.flee) { fleeArr.push({ path: elPath }) }
            if (el.hunt) { huntArr.push({ path: elPath }) }
            if (el.hardNo) { hardNoArr.push(el.index) }

            if (pastInterest === -1) {
                if (bestArr.length < 3) {
                    bestArr.push({
                        desire: el.desire,
                        path: elPath
                    });
                } else {
                    let replaced = false;
                    bestArr.forEach((best, index) => {
                        const desireDif = el.desire - best.desire;
                        const pathDif = best.path.length - elPath.length;
                        if (desireDif > -2 && pathDif + desireDif > 0 && !replaced) {
                            replaced = true;
                            bestArr[index] = {
                                desire: el.desire,
                                path: elPath
                            }
                        }
                    });
                }

            } else if (index === 0) {
                const path = findPath(fromIndex, pastInterest, limitArr, mapData);
                if (path) {
                    bestArr.push({
                        desire: 5,
                        path: path
                    })
                } else {
                    bestArr.push({
                        desire: 5,
                        path: [{ from: fromIndex, to: fromIndex }]
                    })
                }
            }
        })

        let decision: {
            whereTo: number;
            remember: number;
        } = { whereTo: fromIndex, remember: pastInterest ? pastInterest : -1 }

        /*FLEE*/
        if (fleeArr.length > huntArr.length) {
            console.log(fleeArr, huntArr)
            const fleeOptions = fleeEval(fleeArr, mapData);
            let search = { desperation: false, position: 0 };
            while (search.position < fleeOptions.length) {
                const option = fleeOptions[search.position];
                if (hardNoArr.indexOf(option.loc) !== -1) {
                    search.position = search.position++;
                } else {
                    if (search.desperation) {
                        decision.whereTo = option.loc;
                        return decision;
                    } else {
                        if (mapData[option.loc].terrain.type !== "vulcano") {
                            decision.whereTo = option.loc;
                            return decision;
                        } else if (search.position === fleeOptions.length - 1 && !search.desperation) {
                            search.desperation = true;
                            search.position = -1;
                        } else { return decision }
                    }
                    search.position = search.position++;
                }
            }

        }

        /*HUNT*/
        else if (huntArr.length > 0) {
            const huntData = huntEval(huntArr, mapData);
            const huntEvaluation = huntData.evaluation;
            const huntPath = huntData.path;
            let option = 0;
            while (option < huntEvaluation.length) {
                const optInx = huntEvaluation[option].loc;
                if (hardNoArr.indexOf(optInx) !== -1) {
                    option = option++;
                } else {
                    if (mapData[optInx].terrain.type !== "vulcano") {
                        decision.whereTo = optInx;
                        decision.remember = huntPath[huntPath.length - 1].to;
                        return decision;
                    }
                    option = option++;
                }
                if (option === huntEvaluation.length) { return decision }
            }
        }

        /*MOVE*/
        else {
            const moveData = moveEval(bestArr, mapData);
            const moveEvaluation = moveData.evaluation;
            let option = 0;
            while (option < moveEvaluation.length) {
                const optInx = moveEvaluation[option].loc;
                if (hardNoArr.indexOf(optInx) !== -1) {
                    option = option++;
                } else {
                    if (mapData[optInx].terrain.type !== "vulcano") {
                        decision.whereTo = optInx;
                        return decision;
                    }
                    option = option++;
                }
                if (option === moveEvaluation.length) { return decision }
            }
        }
        /*UGOTAVLJANJE KROGOV JE DELNO POKVARJENO, POPRAVI*/
    }

    const fleeEval = (
        fleeArr: { path: { from: number; to: number; }[] }[],
        mapData: Tile[]
    ) => {
        const fromIndex = fleeArr[0].path[0].from;
        let finalEval: MoveEval = {
            F: { loc: fromIndex, str: 0 },
            B: { loc: fromIndex, str: 0 },
            RF: { loc: fromIndex, str: 0 },
            LF: { loc: fromIndex, str: 0 },
            RB: { loc: fromIndex, str: 0 },
            LB: { loc: fromIndex, str: 0 }
        };

        fleeArr.forEach((fear, index) => {
            const awayFromDanger = findOppositeIndex(fromIndex, fear.path[0].to, mapData);
            if (index === 0) {
                finalEval = awayFromDanger;
            } else {
                finalEval.B.str = finalEval.B.str + awayFromDanger.B.str;
                finalEval.F.str = finalEval.F.str + awayFromDanger.F.str;
                finalEval.LF.str = finalEval.LF.str + awayFromDanger.LF.str;
                finalEval.RF.str = finalEval.RF.str + awayFromDanger.RF.str;
                finalEval.LB.str = finalEval.LB.str + awayFromDanger.LB.str;
                finalEval.RB.str = finalEval.RB.str + awayFromDanger.RB.str;
            }
        });

        let orderedEval = [finalEval.B, finalEval.F, finalEval.LB, finalEval.LF, finalEval.RB, finalEval.RF];
        orderedEval.sort((a, b) => a.str - b.str).reverse();
        return orderedEval;
    }

    const huntEval = (
        huntArr: { path: { from: number, to: number }[] }[],
        mapData: Tile[]
    ) => {

        const fromIndex = huntArr[0].path[0].from;
        let hunt: {
            path: { from: number, to: number }[]
        } = { path: [{ from: fromIndex, to: fromIndex }] };

        huntArr.forEach((prayInx, index) => {
            if (index === 0 || hunt.path.length > prayInx.path.length) {
                hunt = prayInx;
            }
        })

        const bestMove = findTowardsIndex(fromIndex, hunt.path[0].to, mapData);
        let orderedEval = [
            bestMove.B,
            bestMove.F,
            bestMove.LB,
            bestMove.LF,
            bestMove.RB,
            bestMove.RF
        ].sort((a, b) => a.str - b.str).reverse();

        const huntData = {
            evaluation: orderedEval,
            path: hunt.path
        }

        return huntData;
    }

    const moveEval = (
        bestMovesArr: {
            desire: number,
            path: { from: number; to: number; }[]
        }[],
        mapData: Tile[]
    ) => {

        const fromIndex = bestMovesArr[0].path[0].from;
        let bestDesire = 0;
        let bestPath: { from: number, to: number }[] = [];

        bestMovesArr.forEach((move, index) => {
            if (index === 0) {
                bestDesire = move.desire;
                bestPath = move.path;
            } else {
                const desireDif = move.desire - bestDesire;
                const pathDif = bestPath.length - move.path.length;
                if (desireDif > -1 || pathDif > 0) {
                    if (desireDif > 2) {
                        bestDesire = move.desire;
                        bestPath = move.path;
                    } else if (desireDif > -1 && pathDif + desireDif > 0) {
                        bestDesire = move.desire;
                        bestPath = move.path;
                    }
                }
            }
        })

        const bestMove = findTowardsIndex(fromIndex, bestPath[0].to, mapData);
        let orderedEval = [
            bestMove.B,
            bestMove.F,
            bestMove.LB,
            bestMove.LF,
            bestMove.RB,
            bestMove.RF
        ].sort((a, b) => a.str - b.str).reverse();

        const moveData = {
            evaluation: orderedEval,
            path: bestPath
        }

        return moveData;
    }

    return {
        prioritize,
        findPath
    }
}
import { Coor, MoveEval, Tile } from "../type";
import useAppStore from "../useAppStore";

export default function useCompass() {

    const { mapNums } = useAppStore();
    const { mapRadius: mapRad } = mapNums;

    const guessLF = (index: number, coor: Coor) => {
        if (coor.y - 1 >= -mapRad && coor.z + 1 <= mapRad) {
            return index - 1;
        } else { return index }
    }

    const guessF = (index: number, coor: Coor, mapRad: number) => {
        if (coor.y - 1 >= -mapRad && coor.x + 1 <= mapRad) {
            let midDis = Math.abs(coor.x);
            if (coor.x < 0) { midDis-- }
            return index + (mapRad * 2) - midDis;
        } else { return index }
    }

    const guessRF = (index: number, coor: Coor, mapRad: number) => {
        if (coor.z - 1 >= -mapRad && coor.x + 1 <= mapRad) {
            let midDis = Math.abs(coor.x);
            if (coor.x < 0) { midDis-- }
            return index + ((mapRad * 2) + 1) - midDis;
        } else { return index }
    }

    const guessLB = (index: number, coor: Coor, mapRad: number) => {
        if (coor.x - 1 >= -mapRad && coor.z + 1 <= mapRad) {
            let midDis = Math.abs(coor.x);
            if (coor.x > 0) { midDis-- }
            return index - (((mapRad * 2) + 1)) + midDis;
        } else { return index }
    }

    const guessB = (index: number, coor: Coor, mapRad: number) => {
        if (coor.x - 1 >= -mapRad && coor.y + 1 <= mapRad) {
            let midDis = Math.abs(coor.x);
            if (coor.x > 0) { midDis-- }
            return index - (mapRad * 2) + midDis;
        } else { return index }
    }

    const guessRB = (index: number, coor: Coor) => {
        if (coor.z - 1 >= -mapRad && coor.y + 1 <= mapRad) {
            return index + 1;
        } else { return index }
    }

    const roundReach = (
        map: Tile[],
        center: number,
        rad: number,
        excludeCenter?: boolean
    ) => {

        const { x, y, z } = map[center].info.coor;

        /*OZAVESTI ROB*/
        // let xNeg = rad;
        // let xPoz = rad;
        let yNeg = rad;
        let yPoz = rad;
        let zNeg = rad;
        let zPoz = rad;

        if (
            z + rad <= mapRad && z - rad >= -mapRad &&
            y + rad <= mapRad && y - rad >= -mapRad &&
            x + rad <= mapRad && x - rad >= -mapRad
        ) {
        } else {
            // if (x + rad > mapRad && mapRad - x < rad) {
            //     xPoz = mapRad - x;
            // }
            // if (x - rad < -mapRad && mapRad + x < rad) {
            //     xNeg = mapRad + x;
            // }
            if (y + rad > mapRad && mapRad - y < rad) {
                yPoz = mapRad - y;
            }
            if (y - rad < -mapRad && mapRad + y < rad) {
                yNeg = mapRad + y;
            }
            if (z + rad > mapRad && mapRad - z < rad) {
                zPoz = mapRad - z;
            }
            if (z - rad < -mapRad && mapRad + z < rad) {
                zNeg = mapRad + z;
            }
        }

        /*ZAČNI INTUIRATI IZ*/
        let pozIndex = center;
        let negIndex = center;
        if (x >= 0) {
            pozIndex = pozIndex - yNeg;
            negIndex = negIndex - yNeg;
        } else {
            pozIndex = pozIndex - zPoz;
            negIndex = negIndex - zPoz;
        }

        /*ZBERI VREDNOSTI*/
        let indexArr: number[] = [];

        if (x >= 0) {
            for (let i = 0; i < (yNeg + zNeg + 1); i++) {
                if (excludeCenter && center - yNeg + i === center) { } else {
                    indexArr.push(center - yNeg + i);
                }
            }
        } else {
            for (let i = 0; i < (zPoz + yPoz + 1); i++) {
                if (excludeCenter && center - zPoz + i === center) { } else {
                    indexArr.push(center - zPoz + i);
                }
            }
        } // INDEXI Z OSI

        let pozCollided = 0;
        for (let i = 0; i < rad; i++) {
            if (x !== mapRad) {
                let slide = 0;
                let offset = 0;
                if (pozIndex < map.length) {
                    if (
                        map[pozIndex].info.coor.z === mapRad &&
                        map[pozIndex].info.coor.y !== -mapRad &&
                        zPoz + i < rad
                    ) {
                        pozIndex = guessF(pozIndex, map[pozIndex].info.coor, mapRad);
                        pozCollided++;
                    } else {
                        pozIndex = guessRF(pozIndex, map[pozIndex].info.coor, mapRad);
                    }

                    if (x >= 0) {
                        for (let j = 0; j < (yNeg + zNeg - i); j++) {
                            if (pozIndex + j < map.length) {
                                indexArr.push(pozIndex + j);
                            }
                        }
                    } else {
                        if (zPoz < rad || yPoz < rad) { offset = 1 }
                        if (pozCollided > offset) { slide = pozCollided - offset }
                        if (i - yPoz > 0 && rad + x <= 0) { slide = i - yPoz }
                        for (let j = 0; j < (zPoz + yPoz - i + offset + slide); j++) {
                            if (pozIndex + j < map.length) {
                                indexArr.push(pozIndex + j);
                            }
                        }
                    }
                }
            }
        } // INDEXI X ROBA

        let negCollided = 0;
        for (let i = 0; i < rad; i++) {
            let slide = 0;
            let offset = 0;
            if (-x !== mapRad) {
                if (negIndex > -1) {
                    if (
                        map[negIndex].info.coor.y === -mapRad &&
                        map[negIndex].info.coor.z !== mapRad &&
                        yNeg + i < rad
                    ) {
                        negIndex = guessLB(negIndex, map[negIndex].info.coor, mapRad);
                        negCollided++;
                    } else {
                        negIndex = guessB(negIndex, map[negIndex].info.coor, mapRad);
                    }

                    if (x <= 0) {
                        for (let j = 0; j < (zPoz + yPoz - i); j++) {
                            if (negIndex + j > -1) {
                                indexArr.push(negIndex + j);
                            }
                        }
                    } else {
                        if (yNeg < rad || zNeg < rad) { offset = 1 }
                        if (negCollided > offset) { slide = negCollided - offset }
                        if (i - zNeg > 0 && rad - x <= 0) { slide = i - zNeg }
                        for (let j = 0; j < (yNeg + zNeg - i + offset + slide); j++) {
                            if (negIndex + j > -1) {
                                indexArr.push(negIndex + j);
                            }
                        }
                    }
                }
            }
        } // INDEXI -X ROBA

        return indexArr;
    }

    const findOppositeIndex = (
        index: number,
        indexTo: number,
        mapData: Tile[]
    ) => {

        const fromCoor = mapData[index].info.coor;
        const { x: fromX, y: fromY, z: fromZ } = fromCoor;
        const toCoor = mapData[indexTo].info.coor;
        const { x: toX, y: toY, z: toZ } = toCoor;

        let tryToFlee: MoveEval = {
            F: {
                loc: index,
                str: 0
            },
            B: {
                loc: index,
                str: 0
            },
            RF: {
                loc: index,
                str: 0
            },
            LF: {
                loc: index,
                str: 0
            },
            RB: {
                loc: index,
                str: 0
            },
            LB: {
                loc: index,
                str: 0
            }
        };

        /*FIND DIRECTIONS TO FLEE*/
        if (fromX + 1 === toX && fromY - 1 === toY) {
            tryToFlee.B.loc = guessB(index, fromCoor, mapRad);
            tryToFlee.B.str = 4;
            tryToFlee.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToFlee.LB.str = 3;
            tryToFlee.RB.loc = guessRB(index, fromCoor);
            tryToFlee.RB.str = 3;
            tryToFlee.LF.loc = guessLF(index, fromCoor);
            tryToFlee.LF.str = 2;
            tryToFlee.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToFlee.RF.str = 2;
            tryToFlee.F.loc = guessF(index, fromCoor, mapRad);
            tryToFlee.F.str = 1;
        }

        else if (fromX + 1 === toX && fromZ - 1 === toZ) {
            tryToFlee.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToFlee.LB.str = 4;
            tryToFlee.LF.loc = guessLF(index, fromCoor);
            tryToFlee.LF.str = 3;
            tryToFlee.B.loc = guessB(index, fromCoor, mapRad);
            tryToFlee.B.str = 3;
            tryToFlee.F.loc = guessF(index, fromCoor, mapRad);
            tryToFlee.F.str = 2;
            tryToFlee.RB.loc = guessRB(index, fromCoor);
            tryToFlee.RB.str = 2;
            tryToFlee.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToFlee.RF.str = 1;
        }

        else if (fromX - 1 === toX && fromY + 1 === toY) {
            tryToFlee.F.loc = guessF(index, fromCoor, mapRad);
            tryToFlee.F.str = 4;
            tryToFlee.LF.loc = guessLF(index, fromCoor);
            tryToFlee.LF.str = 3;
            tryToFlee.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToFlee.RF.str = 3;
            tryToFlee.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToFlee.LB.str = 2;
            tryToFlee.RB.loc = guessRB(index, fromCoor);
            tryToFlee.RB.str = 2;
            tryToFlee.B.loc = guessB(index, fromCoor, mapRad);
            tryToFlee.B.str = 1;
        }

        else if (fromX - 1 === toX && fromZ + 1 === toZ) {
            tryToFlee.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToFlee.RF.str = 4;
            tryToFlee.F.loc = guessF(index, fromCoor, mapRad);
            tryToFlee.F.str = 3;
            tryToFlee.RB.loc = guessRB(index, fromCoor);
            tryToFlee.RB.str = 3;
            tryToFlee.LF.loc = guessLF(index, fromCoor);
            tryToFlee.LF.str = 2;
            tryToFlee.B.loc = guessB(index, fromCoor, mapRad);
            tryToFlee.B.str = 2;
            tryToFlee.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToFlee.LB.str = 1;
        }

        else if (fromY - 1 === toY && fromZ + 1 === toZ) {
            tryToFlee.RB.loc = guessRB(index, fromCoor);
            tryToFlee.RB.str = 4;
            tryToFlee.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToFlee.RF.str = 3;
            tryToFlee.B.loc = guessB(index, fromCoor, mapRad);
            tryToFlee.B.str = 3;
            tryToFlee.F.loc = guessF(index, fromCoor, mapRad);
            tryToFlee.F.str = 2;
            tryToFlee.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToFlee.LB.str = 2;
            tryToFlee.LF.loc = guessLF(index, fromCoor);
            tryToFlee.LF.str = 1;
        }

        else if (fromY + 1 === toY && fromZ - 1 === toZ) {
            tryToFlee.LF.loc = guessLF(index, fromCoor);
            tryToFlee.LF.str = 4;
            tryToFlee.F.loc = guessF(index, fromCoor, mapRad);
            tryToFlee.F.str = 3;
            tryToFlee.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToFlee.LB.str = 3;
            tryToFlee.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToFlee.RF.str = 2;
            tryToFlee.B.loc = guessB(index, fromCoor, mapRad);
            tryToFlee.B.str = 2;
            tryToFlee.RB.loc = guessRB(index, fromCoor);
            tryToFlee.RB.str = 1;
        }

        else if (indexTo === index) {
            tryToFlee.LF.loc = guessLF(index, fromCoor);
            tryToFlee.LF.str = 4;
            tryToFlee.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToFlee.LB.str = 4;
            tryToFlee.F.loc = guessF(index, fromCoor, mapRad);
            tryToFlee.F.str = 4;
            tryToFlee.B.loc = guessB(index, fromCoor, mapRad);
            tryToFlee.B.str = 4;
            tryToFlee.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToFlee.RF.str = 4;
            tryToFlee.RB.loc = guessRB(index, fromCoor);
            tryToFlee.RB.str = 4;
        }

        /*FIX IF BLOCKED*/
        if (tryToFlee.F.loc === index) {
            tryToFlee.F.str = 0;
        }
        if (tryToFlee.B.loc === index) {
            tryToFlee.B.str = 0;
        }
        if (tryToFlee.LF.loc === index) {
            tryToFlee.LF.str = 0;
        }
        if (tryToFlee.RF.loc === index) {
            tryToFlee.RF.str = 0;
        }
        if (tryToFlee.LB.loc === index) {
            tryToFlee.LB.str = 0;
        }
        if (tryToFlee.RB.loc === index) {
            tryToFlee.RB.str = 0;
        }

        return tryToFlee;
    }

    const findTowardsIndex = (
        index: number,
        indexTo: number,
        mapData: Tile[]
    ) => {

        const fromCoor = mapData[index].info.coor;
        const { x: fromX, y: fromY, z: fromZ } = fromCoor;
        const toCoor = mapData[indexTo].info.coor;
        const { x: toX, y: toY, z: toZ } = toCoor;

        let tryToHunt: MoveEval = {
            F: {
                loc: index,
                str: 0
            },
            B: {
                loc: index,
                str: 0
            },
            RF: {
                loc: index,
                str: 0
            },
            LF: {
                loc: index,
                str: 0
            },
            RB: {
                loc: index,
                str: 0
            },
            LB: {
                loc: index,
                str: 0
            }
        };

        /*FIND OPTIMAL DIRECTIONS TO MOVE*/
        if (fromX - 1 === toX && fromY + 1 === toY) {
            tryToHunt.B.loc = guessB(index, fromCoor, mapRad);
            tryToHunt.B.str = 4;
            tryToHunt.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToHunt.LB.str = 3;
            tryToHunt.RB.loc = guessRB(index, fromCoor);
            tryToHunt.RB.str = 3;
            tryToHunt.LF.loc = guessLF(index, fromCoor);
            tryToHunt.LF.str = 2;
            tryToHunt.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToHunt.RF.str = 2;
            tryToHunt.F.loc = guessF(index, fromCoor, mapRad);
            tryToHunt.F.str = 1;
        }

        else if (fromX - 1 === toX && fromZ + 1 === toZ) {
            tryToHunt.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToHunt.LB.str = 4;
            tryToHunt.LF.loc = guessLF(index, fromCoor);
            tryToHunt.LF.str = 3;
            tryToHunt.B.loc = guessB(index, fromCoor, mapRad);
            tryToHunt.B.str = 3;
            tryToHunt.F.loc = guessF(index, fromCoor, mapRad);
            tryToHunt.F.str = 2;
            tryToHunt.RB.loc = guessRB(index, fromCoor);
            tryToHunt.RB.str = 2;
            tryToHunt.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToHunt.RF.str = 1;
        }

        else if (fromX + 1 === toX && fromY - 1 === toY) {
            tryToHunt.F.loc = guessF(index, fromCoor, mapRad);
            tryToHunt.F.str = 4;
            tryToHunt.LF.loc = guessLF(index, fromCoor);
            tryToHunt.LF.str = 3;
            tryToHunt.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToHunt.RF.str = 3;
            tryToHunt.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToHunt.LB.str = 2;
            tryToHunt.RB.loc = guessRB(index, fromCoor);
            tryToHunt.RB.str = 2;
            tryToHunt.B.loc = guessB(index, fromCoor, mapRad);
            tryToHunt.B.str = 1;
        }

        else if (fromX + 1 === toX && fromZ - 1 === toZ) {
            tryToHunt.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToHunt.RF.str = 4;
            tryToHunt.F.loc = guessF(index, fromCoor, mapRad);
            tryToHunt.F.str = 3;
            tryToHunt.RB.loc = guessRB(index, fromCoor);
            tryToHunt.RB.str = 3;
            tryToHunt.LF.loc = guessLF(index, fromCoor);
            tryToHunt.LF.str = 2;
            tryToHunt.B.loc = guessB(index, fromCoor, mapRad);
            tryToHunt.B.str = 2;
            tryToHunt.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToHunt.LB.str = 1;
        }

        else if (fromY + 1 === toY && fromZ - 1 === toZ) {
            tryToHunt.RB.loc = guessRB(index, fromCoor);
            tryToHunt.RB.str = 4;
            tryToHunt.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToHunt.RF.str = 3;
            tryToHunt.B.loc = guessB(index, fromCoor, mapRad);
            tryToHunt.B.str = 3;
            tryToHunt.F.loc = guessF(index, fromCoor, mapRad);
            tryToHunt.F.str = 2;
            tryToHunt.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToHunt.LB.str = 2;
            tryToHunt.LF.loc = guessLF(index, fromCoor);
            tryToHunt.LF.str = 1;
        }

        else if (fromY - 1 === toY && fromZ + 1 === toZ) {
            tryToHunt.LF.loc = guessLF(index, fromCoor);
            tryToHunt.LF.str = 4;
            tryToHunt.F.loc = guessF(index, fromCoor, mapRad);
            tryToHunt.F.str = 3;
            tryToHunt.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToHunt.LB.str = 3;
            tryToHunt.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToHunt.RF.str = 2;
            tryToHunt.B.loc = guessB(index, fromCoor, mapRad);
            tryToHunt.B.str = 2;
            tryToHunt.RB.loc = guessRB(index, fromCoor);
            tryToHunt.RB.str = 1;
        }

        else if (indexTo === index) {
            tryToHunt.LF.loc = guessLF(index, fromCoor);
            tryToHunt.LF.str = 4;
            tryToHunt.LB.loc = guessLB(index, fromCoor, mapRad);
            tryToHunt.LB.str = 4;
            tryToHunt.F.loc = guessF(index, fromCoor, mapRad);
            tryToHunt.F.str = 4;
            tryToHunt.B.loc = guessB(index, fromCoor, mapRad);
            tryToHunt.B.str = 4;
            tryToHunt.RF.loc = guessRF(index, fromCoor, mapRad);
            tryToHunt.RF.str = 4;
            tryToHunt.RB.loc = guessRB(index, fromCoor);
            tryToHunt.RB.str = 4;
        }

        /*FIX IF BLOCKED*/
        if (tryToHunt.F.loc === index) {
            tryToHunt.F.str = 0;
        }
        if (tryToHunt.B.loc === index) {
            tryToHunt.B.str = 0;
        }
        if (tryToHunt.LF.loc === index) {
            tryToHunt.LF.str = 0;
        }
        if (tryToHunt.RF.loc === index) {
            tryToHunt.RF.str = 0;
        }
        if (tryToHunt.LB.loc === index) {
            tryToHunt.LB.str = 0;
        }
        if (tryToHunt.RB.loc === index) {
            tryToHunt.RB.str = 0;
        }

        return tryToHunt;
    }

    return {
        guessLF, guessF, guessRF,
        guessLB, guessB, guessRB,
        roundReach,
        findTowardsIndex,
        findOppositeIndex
    }
}
import { Tile } from "../type";
import useAppStore from "../useAppStore";

export default function useCompass() {

    const { mapNums } = useAppStore();

    const guessLF = (index: number) => {
        return index - 1;
    }

    const guessF = (x: number, index: number, mapRad: number) => {
        let midDis = Math.abs(x);
        if (x < 0) { midDis-- }
        return index + (mapRad * 2) - midDis;
    }

    const guessRF = (x: number, index: number, mapRad: number) => {
        let midDis = Math.abs(x);
        if (x < 0) { midDis-- }
        return index + ((mapRad * 2) + 1) - midDis;
    }

    const guessLB = (x: number, index: number, mapRad: number) => {
        let midDis = Math.abs(x);
        if (x > 0) { midDis-- }
        return index - (((mapRad * 2) + 1)) + midDis;
    }

    const guessB = (x: number, index: number, mapRad: number) => {
        let midDis = Math.abs(x);
        if (x > 0) { midDis-- }
        return index - (mapRad * 2) + midDis;
    }

    const guessRB = (index: number) => {
        return index + 1;
    }

    const roundReach = (
        map: Tile[],
        center: number,
        rad: number,
        excludeCenter?: boolean
    ) => {

        const { x, y, z } = map[center].info.coor;
        const mapRad = mapNums.mapRadius;

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
                        pozIndex = guessF(map[pozIndex].info.coor.x, pozIndex, mapRad);
                        pozCollided++;
                    } else {
                        pozIndex = guessRF(map[pozIndex].info.coor.x, pozIndex, mapRad);
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
                        negIndex = guessLB(map[negIndex].info.coor.x, negIndex, mapRad);
                        negCollided++;
                    } else {
                        negIndex = guessB(map[negIndex].info.coor.x, negIndex, mapRad);
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

    return {
        guessLF, guessF, guessRF,
        guessLB, guessB, guessRB,
        roundReach
    }
}
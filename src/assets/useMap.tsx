import { Tile, TileType, TileData, Creature, Coor } from "../type";
import toast from "react-hot-toast";
import useAppStore from "../useAppStore";
import useBasicFunction from "./useBasicFunction";
import useCreature from "./useCreature";
import useCompass from "./useCompass";

export default function useMap() {

    const {
        mapNums,
        showCoor,
        showBorder,
        setMapNums,
    } = useAppStore();
    const { getRandomNum } = useBasicFunction();
    const { roundReach } = useCompass();
    const { createCreatureData } = useCreature();
    const {
        mapRadius: mapRad,
        tileSize: tileSize,
        tileSpacing: tileSpacing
    } = mapNums;

    const tileTypes: { [key: string]: TileData } = {
        sea: {
            type: "sea",
            values: {
                color: "blue",
                temperature: { scale: 0, description: "average" },
                resources: [{ type: "", amount: 0 }]
            }
        },
        atVulcano: {
            type: "atVulcano",
            values: {
                color: "orange",
                temperature: { scale: 2, description: "hot" },
                resources: [{ type: "", amount: 0 }]
            }
        },
        vulcano: {
            type: "vulcano",
            values: {
                color: "red",
                temperature: { scale: 3, description: "melting" },
                resources: [{ type: "", amount: 0 }]
            }
        }
    }

    const setMapSize = (data: any) => {
        if (data) {
            const [el1, el2, el3]: [HTMLInputElement, HTMLInputElement, HTMLInputElement] = [data[1], data[2], data[3]];
            const [num1, num2, num3] = [Number(el1.value), Number(el2.value), Number(el3.value)];
            const newmapRadius = num1 ? num1 : mapRad;
            const newTileSize = num2 ? num2 : tileSize;
            const newTileSpacing = num3 ? num3 : tileSpacing;
            const screenTake = (
                (newmapRadius * 2) *
                (newTileSize * 2) *
                (newTileSpacing * 1.1)
            );
            if (screenTake <= window.innerWidth && screenTake <= window.innerHeight) {
                setMapNums({
                    mapRadius: newmapRadius,
                    tileSize: newTileSize,
                    tileSpacing: newTileSpacing
                });
                toast.success("Size of next map was changed.")
            } else {
                toast.error("This map would be too large for your screen.")
            }
        }
    }

    /*FUNCTIONS FOR CREATING BASE DATA STRUCTURES*/

    const getTileType = () => {
        let tileData: TileData = tileTypes.sea;

        const chanNum = 10;
        const num = getRandomNum(chanNum);
        if (num === (chanNum - 1)) {
            const querry = tileTypes.vulcano;
            if (querry) { tileData = querry }
        }

        return tileData;
    }

    const createMapData = (radius: number) => {
        /*MAP LIMITS*/
        const mapSize = 1 + 3 * mapRad * (mapRad + 1);
        const limitMax = Math.floor(mapSize / 6);
        const limitMin = Math.floor(mapSize / 3);
        let mainTerrainPicked = 0;
        let mainTerrainPickedNot = 0;

        let index = 0;
        const hexes: Tile[] = [];
        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                let z = -x - y;
                if (z >= -radius && z <= radius) {

                    /*REGULATE TERRAIN FREQUENCY*/
                    let terrType = getTileType();
                    terrType.type === "vulcano" ?
                        mainTerrainPicked++ :
                        mainTerrainPickedNot++
                    if (mainTerrainPicked === limitMax / 3) {
                        terrType = tileTypes["sea"];
                        mainTerrainPicked = 0;
                    }
                    else if (mainTerrainPickedNot === limitMin) {
                        terrType = tileTypes["vulcano"];
                        mainTerrainPickedNot = 0;
                    }

                    /*CREATE TILE*/
                    const tile: Tile = {
                        info: {
                            index: index,
                            coor: { x: x, y: y, z: z },
                        },
                        context: {
                            indexes: [],
                            coors: [],
                            border: false,
                            tileTypes: [],
                        },
                        creature: null,
                        seen: 0,
                        terrain: terrType,
                    };

                    /*BE AWARE OF NEIGHBORS*/
                    const coor = tile.info.coor;
                    const conCoor = tile.context.coors;
                    if (coor.x + 1 <= mapRad &&
                        coor.y - 1 >= -mapRad) {
                        conCoor.push({
                            x: coor.x + 1,
                            y: coor.y - 1,
                            z: coor.z
                        });
                    }
                    if (coor.x + 1 <= mapRad &&
                        coor.z - 1 >= -mapRad) {
                        conCoor.push({
                            x: coor.x + 1,
                            y: coor.y,
                            z: coor.z - 1
                        });
                    }
                    if (coor.x - 1 >= -mapRad &&
                        coor.y + 1 <= mapRad) {
                        conCoor.push({
                            x: coor.x - 1,
                            y: coor.y + 1,
                            z: coor.z
                        });
                    }
                    if (coor.x - 1 >= -mapRad &&
                        coor.z + 1 <= mapRad) {
                        conCoor.push({
                            x: coor.x - 1,
                            y: coor.y,
                            z: coor.z + 1
                        });
                    }
                    if (coor.y - 1 >= -mapRad &&
                        coor.z + 1 <= mapRad) {
                        conCoor.push({
                            x: coor.x,
                            y: coor.y - 1,
                            z: coor.z + 1
                        });
                    }
                    if (coor.y + 1 <= mapRad &&
                        coor.z - 1 >= -mapRad) {
                        conCoor.push({
                            x: coor.x,
                            y: coor.y + 1,
                            z: coor.z - 1
                        });
                    }

                    /*BE AWARE OF BORDER*/
                    if (
                        Math.abs(x) === radius ||
                        Math.abs(y) === radius ||
                        Math.abs(z) === radius
                    ) { tile.context.border = true }

                    hexes.push(tile);
                    index++;
                }
            }
        }

        const final = informData(hexes);
        return final;
    }

    /*FUNCTIONS FOR CONTEXUAL DATA*/

    const informData = (hexes: Tile[]) => {
        /*Kjer se pojavi igralec ni nevarno*/
        const pcIndex = Math.floor(hexes.length / 2);
        hexes[pcIndex].terrain = tileTypes.sea;

        /*Ozavesti kaj se nahaja v okolici*/
        for (let i = 0; i < hexes.length; i++) {

            const indexArr: number[] = [];
            const coorArr: Coor[] = [];
            const tileTypeArr: TileType[] = [];
            const indexMapArr = roundReach(hexes, i, 1);
            indexMapArr.forEach(el => {
                indexArr.push(hexes[el].info.index);
                coorArr.push(hexes[el].info.coor);
                tileTypeArr.push(hexes[el].terrain.type);
            })
            hexes[i].context.indexes = indexArr;
            hexes[i].context.coors = coorArr;
            hexes[i].context.tileTypes = tileTypeArr;

            /*Pri vulkanu*/
            if (
                hexes[i].terrain.type !== "vulcano" &&
                hexes[i].context.tileTypes.includes("vulcano")
            ) {
                hexes[i].terrain = tileTypes.atVulcano;
            }

            /*Dodaj bitja*/
            if (hexes[i].terrain.type === "atVulcano") {
                const creature = createCreatureData("vektor gamus", 3, 3);
                if (creature) {
                    hexes[i].creature = creature;
                }
            }
        }

        return hexes;
    }

    /*FUNCTIONS FOR HTML CONVERSION*/

    const createCreatureEl = (creature: Creature) => {

        /*CREATURE CHECKS*/
        const isDead = creature.general.combat.hp === 0;
        const isTired = creature.general.energy.stamina === 0;
        const growthRate = (
            (tileSize * 2) /
            (creature.general.body.sizeMax / creature.general.body.size)
        );
        const borderRadius = `${growthRate}px ${growthRate}px ${growthRate}px ${growthRate}px`;

        return (
            <div
                class={`creature ${isDead ? "dead" : ""} ${isTired ? "tired" : ""}`}
                style={{
                    height: growthRate,
                    width: growthRate,
                    borderRadius: borderRadius,
                    backgroundColor: creature.general.body.color,
                    transform: `rotate(${creature.orientation}deg)`
                }}>
            </div>
        )
    }

    const createTileEl = (tile: Tile, tileIndex: number) => {
        tileIndex /*obstaja da se naredi TS happy in neha blokirati produkcijo*/

        /*COORDINATES AND MAP DESIGN*/
        const coor = tile.info.coor;
        const offset = tileSize * tileSpacing;
        const x = ((offset * 1.73) * coor.x) + ((offset * 1.73) * coor.y);
        const y = ((offset * 2) * coor.y) + (offset * coor.z);
        const seen = tile.seen;

        /*TERRAIN CHECKS*/
        const tileColour = tile.terrain.values.color;

        /*CREATRE CREATURE*/
        let creatureEl = <></>;
        if (tile.creature) {
            creatureEl = createCreatureEl(tile.creature)
        }

        return (
            <div
                class={"hex flex alignFlex"}
                style={{
                    height: `${tileSize * 1.73}px`,
                    width: `${tileSize}px`,
                    backgroundColor: tileColour,
                    transform: `translate(${x}px, ${y}px)`,
                    zIndex: tile.creature ? 3 : 5,
                    filter: `brightness(${seen}%)`
                }}>
                {showCoor &&
                    <p class={"info"}>
                        {coor.x},{coor.y},{coor.z}<br />
                        {tileIndex}
                    </p>}
                {showBorder &&
                    <p class={"info"}>
                        {tile.context.border ? "yup" : "no"}
                    </p>}
                {creatureEl}
            </div>
        )
    }

    const createElsTileArr = (tileDataArr: Tile[]) => {
        const tileArr = tileDataArr.map(
            (tile, index) => {
                const tileDiv = createTileEl(tile, index);
                return tileDiv;
            }
        )
        return tileArr;
    }

    const createMap = (tileDataArr: Tile[]) => {
        const tileArr = createElsTileArr(tileDataArr);
        const hexMapBorder = 20;
        return (
            <div
                id="hexGrid"
                style={{
                    minHeight: `${(
                        ((mapRad * 2) + 1) *
                        (tileSize * 1.73) +
                        ((tileSpacing * mapRad) +
                            (mapRad * 15) * (tileSize * 0.03))
                    ) + (hexMapBorder * 2)}px`,
                    top: `${(
                        (mapRad * 1) *
                        (tileSize * 1.8) *
                        (tileSpacing * 1.1)
                    ) + (hexMapBorder * 0.9)}px`
                }}>
                {tileArr}
            </div>
        )
    }

    return {
        setMapSize,
        createMapData,
        createMap,
    }
}
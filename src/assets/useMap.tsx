import toast from "react-hot-toast";
import { Tile, TileType, TileData, Creature } from "../type";
import useAppStore from "../useAppStore";

export default function useMap() {

    const {
        mapNums,
        setMapNums,
    } = useAppStore();

    const {
        mapSize: mapSize,
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
            const newMapSize = num1 ? num1 : mapSize;
            const newTileSize = num2 ? num2 : tileSize;
            const newTileSpacing = num3 ? num3 : tileSpacing;
            const screenTake = (
                (newMapSize * 2) *
                (newTileSize * 2) *
                (newTileSpacing * 1.1)
            );
            if (screenTake <= window.innerWidth && screenTake <= window.innerHeight) {
                setMapNums({
                    mapSize: newMapSize,
                    tileSize: newTileSize,
                    tileSpacing: newTileSpacing
                });
                toast.success("Size of next map was changed.")
            } else {
                toast.error("This map would be too large for your screen.")
            }
        }
    }

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    }

    /*FUNCTIONS FOR CREATING BASE DATA STRUCTURES*/

    const getTileType = () => {
        let tileData: TileData = tileTypes.sea;

        const chanNum = 15;
        const num = getRandomInt(chanNum);
        if (num === (chanNum - 1)) {
            const querry = tileTypes.vulcano;
            if (querry) { tileData = querry }
        }

        return tileData;
    }

    const createMapData = (radius: number) => {

        const hexes: Tile[] = [];
        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                let z = -x - y;
                if (z >= -radius && z <= radius) {

                    const tile: Tile = {
                        coor: { x: x, y: y, z: z },
                        creature: null,
                        terrain: getTileType(),
                        context: {
                            tiles: [],
                            border: false
                        }
                    };

                    if (
                        Math.abs(x) === radius ||
                        Math.abs(y) === radius ||
                        Math.abs(z) === radius
                    ) { tile.context.border = true }

                    hexes.push(tile);
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

            let tileContext: TileType[] = [];
            tileContext = informOneSpace(hexes[i].coor, hexes);
            hexes[i].context.tiles = tileContext;

            if (
                hexes[i].terrain.type !== "vulcano" &&
                hexes[i].context.tiles.includes("vulcano")
            ) {
                hexes[i].terrain = tileTypes.atVulcano;
            }
        }
        return hexes;
    }

    const informOneSpace = (
        { x, y, z }: { x: number, y: number, z: number },
        hexes: Tile[]
    ) => {
        const positions = [
            { x: x + 1, y: y - 1, z: z },
            { x: x - 1, y: y + 1, z: z },
            { x: x, y: y + 1, z: z - 1 },
            { x: x, y: y - 1, z: z + 1 },
            { x: x + 1, y: y, z: z - 1 },
            { x: x - 1, y: y, z: z + 1 },
        ]
        let tileContext: TileType[] = [];
        for (let i = 0; i < positions.length; i++) {
            const neighbour = hexes.find((e) =>
                e.coor.x === positions[i].x &&
                e.coor.y === positions[i].y &&
                e.coor.z === positions[i].z
            )
            const type = neighbour?.terrain.type;
            type ? tileContext.push(type) : "";
        }
        return tileContext;
    }

    /*FUNCTIONS FOR HTML CONVERSION*/

    const createCreatureEl = (creature: Creature) => {

        /*CREATURE CHECKS*/
        const isDead = creature.general.health.hp === 0;
        const isTired = creature.general.health.energy === 0;
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
        const coor = tile.coor;
        const offset = tileSize * tileSpacing;
        const x = ((offset * 1.73) * coor.x) + ((offset * 1.73) * coor.y);
        const y = ((offset * 2) * coor.y) + (offset * coor.z);

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
                    zIndex: tile.creature ? 3 : 5
                }}>
                {/* <p class={"info"}>{coor.x},{coor.y},{coor.z}<br />{tileIndex}</p> */}
                {/* <p class={"info"}>{tile.context.border ? "yup" : "no"}</p> */}
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
                        ((mapSize * 2) + 1) *
                        (tileSize * 1.73) +
                        ((tileSpacing * mapSize) +
                            (mapSize * 15) * (tileSize * 0.03))
                    ) + (hexMapBorder * 2)}px`,
                    top: `${(
                        (mapSize * 1) *
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
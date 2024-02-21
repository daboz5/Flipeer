import toast from "react-hot-toast";
import { Tile, TileType, TileData } from "../type";
import useAppStore from "../useAppStore";

export default function useMap() {

    const {
        player,
        mapNums,
        setMapNums,
    } = useAppStore();

    const {
        mapSize: mapSize,
        tileSize: tileSize,
        tileSpacing: tileSpacing
    } = mapNums;

    const tileTypes: TileData[] = [{
        type: "sea",
        values: {
            temperature: { scale: 0, description: "average" },
            resources: [{ type: "", amount: 0 }]
        }
    }, {
        type: "atVulcano",
        values: {
            temperature: { scale: 2, description: "hot" },
            resources: [{ type: "", amount: 0 }]
        }
    }, {
        type: "vulcano",
        values: {
            temperature: { scale: 3, description: "melting" },
            resources: [{ type: "", amount: 0 }]
        }
    }]

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
        let tileData: TileData = tileTypes[0];

        const chanNum = 15;
        const num = getRandomInt(chanNum);
        if (num === (chanNum - 1)) {
            const querry = tileTypes.find((type) => type.type === "vulcano");
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
        const startTile = tileTypes.find(terrain => terrain.type === "sea")
        hexes[pcIndex].terrain = startTile ? startTile : tileTypes[0];

        /*Ozavesti kaj se nahaja v okolici*/
        for (let i = 0; i < hexes.length; i++) {
            const coor = hexes[i].coor;
            let tileContext: TileType[] = [];
            tileContext = informOneSpace(coor, hexes);
            hexes[i].context.tiles = tileContext;
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
        let tileTypes: TileType[] = [];
        for (let i = 0; i < positions.length; i++) {
            const neighbour = hexes.find((e) =>
                e.coor.x === positions[i].x &&
                e.coor.y === positions[i].y &&
                e.coor.z === positions[i].z
            )
            const type = neighbour?.terrain.type;
            type ? tileTypes.push(type) : "";
        }
        return tileTypes;
    }

    /*FUNCTIONS FOR HTML CONVERSION*/

    const createElsTileArr = (tileDataArr: Tile[]) => {
        const tileArr = tileDataArr.map(
            (tile) => {

                const coor = tile.coor;
                const offset = tileSize * tileSpacing;
                const x = ((offset * 1.73) * coor.x) + ((offset * 1.73) * coor.y);
                const y = ((offset * 2) * coor.y) + (offset * coor.z);

                let background = "";
                if (tile.terrain.type === "vulcano") {
                    background = "red";
                } else if (tile.context.tiles.includes("vulcano")) {
                    background = "orange";
                } else {
                    background = "blue";
                }

                const playerPresent = tile.creature?.id === "player";
                const growthRate = (
                    (tileSize * 2) /
                    (player.body.bodySizeMax / player.body.bodySize)
                );
                const borderRadius = `${growthRate}px ${growthRate}px ${growthRate}px ${growthRate}px`

                return (
                    <div
                        class={"hex flex alignFlex"}
                        style={{
                            transform: `translate(${x}px, ${y}px)`,
                            height: `${tileSize * 1.73}px`,
                            width: `${tileSize}px`,
                            backgroundColor: background,
                            zIndex: !playerPresent ? 5 : 3
                        }}>
                        {
                            playerPresent ?
                                <div
                                    id="player"
                                    style={{
                                        height: growthRate,
                                        width: growthRate,
                                        borderRadius: borderRadius,
                                        backgroundColor: player.body.color,
                                        transform: `rotate(${player.orientation}deg)`
                                    }}></div> :
                                <></>
                        }
                        {/* <p class={"info"}>{coor.x},{coor.y},{coor.z}<br />{index}</p> */}
                        {/* <p class={"info"}>{tile.context.border ? "yup" : "no"}</p> */}
                    </div>
                )
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
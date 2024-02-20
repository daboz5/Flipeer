import toast from "react-hot-toast";
import { MapData, Tile, TileType, TileData } from "../type";
import useAppStore from "../useAppStore";

export default function useMap() {

    const {
        player,
        mapNums,
        setMapNums,
    } = useAppStore();

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
            const els: [HTMLInputElement, HTMLInputElement, HTMLInputElement] = [data[1], data[2], data[3]];
            const nums: [number, number, number] = [Number(els[0].value), Number(els[1].value), Number(els[2].value)];
            const screenSize = [window.innerWidth, window.innerHeight];
            const screenTake = (
                ((nums[0] ? nums[0] : mapNums[0]) * 2) *
                ((nums[1] ? nums[1] : mapNums[1]) * 2) *
                ((nums[2] ? nums[2] : mapNums[2]) * 1.1)
            );
            if (screenTake <= screenSize[0] && screenTake <= screenSize[1]) {
                setMapNums([
                    nums[0] ? nums[0] : mapNums[0],
                    nums[1] ? nums[1] : mapNums[1],
                    nums[2] ? nums[2] : mapNums[2]
                ]);
                toast.success("Size of next map was changed.")
            } else {
                toast.error("This map would be too large for your screen.")
            }
        }
    }

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    }

    const getTileType = () => {
        let tileData: TileData = tileTypes[0];

        const chanNum = 15;
        const num = getRandomInt(chanNum);
        if (num === (chanNum - 1)) {
            const querry = tileTypes.find((type) => type.type === "vulcano");
            querry ? tileData = querry : "";
        }

        return tileData;
    }

    const getTile = (x: number, y: number, z: number) => {
        let tile: Tile = {
            coor: { x: x, y: y, z: z },
            creature: null,
            terrain: getTileType(),
            context: {
                tiles: [],
                border: false
            }
        }
        return tile;
    }

    const createMapData = (size: number) => {
        const hexes: Tile[] = [];
        for (let x = -size; x <= size; x++) {
            for (let y = -size; y <= size; y++) {
                for (let z = -size; z <= size; z++) {
                    if (x + y + z === 0) {
                        const tile = getTile(x, y, z);
                        if (
                            x === (size) || x === (-size) ||
                            y === (size) || y === (-size) ||
                            z === (size) || z === (-size)
                        ) { tile.context.border = true } // ozavesti rob plošče
                        hexes.push(tile);
                    }
                }
            }
        }
        const final = informData(hexes);
        return final;
    }

    const informData = (hex: Tile[]) => {
        /*Kjer se pojavi igralec ni nevarno*/
        const pcIndex = Math.floor(hex.length / 2);
        hex[pcIndex].terrain = {
            type: "sea",
            values: {
                temperature: { scale: 0, description: "average" },
                resources: [{ type: "", amount: 0 }]
            }
        };

        /*Ozavesti kaj se nahaja v okolici*/
        for (let i = 0; i < hex.length; i++) {
            const coor = hex[i].coor;
            let tileContext: TileType[] = [];
            tileContext = informOneHexSpace(coor, hex);
            hex[i].context.tiles = tileContext;
        }
        return hex;
    }

    const informOneHexSpace = (
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

    const createMap = (data: MapData) => {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            const coor = data[i].coor;
            const xH = coor.x;
            const yH = coor.y;
            const zH = coor.z;

            if (zH !== undefined) {
                const size = mapNums[1];
                const offset = size * mapNums[2];
                const x = ((offset * 1.73) * xH) + ((offset * 1.73) * yH);
                const y = ((offset * 2) * yH) + (offset * zH);
                let background = data[i].terrain.type === "vulcano" ?
                    "red" :
                    data[i].context.tiles.includes("vulcano") ?
                        "orange" :
                        "blue";
                data[i].creature?.id === "player" ?
                    background = player.body.color :
                    "";

                const div = <>
                    <div
                        class="hex"
                        style={{
                            transform: `translate(${x}px, ${y}px)`,
                            height: `${size * 1.73}px`,
                            width: `${size}px`,
                            backgroundColor: background
                        }}>
                        <p class={"cor"}>
                            {/* {coor.x},
                            {coor.y},
                            {coor.z} <br />
                            {i} */}
                            {/* {data[i].context.border ? "yup" : "no"} */}
                        </p>
                    </div>
                </>

                arr.push(div);
            }
        }

        const hexMapBorder = 20;
        return (<div
            id="hexGrid"
            style={{
                minHeight: `${(
                    ((mapNums[0] * 2) + 1) *
                    (mapNums[1] * 1.73) +
                    ((mapNums[2] * mapNums[0]) +
                        (mapNums[0] * 15) * (mapNums[1] * 0.03))
                ) + (hexMapBorder * 2)}px`,
                top: `${(
                    (mapNums[0] * 1) *
                    (mapNums[1] * 1.8) *
                    (mapNums[2] * 1.1)
                ) + (hexMapBorder * 0.9)}px`
            }}>
            {arr}
        </div>)
    }

    return {
        setMapSize,
        createMapData,
        createMap,
    }
}
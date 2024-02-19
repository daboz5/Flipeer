import toast from "react-hot-toast";
import { SquareMapData, HexMapData, TileData, TileType } from "../type";
import useAppStore from "../useAppStore";
import useCreature from "./useCreature";

export default function useMap() {

    const { player, hexSize, setSquareSize, setHexSize } = useAppStore();
    const { createCreature } = useCreature();

    const setSquareMapSize = (data: any) => {
        if (data) {
            const els: [HTMLInputElement, HTMLInputElement] = [data[1], data[2]];
            const size: [number, number] = [Number(els[0].value), Number(els[1].value)];
            const screenSize = [window.innerWidth, window.innerHeight];
            const screenMax = [size[0] * 40, size[1] * 40];
            if (screenMax[0] <= screenSize[0] && screenMax[1] <= screenSize[1]) {
                setSquareSize(size);
                toast.success("Size of next map was changed.")
            } else {
                toast.error("This map would be too large for your screen.")
            }
        }
    }

    const setHexMapSize = (data: any) => {
        if (data) {
            const els: HTMLInputElement = data[1];
            const size: number = Number(els.value);
            const screenSize = [window.innerWidth, window.innerHeight];
            const screenMax = size * 80;
            if (screenMax <= screenSize[0] && screenMax <= screenSize[1]) {
                setHexSize(size);
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
        const chanNum = 15;
        const num = getRandomInt(chanNum);
        if (num === (chanNum - 1)) {
            return "vulcano";
        } else {
            return "sea";
        }
    }

    const getTile = (x: number, y: number, z?: number) => {
        let tile: TileData = {
            coor: { x: x, y: y, z: typeof z === "number" ? z : undefined },
            creature: null,
            type: getTileType(),
            context: {
                tiles: [],
                border: false
            }
        }
        return tile;
    }

    /*SQUARE MAP FUNCTIONS*/

    const createTileData = (
        [xNum, yNum]: [xNum: number, yNum: number]
    ) => {
        const tile = []; // zbere Y
        for (let i = 0; i < yNum; i++) {

            const cols = []; // zbere X
            for (let j = 0; j < xNum; j++) {
                let border = false;
                if (j === 0 || j === (xNum - 1) || i === 0 || i === (yNum - 1)) {
                    border = true; // ozavesti rob plošče
                }
                let tile = getTile(j, i);
                tile.context.border = border;
                cols.push(tile); // zapakira X v zbiralnik
            }

            tile.push(cols); // zapakira Y v zbiralnik
        }
        return tile;
    };

    const informTileData = (tile: TileData[][]) => {
        for (let i = 0; i < tile.length; i++) {
            for (let j = 0; j < tile[i].length; j++) {
                const coor = tile[i][j].coor;
                let tileContext: TileType[] = [];
                tileContext = informOneSpace(coor, tile);
                tile[i][j].context.tiles = tileContext;
            }
        }
        return tile;
    }

    const informOneSpace = (
        { x, y }: { x: number, y: number },
        tile: TileData[][]
    ) => {
        const positions = [
            { x: x - 1, y: y - 1 },
            { x: x - 1, y: y },
            { x: x - 1, y: y + 1 },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
            { x: x + 1, y: y - 1 },
            { x: x + 1, y: y },
            { x: x + 1, y: y + 1 },
        ]
        const xSize = tile[0].length;
        const ySize = tile.length;
        let tileContents: TileType[] = [];
        for (let i = 0; i < positions.length; i++) {
            if (positions[i].x >= 0 &&
                positions[i].y >= 0 &&
                positions[i].x < xSize &&
                positions[i].y < ySize
            ) {
                const type = tile[positions[i].y][positions[i].x].type;
                tileContents.includes(type) ? "" : tileContents.push(type);
            }
        }
        return tileContents;
    }

    const createTile = (data: SquareMapData) => {
        const iData = informTileData(data);
        const tile = iData.map((y) => {
            const yArr = y.map((x) => {
                const creature = x.creature;
                let colour = "";
                if (x.type === "vulcano") {
                    colour = "red";
                } else if (x.context.tiles.includes("vulcano")) {
                    colour = "orange";
                } else {
                    colour = "blue"
                }
                return (
                    <div
                        class="colTile"
                        style={{
                            backgroundColor: colour
                        }}>
                        {/* {x.coor.x},{x.coor.y} */}
                        {/* {x.context.border ? "true" : "no"} */}
                        {/* {x.context.tiles.includes("vulcano") ? "x" : "no"} */}
                        {creature?.id === "player" ?
                            createCreature(player) :
                            creature !== null ?
                                createCreature(creature) :
                                <></>}
                    </div>
                )
            })
            return (
                <div class={"rowTile"}>
                    {yArr}
                </div>
            )
        }).reverse();

        return (
            <div class="tile">
                {tile}
            </div>
        )
    };

    /*HEX MAP FUNCTIONS*/

    const createHexData = (size: number) => {
        const hexes: TileData[] = [];
        for (let x = -size; x <= size; x++) {
            for (let y = -size; y <= size; y++) {
                for (let z = -size; z <= size; z++) {
                    if (x + y + z === 0) {
                        let border = false;
                        if (
                            x === (size) ||
                            x === (-size) ||
                            y === (size) ||
                            y === (-size) ||
                            z === (size) ||
                            z === (-size)
                        ) {
                            border = true; // ozavesti rob plošče
                        }
                        const tile = getTile(x, y, z);
                        tile.context.border = border;
                        hexes.push(tile);
                    }
                }
            }
        }
        return hexes;
    }

    const createHexMap = (data: HexMapData) => {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            const coor = data[i].coor;
            const xH = coor.x;
            const yH = coor.y;
            const zH = coor.z;
            if (zH !== undefined) {
                const size = 20;
                const offset = size * 1;
                const x = ((offset * 1.73) * xH) + ((offset * 1.73) * yH);
                const y = ((offset * 2) * yH) + (offset * zH);
                const div = <>
                    <div
                        class="hex"
                        style={{
                            transform: `translate(${x}px, ${y}px)`,
                            height: `${size * 1.73}px`,
                            width: `${size}px`
                        }}>
                        <p class={"cor"}>
                            {/* {coor.x},
                            {coor.y},
                            {coor.z} */}
                            {/* {data[i].context.border ? "yup" : "no"} */}
                        </p>
                    </div>
                </>
                arr.push(div);
            }
        }
        return (<div
            id="hexGrid"
            style={{
                minHeight: `${hexSize * 90}px`,
                top: `${hexSize * 40}px`
            }}>
            {arr}
        </div>)
    }

    return {
        setSquareMapSize,
        createTileData,
        createTile,
        setHexMapSize,
        createHexData,
        createHexMap,
    }
}
import { MapData, TileData, TileType } from "../type";
import useAppStore from "../useAppStore";
import useCreature from "./useCreature";

export default function useMap() {

    const { player } = useAppStore();
    const { createCreature } = useCreature();

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
                const props: TileData = {
                    coor: { x: j, y: i },
                    creature: null,
                    type: getTileType(),
                    context: {
                        tiles: [],
                        border: border
                    }
                };
                cols.push(props); // zapakira X v zbiralnik
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

    const createTile = (data: MapData) => {
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

    return {
        createTileData,
        createTile
    }
}
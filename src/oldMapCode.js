/*CODE FOR STORAGE, HOW TO MAKE INTERACTIVE 2D MAP*/

const eventListenerSquareMove = (event: KeyboardEvent) => {
    const key = event.key;
    if (!squareMapData) { return }
    if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
        let pcCoor = { x: 0, y: 0 };
        squareMapData.forEach(
            (x) => x.forEach(
                (y) => {
                    if (y.creature?.id === "player") {
                        pcCoor = y.coor;
                    }
                }
            )
        );
        if (key === "ArrowUp") {
            if ((pcCoor.y + 1) < squareSize[1]) {
                squareMapData[pcCoor.y + 1][pcCoor.x].creature = { id: "player" };
                squareMapData[pcCoor.y][pcCoor.x].creature = null;
                setSquareMapData(squareMapData);
            }
        }
        else if (key === "ArrowLeft") {
            if ((pcCoor.x - 1) >= 0) {
                squareMapData[pcCoor.y][pcCoor.x].creature = null;
                squareMapData[pcCoor.y][pcCoor.x - 1].creature = { id: "player" };
                setSquareMapData(squareMapData);
            }
        }
        else if (key === "ArrowRight") {
            if ((pcCoor.x + 1) < squareSize[0]) {
                squareMapData[pcCoor.y][pcCoor.x].creature = null;
                squareMapData[pcCoor.y][pcCoor.x + 1].creature = { id: "player" };
                setSquareMapData(squareMapData);
            }
        }
        else if (key === "ArrowDown") {
            if ((pcCoor.y - 1) >= 0) {
                squareMapData[pcCoor.y][pcCoor.x].creature = null;
                squareMapData[pcCoor.y - 1][pcCoor.x].creature = { id: "player" };
                setSquareMapData(squareMapData);
            }
        }
    }
}

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

const getTile = (x: number, y: number) => {
    let tile: TileData = {
        coor: { x: x, y: y },
        creature: null,
        type: getTileType(),
        context: {
            tiles: [],
            border: false
        }
    }
    return tile;
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

const newSquareGame = () => {
    let mid: [number, number] = [
        Math.floor(squareSize[1] / 2),
        Math.floor(squareSize[0] / 2)
    ]
    let newData = createTileData(squareSize);
    newData[mid[0]][mid[1]].creature = { id: "player" };
    setHexMapData(null);
    setSquareMapData(newData);
};

/*TYPES*/

type TileData = {
    coor: { x: number, y: number };
    creature: Creature | { id: "player" } | null;
    type: TileType;
    context: {
        tiles: TileType[];
        border: boolean;
    }
};

type SquareMapData = TileData[][];
export default function useMap() {

    const tileSize: [number, number] = [9, 9];
    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    }

    const getTileType = () => {
        const num = getRandomInt(6);
        switch (num) {
            case 1: return "sea";
            case 2: return "sea";
            case 3: return "sea";
            case 4: return "sea";
            case 5: return "vulcano";
            default: return "sea";
        }
    }

    const tileColsData = (yNum: number) => {
        const cols = [];
        for (let i = 0; i < yNum; i++) {
            const props = {
                type: getTileType(),
                value: i + 1
            };
            cols.push(props);
        }
        return cols;
    };

    const createTileData = (
        [xNum, yNum]: [xNum: number, yNum: number]
    ) => {
        const tile = [];
        for (let i = 0; i < xNum; i++) {
            tile.push(tileColsData(yNum));
        }
        return tile;
    };

    const createTile = () => {
        const tileData = createTileData(tileSize);

        const tile = tileData.map((x, index) => {
            const yArr = x.map((y) => {
                return (
                    <div
                        class="colTile"
                        style={{ backgroundColor: y.type === "vulcano" ? "red" : "blue" }}>
                        {/* {"x" + (index + 1) + "y" + y.value} */}
                    </div>
                )
            });
            return (
                <div class={"rowTile"}>
                    {yArr}
                </div>
            )
        })

        return (
            <div class="tile">
                {tile}
            </div>
        )
    };

    return {
        createTile
    }
}
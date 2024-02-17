import { MapData, TileData } from "../type";
import useAppStore from "../useAppStore";
import useCreature from "./useCreature";

export default function useMap() {

    const { player, setPCData } = useAppStore();
    const { createCreature } = useCreature();

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    }

    const getTileType = () => {
        const num = getRandomInt(7);
        switch (num) {
            case 1: return "sea";
            case 2: return "sea";
            case 3: return "sea";
            case 4: return "sea";
            case 5: return "sea";
            case 6: return "vulcano";
            default: return "sea";
        }
    }

    const tileColsData = (y: number, xNum: number) => {
        const cols = [];
        for (let i = 0; i < xNum; i++) {
            const props: TileData = {
                coor: { x: i, y: y },
                creature: null,
                type: getTileType(),
            };
            cols.push(props);
        }
        return cols;
    };

    const createTileData = (
        [xNum, yNum]: [xNum: number, yNum: number]
    ) => {
        const tile = [];
        for (let i = 0; i < yNum; i++) {
            tile.push(tileColsData(i, xNum));
        }
        return tile;
    };

    const createTile = (data: MapData) => {
        const tile = data.map((y) => {
            const yArr = y.map((x) => {
                const creature = x.creature;

                return (
                    <div
                        class="colTile"
                        style={{
                            backgroundColor: x.type === "vulcano" ? "red" : "blue"
                        }}>
                        {/* {x.coor.x},{x.coor.y} */}
                        {creature === "player" ?
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
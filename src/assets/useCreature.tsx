import { Creature } from "../type";
import useAppStore from "../useAppStore";

export default function useCreature() {

    const { tileSize, mapData, setMapData } = useAppStore();

    const createCreature = (data: Creature) => {
        const body = data.size.map((l) => {
            const bSegment = <div
                class="bSeg"
                style={{ backgroundColor: data.color }}>
            </div>
            const bSegArr = Array(l).fill(bSegment);
            return (<>{bSegArr}</>)
        });
        return (
            <div class="creature">
                {body}
            </div>
        )
    }

    const eventListenerMove = (event: KeyboardEvent) => {
        const key = event.key;
        if (!mapData) { return }
        if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
            let pcCoor = { x: 0, y: 0 };
            mapData.forEach(
                (x) => x.forEach(
                    (y) => {
                        if (y.creature?.id === "player") {
                            pcCoor = y.coor;
                        }
                    }
                )
            );
            if (key === "ArrowUp") {
                if ((pcCoor.y + 1) < tileSize[1]) {
                    mapData[pcCoor.y + 1][pcCoor.x].creature = { id: "player" };
                    mapData[pcCoor.y][pcCoor.x].creature = null;
                    setMapData(mapData);
                }
            }
            else if (key === "ArrowLeft") {
                if ((pcCoor.x - 1) >= 0) {
                    mapData[pcCoor.y][pcCoor.x].creature = null;
                    mapData[pcCoor.y][pcCoor.x - 1].creature = { id: "player" };
                    setMapData(mapData);
                }
            }
            else if (key === "ArrowRight") {
                if ((pcCoor.x + 1) < tileSize[0]) {
                    mapData[pcCoor.y][pcCoor.x].creature = null;
                    mapData[pcCoor.y][pcCoor.x + 1].creature = { id: "player" };
                    setMapData(mapData);
                }
            }
            else if (key === "ArrowDown") {
                if ((pcCoor.y - 1) >= 0) {
                    mapData[pcCoor.y][pcCoor.x].creature = null;
                    mapData[pcCoor.y - 1][pcCoor.x].creature = { id: "player" };
                    setMapData(mapData);
                }
            }
        }
    }

    return {
        createCreature,
        eventListenerMove
    }
}
import { Creature } from "../type";
import useAppStore from "../useAppStore";

export default function useCreature() {

    const { mapData, setMapData } = useAppStore();

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
                        if (y.creature === "player") {
                            pcCoor = y.coor;
                        }
                    }
                )
            );
            if (key === "ArrowUp") {
                mapData[pcCoor.y + 1][pcCoor.x].creature = "player";
                mapData[pcCoor.y][pcCoor.x].creature = null;
                setMapData(mapData);
            }
            else if (key === "ArrowLeft") {
                mapData[pcCoor.y][pcCoor.x].creature = null;
                mapData[pcCoor.y][pcCoor.x - 1].creature = "player";
                setMapData(mapData);
            }
            else if (key === "ArrowRight") {
                mapData[pcCoor.y][pcCoor.x].creature = null;
                mapData[pcCoor.y][pcCoor.x + 1].creature = "player";
                setMapData(mapData);
            }
            else if (key === "ArrowDown") {
                mapData[pcCoor.y][pcCoor.x].creature = null;
                mapData[pcCoor.y - 1][pcCoor.x].creature = "player";
                setMapData(mapData);
            }
        }
    }

    return {
        createCreature,
        eventListenerMove
    }
}
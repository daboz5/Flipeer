import { Creature } from "../type";
import useAppStore from "../useAppStore";

export default function useCreature() {

    const { squareSize, squareMapData, setSquareMapData } = useAppStore();

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

    return {
        createCreature,
        eventListenerMove
    }
}
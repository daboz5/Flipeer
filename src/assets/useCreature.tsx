import { Creature } from "../type";
import useAppStore from "../useAppStore";

export default function useCreature() {

    const {
        squareSize,
        hexNums,
        squareMapData,
        hexMapData,
        setSquareMapData,
        setHexMapData
    } = useAppStore();

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

    const eventListenerHexMove = (event: KeyboardEvent) => {
        const key = event.key;
        if (!hexMapData) { return }
        if (
            key === "q" || key === "Q" ||
            key === "w" || key === "W" ||
            key === "e" || key === "E" ||
            key === "a" || key === "A" ||
            key === "s" || key === "S" ||
            key === "d" || key === "D"
        ) {

            const pcIndex = hexMapData.findIndex((hex) => hex.creature?.id === "player");
            const pcX = hexMapData[pcIndex].coor.x;
            const pcY = hexMapData[pcIndex].coor.y;
            const pcZ = hexMapData[pcIndex].coor.z;
            const hexSize = hexNums[0];

            if (key === "q" || key === "Q") {
                const moveToIndex = pcIndex - 1;
                if (
                    pcZ < hexSize &&
                    pcY > -hexSize
                ) {
                    hexMapData[pcIndex].creature = null;
                    hexMapData[moveToIndex].creature = { id: "player" };
                    setHexMapData(hexMapData);
                }
            }

            else if (key === "w" || key === "W") {
                let xMove = Math.abs(pcX);
                if (pcX < 0) { xMove-- }
                let moveToIndex = pcIndex + (hexSize * 2) - xMove;
                if (
                    pcX < hexSize &&
                    pcY > -hexSize
                ) {
                    hexMapData[pcIndex].creature = null;
                    hexMapData[moveToIndex].creature = { id: "player" };
                    setHexMapData(hexMapData);
                }
            }

            else if (key === "e" || key === "E") {
                let xMove = Math.abs(pcX);
                if (pcX < 0) { xMove-- }
                let moveToIndex = pcIndex + ((hexSize * 2) + 1) - xMove;
                if (
                    pcX < hexSize &&
                    pcZ > -hexSize
                ) {
                    hexMapData[pcIndex].creature = null;
                    hexMapData[moveToIndex].creature = { id: "player" };
                    setHexMapData(hexMapData);
                }
            }

            else if (key === "a" || key === "A") {
                let xMove = Math.abs(pcX);
                if (pcX > 0) { xMove-- }
                let moveToIndex = pcIndex - (hexSize * 2 + 1) + xMove;
                if (
                    pcZ < hexSize &&
                    pcX > -hexSize
                ) {
                    hexMapData[pcIndex].creature = null;
                    hexMapData[moveToIndex].creature = { id: "player" };
                    setHexMapData(hexMapData);
                }
            }

            else if (key === "s" || key === "S") {
                let xMove = Math.abs(pcX);
                if (pcX > 0) { xMove-- }
                let moveToIndex = pcIndex - (hexSize * 2) + xMove;
                if (
                    pcY < hexSize &&
                    pcX > -hexSize
                ) {
                    hexMapData[pcIndex].creature = null;
                    hexMapData[moveToIndex].creature = { id: "player" };
                    setHexMapData(hexMapData);
                }
            }

            else if (key === "d" || key === "D") {
                const moveToIndex = pcIndex + 1;
                if (
                    pcZ > -hexSize &&
                    pcY < hexSize
                ) {
                    hexMapData[pcIndex].creature = null;
                    hexMapData[moveToIndex].creature = { id: "player" };
                    setHexMapData(hexMapData);
                }
            }
        }
    }

    return {
        createCreature,
        eventListenerSquareMove,
        eventListenerHexMove
    }
}
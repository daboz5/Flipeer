import useAppStore from "../useAppStore";

export default function useCreature() {

    const {
        player,
        mapNums,
        mapData,
        setPCData,
        setMapData
    } = useAppStore();

    const eventListenerMove = (event: KeyboardEvent) => {
        if (!mapData) { return }
        const key = event.key;
        const moveKeys = [
            "q", "Q",
            "w", "W",
            "e", "E",
            "a", "A",
            "s", "S",
            "d", "D",
            "r", "R",
            "f", "F"
        ]

        if (moveKeys.includes(key)) {

            let newPlayer = player;

            if (key === "r" || key === "R") {
                newPlayer.orientation = newPlayer.orientation - 60;
                return setPCData(newPlayer);
            } else if (key === "f" || key === "F") {
                newPlayer.orientation = newPlayer.orientation + 60;
                return setPCData(newPlayer);
            }

            const pcIndex = mapData.findIndex((hex) => hex.creature?.id === "player");
            if (pcIndex === -1) { return }
            const { x: pcX, y: pcY, z: pcZ } = mapData[pcIndex].coor;
            const hexSize = mapNums.mapSize;
            let radius = hexSize * 2;
            let midDistance = Math.abs(pcX);
            let moveToIndex = 0;

            const move = (moveToIndex: number) => {
                mapData[pcIndex].creature = null;
                mapData[moveToIndex].creature = { id: "player" };
                setMapData(mapData);
            }


            if (key === "q" || key === "Q") {
                moveToIndex = pcIndex - 1;
                if (pcZ < hexSize && pcY > -hexSize) {
                    newPlayer.orientation = -60;
                    setPCData(newPlayer);
                    move(moveToIndex);
                }
            }

            else if (key === "w" || key === "W") {
                if (pcX < 0) { midDistance-- }
                moveToIndex = pcIndex + radius - midDistance;
                if (pcX < hexSize && pcY > -hexSize) {
                    newPlayer.orientation = 0;
                    setPCData(newPlayer);
                    move(moveToIndex);
                }
            }

            else if (key === "e" || key === "E") {
                if (pcX < 0) { midDistance-- }
                moveToIndex = pcIndex + (radius + 1) - midDistance;
                if (pcX < hexSize && pcZ > -hexSize) {
                    newPlayer.orientation = 60;
                    setPCData(newPlayer);
                    move(moveToIndex);
                }
            }

            else if (key === "a" || key === "A") {
                if (pcX > 0) { midDistance-- }
                moveToIndex = pcIndex - (radius + 1) + midDistance;
                if (pcZ < hexSize && pcX > -hexSize) {
                    newPlayer.orientation = -120;
                    setPCData(newPlayer);
                    move(moveToIndex);
                }
            }

            else if (key === "s" || key === "S") {
                if (pcX > 0) { midDistance-- }
                moveToIndex = pcIndex - radius + midDistance;
                if (pcY < hexSize && pcX > -hexSize) {
                    newPlayer.orientation = 180;
                    setPCData(newPlayer);
                    move(moveToIndex);
                }
            }

            else if (key === "d" || key === "D") {
                moveToIndex = pcIndex + 1;
                if (pcZ > -hexSize && pcY < hexSize) {
                    newPlayer.orientation = 120;
                    setPCData(newPlayer);
                    move(moveToIndex);
                }
            }
        }
    }

    return {
        eventListenerMove
    }
}
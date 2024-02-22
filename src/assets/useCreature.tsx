import useAppStore from "../useAppStore";
import useGame from "./useGame";

export default function useCreature() {

    const {
        player,
        mapNums,
        mapData,
        setPlayerData,
        setMapData
    } = useAppStore();
    const {
        harm,
        heal,
        tire,
        rest,
    } = useGame();

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

            /*ROTATE PLAYER THEN EXIT*/
            if (key === "r" || key === "R") {
                newPlayer.orientation = newPlayer.orientation - 60;
                return setPlayerData(newPlayer);
            } else if (key === "f" || key === "F") {
                newPlayer.orientation = newPlayer.orientation + 60;
                return setPlayerData(newPlayer);
            }

            const pcIndex = mapData.findIndex((hex) => hex.creature?.id === "player");
            if (pcIndex === -1) { return }
            const { x: pcX, y: pcY, z: pcZ } = mapData[pcIndex].coor;
            const hexSize = mapNums.mapSize;
            let radius = hexSize * 2;
            let midDistance = Math.abs(pcX);
            let moveToIndex = 0;

            /*CHECK MOVE FUNCTIONS*/
            const beforeMove = (newIndex: number) => {
                const newSpace = mapData[newIndex];
                const occupants = newSpace.creature;
                const terrain = newSpace.terrain;

                if (occupants) {
                    return {
                        move: false
                    }
                }

                return {
                    move: true
                }
            }

            const afterMove = (newIndex: number) => {
                const newSpace = mapData[newIndex];
                const occupants = newSpace.creature;
                const terrain = newSpace.terrain;

                if (terrain.type === "vulcano") {
                    newPlayer = harm(newPlayer, 2);
                    newPlayer = rest(newPlayer, 3);
                }

                if (terrain.type === "atVulcano") {
                    newPlayer = heal(newPlayer, 1);
                    newPlayer = rest(newPlayer, 2);
                }

                if (terrain.type === "sea") {
                    newPlayer = tire(newPlayer, 1);
                }

                setPlayerData(newPlayer);
            }

            const move = (moveToIndex: number) => {
                const evaluation = beforeMove(moveToIndex);

                if (evaluation.move) {
                    afterMove(moveToIndex);

                    mapData[pcIndex].creature = null;
                    mapData[moveToIndex].creature = player;
                    setMapData(mapData);
                }
            }

            /*MOVE TO TILE CHECKS*/
            if (key === "q" || key === "Q") {
                moveToIndex = pcIndex - 1;
                if (pcZ < hexSize && pcY > -hexSize) {
                    newPlayer.orientation = -60;
                    move(moveToIndex);
                }
            }

            else if (key === "w" || key === "W") {
                if (pcX < 0) { midDistance-- }
                moveToIndex = pcIndex + radius - midDistance;
                if (pcX < hexSize && pcY > -hexSize) {
                    newPlayer.orientation = 0;
                    move(moveToIndex);
                }
            }

            else if (key === "e" || key === "E") {
                if (pcX < 0) { midDistance-- }
                moveToIndex = pcIndex + (radius + 1) - midDistance;
                if (pcX < hexSize && pcZ > -hexSize) {
                    newPlayer.orientation = 60;
                    move(moveToIndex);
                }
            }

            else if (key === "a" || key === "A") {
                if (pcX > 0) { midDistance-- }
                moveToIndex = pcIndex - (radius + 1) + midDistance;
                if (pcZ < hexSize && pcX > -hexSize) {
                    newPlayer.orientation = -120;
                    move(moveToIndex);
                }
            }

            else if (key === "s" || key === "S") {
                if (pcX > 0) { midDistance-- }
                moveToIndex = pcIndex - radius + midDistance;
                if (pcY < hexSize && pcX > -hexSize) {
                    newPlayer.orientation = 180;
                    move(moveToIndex);
                }
            }

            else if (key === "d" || key === "D") {
                moveToIndex = pcIndex + 1;
                if (pcZ > -hexSize && pcY < hexSize) {
                    newPlayer.orientation = 120;
                    move(moveToIndex);
                }
            }
        }
    }

    return {
        eventListenerMove
    }
}
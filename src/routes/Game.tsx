import { useEffect } from "preact/hooks";
import useAppStore from "../useAppStore";
import useCreature from "../assets/useCreature";
import useGame from "../assets/useGame";
import useMap from "../assets/useMap";
import "../assets/Creature.css";
import "../assets/Map.css";
import "../assets/Menu.css";
import "../assets/GameUI.css";

export default function Game() {

    const {
        hexNums,
        player,
        squareMapData,
        hexMapData,
        setHexMapData,
        setSquareMapData
    } = useAppStore();
    const {
        eventListenerMove,
    } = useCreature();
    const {
        createHexData,
        createTile,
        createHexMap,
        setSquareMapSize,
        setHexMapSize
    } = useMap();
    const { newSquareGame, newHexGame } = useGame();

    useEffect(() => {
        document.addEventListener("keydown", eventListenerMove);
        return () => document.removeEventListener("keydown", eventListenerMove);
    }, [eventListenerMove]);

    useEffect(() => {
        if (squareMapData || hexMapData) {
            let newData = createHexData(hexNums[0]);
            setSquareMapData(null);
            setHexMapData(newData);
        }
    }, [hexNums])


    return (<>

        <div id="viewport">
            {squareMapData ? createTile(squareMapData) : <></>}
            {hexMapData ? createHexMap(hexMapData) : <></>}
        </div>

        {squareMapData || hexMapData ?
            <>
                <div id="pcStats" class={"flex alignFlex"}>
                    <p>
                        {player.hp} / {player.maxHp} Hp
                    </p>
                    <p>
                        {player.energy} / {player.maxEnergy} Energy
                    </p>
                    <p>
                        {player.attack} Atk
                    </p>
                    <p>
                        {player.defence} Def
                    </p>
                    <p>
                        Size {player.size}
                    </p>
                </div>
                <p>
                    Za premikanje uporabi: <br />
                    <b>
                        {squareMapData ?
                            "⬆️⬇️⬅️➡️" :
                            "Q E A D Y X"}
                    </b>
                </p>
            </> :
            <></>
        }

        <div id="menu" class={"colFlex"}>
            <button
                onClick={() => newSquareGame()}>
                New Square Map
            </button>

            <button
                onClick={() => newHexGame()}>
                New Hex Map
            </button>

            <form
                id="squareCngSize"
                class={"colFlex alignFlex"}
                onSubmit={(e) => {
                    e.preventDefault();
                    setSquareMapSize(e.target);
                }}>
                <button
                    for="squareCngSize"
                    type={"submit"}>
                    Change Square Size
                </button>
                <label>
                    <input
                        type={"number"}
                        id="xInput"
                        placeholder={"x"}
                        required>
                    </input>
                    <input
                        type={"number"}
                        id="yInput"
                        placeholder={"y"}
                        required>
                    </input>
                </label>
            </form>

            <form
                id="hexCngSize"
                class={"colFlex alignFlex"}
                onSubmit={(e) => {
                    e.preventDefault();
                    setHexMapSize(e.target);
                }}>
                <button
                    for="hexCngSize"
                    type={"submit"}>
                    <p>Change Hex<br />Number / Size / Space</p>
                </button>
                <label>
                    <input
                        type={"number"}
                        id="hexNumInput"
                        placeholder={"num"}>
                    </input>
                    <input
                        type={"number"}
                        id="hexSizeInput"
                        placeholder={"size"}>
                    </input>
                    <input
                        type={"number"}
                        step=".1"
                        id="hexSpaceInput"
                        placeholder={"space"}>
                    </input>
                </label>
            </form>
            <p>* Work in progress</p>
        </div>

    </>)
}
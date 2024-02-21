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
        mapNums,
        player,
        mapData,
        setMapData,
    } = useAppStore();
    const {
        eventListenerMove,
    } = useCreature();
    const {
        createMapData,
        createMap,
        setMapSize
    } = useMap();
    const { newGame } = useGame();

    useEffect(() => {
        if (mapData) {
            document.addEventListener("keydown", eventListenerMove);
        }
        return () => {
            document.removeEventListener("keydown", eventListenerMove);
        }
    }, [eventListenerMove]);

    useEffect(() => {
        if (mapData) {
            let newData = createMapData(mapNums.mapSize);
            newData[Math.floor(newData.length / 2)].creature = { id: "player" };
            setMapData(newData);
        }
    }, [mapNums])


    return (<>

        {/*MAPA IN VSE NA NJEJ*/}
        <div id="viewport">
            {mapData ? createMap(mapData) : <></>}
        </div>

        {/*STATISTIKE IGRALCA IN GAME INFO*/}
        {mapData &&
            <>
                <div id="pcStats" class={"flex alignFlex"}>
                    <p>
                        {player.general.health.hp} / {player.general.health.hpMax} Hp
                    </p>
                    <p>
                        {player.general.food.energy} / {player.general.food.energyMax} Energy
                    </p>
                    <p>
                        {player.general.attack} Atk
                    </p>
                    <p>
                        {player.general.defence} Def
                    </p>
                    <p>
                        Size {player.body.bodySize}
                    </p>
                </div>
                <p>
                    premikanje:<br />
                    <b>
                        Q W E<br />
                        A S D<br />
                    </b>
                    obračanje:<br />
                    <b>
                        R F
                    </b>
                </p>
            </>
        }

        {/*MENU IGRE*/}
        <div id="menu" class={"colFlex"}>

            <button
                onClick={() => newGame()}>
                New Hex Map
            </button>

            <form
                id="hexCngSize"
                class={"colFlex alignFlex"}
                onSubmit={(e) => {
                    e.preventDefault();
                    setMapSize(e.target);
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
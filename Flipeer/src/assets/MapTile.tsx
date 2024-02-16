import useMapData from "./useMap";

export default function MapTile() {

    const { createTile } = useMapData();

    return (<>
        {createTile()}
    </>)
}
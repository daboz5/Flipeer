type TileType = "sea" | "vulcano";

type TileData = {
    coor: { x: number, y: number, z: number | undefined };
    creature: Creature | { id: "player" } | null;
    type: TileType;
    context: {
        tiles: TileType[];
        border: boolean;
    }
};

type SquareMapData = TileData[][];
type HexMapData = TileData[];

type Creature = {
    id: number;
    hp: number;
    maxHp: number;
    attack: number;
    defence: number;
    energy: number;
    maxEnergy: number;
    sense: { fo: number, si: number, ba: number };
    move: { fo: number, si: number, ba: number };
    size: number[];
    resistence: string[];
    color: string;
}

export {
    TileType,
    TileData,
    SquareMapData,
    HexMapData,
    Creature
}
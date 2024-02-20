type TileType = "sea" | "vulcano";

type TileData = {
    coor: { x: number, y: number };
    creature: Creature | { id: "player" } | null;
    type: TileType;
    context: {
        tiles: TileType[];
        border: boolean;
    }
};

type HexTileData = {
    coor: { x: number, y: number, z: number };
    creature: Creature | { id: "player" } | null;
    type: TileType;
    context: {
        tiles: TileType[];
        border: boolean;
    }
};

type SquareMapData = TileData[][];
type HexMapData = HexTileData[];

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
    HexTileData,
    SquareMapData,
    HexMapData,
    Creature
}
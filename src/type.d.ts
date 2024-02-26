/*MAP*/

type MapNumbers = {
    mapRadius: number;
    tileSize: number;
    tileSpacing: number;
}

type TileType = "sea" | "atVulcano" | "vulcano";

type Temperature = {
    scale: -3;
    description: "absolute";
} | {
    scale: -2;
    description: "freezing";
} | {
    scale: -1;
    description: "cold";
} | {
    scale: 0;
    description: "average";
} | {
    scale: 1;
    description: "warm";
} | {
    scale: 2;
    description: "hot";
} | {
    scale: 3;
    description: "melting";
} | {
    scale: 4;
    description: "hell";
}

type Resource = {
    type: string;
    amount: number;
}

type TileData = {
    type: TileType;
    values: {
        color: string;
        temperature: Temperature;
        resources: Resource[];
    }
}

type Tile = {
    coor: { x: number, y: number, z: number };
    creature: Creature | null;
    terrain: TileData;
    context: {
        tiles: TileType[];
        border: boolean;
    }
};

type Population = {
    name: string;
    strength: number;
}

type LocalMap = {
    region: Tile[];
    population: Population[];
    biomStr: number;
};

/*CREATURE*/

type Segment = {} | {
    attack: number;
    defence: number;
    resistences: Resistence[];
    quirks: string[];
}

type Resistence = {
    type: string;
    effect: number;
}

type Movement = {
    type: string;
    drain: number;
}

type EnergySource = {
    type: string;
    metabolicRate: number;
}

type Creature = {
    name: string;
    type: "player" | "relative" | "alien";
    orientation: number;
    general: {
        body: {
            color: string;
            segmentation: Segment[];
            size: number;
            sizeMax: number;
        };
        combat: {
            attack: number;
            defence: number;
        };
        health: {
            energy: number;
            energyMax: number;
            energySourse: EnergySource[];
            hp: number;
            hpMax: number;
            storage: number;
            storageMax: number;
        };
        movements: Movement[];
        resistences: Resistence[];
        temperature: Temperatures[];
    };
}

export {
    TileType,
    TileData,
    Tile,
    MapNumbers,
    LocalMap,
    Creature,
}
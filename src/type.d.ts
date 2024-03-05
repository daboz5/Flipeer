/*MAP*/

type Coor = { x: number, y: number, z: number }

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
    info: {
        index: number;
        coor: Coor;
    },
    context: {
        border: boolean;
        coors: Coor[];
        indexes: number[];
        tileTypes: TileType[];
    }
    creature: Creature | null;
    seen: 0 | 25 | 100;
    terrain: TileData;
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

type GeneSplit = {
    species: string;
    split: number;
}

type Creature = {
    name: string;
    type: "player" | "NPC";
    genepool: GeneSplit[];
    alive: boolean;
    orientation: number;
    general: {
        awareness: {
            all: number;
            lf: number;
            f: number;
            rf: number;
            lb: number;
            b: number;
            rb: number;
        }
        body: {
            color: string;
            segmentation: Segment[];
            size: number;
            sizeMax: number;
        };
        combat: {
            attack: number;
            defence: number;
            hp: number;
            hpMax: number;
        };
        energy: {
            stamina: number;
            staminaMax: number;
            metabolizes: EnergySource[];
            storage: number;
            storageMax: number;
        };
        movements: Movement[];
        resistences: Resistence[];
        temperature: Temperatures[];
    };
}

type TileEvaluation = {
    index: number;
    desire: number;
    hardNo: boolean;
    flee: boolean;
    hunt: boolean;
}

export {
    Coor,
    TileType,
    TileData,
    Tile,
    MapNumbers,
    LocalMap,
    Creature,
    TileEvaluation
}
import { Connection } from "./Connection";
import { IConnectionId, IConnectionVariation } from "./interfaces";

export class ConnectionVariation extends Connection implements IConnectionVariation {
    weight:  number;
    enabled: boolean;

    constructor(id: IConnectionId, weight: number, enabled: boolean = true) {
        super(id);
        this.weight  = weight;
        this.enabled = enabled;
    }

    mutateWeight() : IConnectionVariation {
        this.weight = Math.random();

        return this;
    }

    shiftWeight(): IConnectionVariation {
        const shift = (this.weight - 2 * this.weight * Math.random()) * 0.1;
        this.weight += shift;
        return this;
    }

    mutateEnabled() : IConnectionVariation {
        this.enabled = !this.enabled;

        return this;
    }

    copy() : IConnectionVariation {
        return new ConnectionVariation(
            this.id,
            this.weight,
            this.enabled
        );
    }
}

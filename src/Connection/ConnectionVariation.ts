import { Connection } from "./Connection";
import { ConnectionId } from "./ConnectionId";
import { IConnectionVariation } from "./interfaces";

export class ConnectionVariation extends Connection implements IConnectionVariation {
    weight:  number;
    enabled: boolean;

    constructor(id: ConnectionId, weight: number, enabled: boolean = true) {
        super(id);
        this.weight  = weight;
        this.enabled = enabled;
    }

    mutateWeight() : IConnectionVariation {
        const variation = this.copy();

        variation.weight = Math.random();

        return variation;
    }

    mutateEnabled() : IConnectionVariation {
        const variation = this.copy();

        variation.enabled = !variation.enabled;

        return variation;
    }

    copy() : IConnectionVariation {
        return new ConnectionVariation(
            this.id,
            this.weight,
            this.enabled
        );
    }
}

import { booster } from '../core';
import { DependencyA } from "./dependencyA.mock";

@booster()
export class DependencyC {

    constructor(public a: DependencyA) { }

    public update() {
        this.a.data++;
    }
}

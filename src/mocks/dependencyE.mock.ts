import { booster } from '../core';
import { DependencyA } from "./dependencyA.mock";
import { DependencyD } from './dependencyD.mock';

@booster()
export class DependencyE {

    constructor(
        public a: DependencyA,
        public d: DependencyD
    ) { }

    public update() {
        this.d.update();
    }
}

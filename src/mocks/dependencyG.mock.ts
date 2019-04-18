import { booster } from "../core";
import { DependencyA } from "./dependencyA.mock";

@booster({
    child: 'DependencyA'
})
export class DependencyG implements DependencyA {

    public data: number = 0;

    public getData(): number {
        return this.data;
    }
}

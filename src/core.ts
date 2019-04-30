require("reflect-metadata");

type IType<T> = new(...args: Array<any>) => T;

interface IContainer {
    name: string;
    class: any;
    data?: any;
    target: IType<any>;
}

/**
 * booster
 * @description Decorator to retreive Classes
 * @param data info to attach to the Class
 */
export const booster = (data?: any): (target: IType<any>) => void => {
    return (target: IType<any>) => {
        Reflect.defineMetadata("data", data || {}, target);
        return;
    };
};

/**
 * Injector
 * @description Container to Store and Retreive Classes
 */
export class Injector {

    private container: Array<IContainer> = [];

    /**
     * register
     * @description Register a Class with a custom name
     * @param className Name you want the class to have
     * @param target Class to register
     * @example
     *  ```
     *  @booster()
     *  class Example {
     *  }
     *
     *  Inject.register('CustomExample', Example);
     *  ```
     */
    public register<T>(className: string, target: IType<T>): T {
        let found = false;
        const tokens = Reflect.getMetadata("design:paramtypes", target) || [];
        const inject = tokens.map((token: any) => this.resolve(token));
        const newClass: IContainer = {
            class: new target(...inject),
            name: className,
            data: Reflect.getMetadata('data', target),
            target
        };
        this.container.map((container) => {
            if (container.name === className) {
                found = true;
                return newClass;
            }
            return container;
        });
        if (!found)
            this.container.push(newClass);
        return newClass.class;
    }

    /**
     * inject
     * @description Retrive class with dependencies injected
     * @param target Class to inject
     * @example
     * ```
     *  @booster()
     *  class Greeter {
     *     public hello() {
     *          return "Hello";
     *     }
     *  }
     *
     *  @booster()
     *  class Human {
     *     constructor(
     *          greet: Greeter
     *     ) { }
     *
     *     public hello(): string {
     *          return greet.hello();
     *     }
     *  }
     *
     *  const example = Inject.inject(Example);
     *  example.hello() // Returns "Hello"
     *  ```
     */
    public inject<T>(target: IType<T>): T {
        return this.resolve(target);
    }

    /**
     * getByKey
     * @description Gets all class with a specific key attached as metadata
     * @param keyName Key to find on Target
     */
    public getByKey<T>(keyName: string): Array<T> {
        const classArray: Array<T> = [];
        this.container.forEach((container: IContainer) => {
            const data = Reflect.getMetadata('data', container.target);
            if (data === undefined)
                return;
            if (data[keyName] !== undefined)
                classArray.push(this.resolve(container.target));
        });
        return classArray;
    }

    /**
     * getByValue
     * @description Gets all class with a specific value to the key attached as metadata
     * @param keyName Key to find on Target
     * @param value to find on key
     */
    public getByValue<T>(keyName: string, value: any): Array<T> {
        const classArray: Array<T> = [];
        this.container.forEach((container: IContainer) => {
            const data = Reflect.getMetadata('data', container.target);
            if (data === undefined)
                return;
            if (data[keyName] === value)
                classArray.push(this.resolve(container.target));
        });
        return classArray;
    }

    /**
     * getContainerByKey
     * @description Returns Container with certain key
     * @param keyName to find on target
     */
    public getContainerByKey(keyName: string): Array<IContainer> {
        const containerArray: Array<IContainer> = [];
        this.container.forEach((container: IContainer) => {
            const data = Reflect.getMetadata('data', container.target);
            if (data === undefined)
                return;
            if (data[keyName] !== undefined) {
                this.resolve(container.target);
                containerArray.push(container);
            }
        });
        return containerArray;
    }

    /**
     * getContainerByValue
     * @description Gets all class with a specific value to the key attached as metadata
     * @param keyName Key to find on Target
     * @param value to find on key
     */
    public getContainerByValue(keyName: string, value: any): Array<IContainer> {
        const containerArray: Array<IContainer> = [];
        this.container.forEach((container: IContainer) => {
            const data = Reflect.getMetadata('data', container.target);
            if (data === undefined)
                return;
            if (data[keyName] === value) {
                this.resolve(container.target);
                containerArray.push(container);
            }
        });
        return containerArray;
    }

    /**
     * resolve
     * @description Resolves dependencies and retruns injected Class
     * @param target Class
     */
    private resolve<T>(target: IType<T>): T {
        const tokens = Reflect.getMetadata("design:paramtypes", target) || [];
        const inject = tokens.map((token: any) => this.resolve(token));
        const className = (target as any).name;
        const temp = this.container.filter((dependency: IContainer) => {
            if (dependency.name === className)
                return dependency;
            return null;
        });
        if (temp.length > 0)
            return temp[0].class;
        const newClass: IContainer = {
            class: new target(...inject),
            name: className,
            data: Reflect.getMetadata('data', target),
            target
        };
        this.container.push(newClass);
        return newClass.class;
    }
}

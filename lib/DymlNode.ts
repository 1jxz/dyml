export class DymlJsonNode implements DymlJsonNode {
    nodeType?: string;
    properties?: DymlJsonProperty[] = [];
    childNodes?: DymlJsonNode[] = [];
}
export class DymlJsonProperty implements DymlJsonProperty {
    name?: string;
    value?: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

export class DymlNode {
    internalId: string = crypto.randomUUID();
    parentNode: DymlNode | null;
    childNodes: DymlNode[] = [];

    name?: string;
    label?: string;

    constructor(parentNode: DymlNode | null) {
        this.parentNode = parentNode;
    }

    public addChild(child: DymlNode) {
        this.childNodes.push(child);
        child.parentNode = this;
    }

    public removeFromParent() {
        if (this.parentNode) {
            const index = this.parentNode?.childNodes.indexOf(this) ?? -1;
            if (index > 0) {
                this.parentNode?.childNodes.splice(index, 1);
            }
        }
    }

    public putBeforeOnParent(node: DymlNode) {
        if (this.parentNode && node.hasSameParent(this) && this.isAddedToParent()) {
            node.removeFromParent();
            this.parentNode?.childNodes.splice(this.parentNode.childNodes.indexOf(this), 0, node);
        }
    }

    public isAddedToParent(): boolean {
        if (this.parentNode?.childNodes.includes(this)) {
            return true;
        } else {
            return false;
        }
    }

    public hasSameParent(node: DymlNode): boolean {
        if (node.parentNode === this.parentNode) {
            return true;
        } else {
            return false;
        }
    }

    public isDescendentOf(node: DymlNode, visited: Set<DymlNode> = new Set<DymlNode>()): boolean {
        if (visited.has(node)) { return false; }
        visited.add(node);

        if (node?.childNodes.includes(this)) { return true; }
        else {
            node?.childNodes.forEach((child) => {
                if (node.isDescendentOf(child, visited)) { return true; }
            });
        }
        return false;
    }

    toJsonNode(): DymlJsonNode {
        return dymlToJsonNode(this);
    }
}

function dymlToJsonNode(dymlNode: DymlNode) {
    const jsonNode = new DymlJsonNode();

    if (dymlNode.name) jsonNode.properties?.push(new DymlJsonProperty("name", dymlNode.name));
    if (dymlNode.label) jsonNode.properties?.push(new DymlJsonProperty("label", dymlNode.label));

    dymlNode.childNodes.forEach((childNode) => {
        const jsonChild = childNode.toJsonNode();
        console.log("jsonChild: ", jsonChild);
        if (jsonChild) {
            jsonNode.childNodes?.push(jsonChild);
        }
    });

    return jsonNode;
}


export class Model extends DymlNode {
    // public addSelect(name: string, options?: string[]) {
    //     this.childNodes.push(new Select(this, name, options));
    // }    

    toJsonNode(): DymlJsonNode {
        const jsonNode = dymlToJsonNode(this);
        jsonNode.nodeType = "model";

        return jsonNode;
    }
}

export class Select extends DymlNode {
    defaultOption?: string;

    constructor(parentNode: DymlNode | null, name?: string, options?: string[]) {
        super(parentNode);
        this.name = name;
        options?.forEach((optionValue) => {
            this.childNodes.push(new Option(this, optionValue));
        });
    }

    toJsonNode(): DymlJsonNode {
        const jsonNode = dymlToJsonNode(this);
        jsonNode.nodeType = "select";

        return jsonNode;
    }
}

export class Option extends DymlNode {
    value?: string;

    constructor(parentNode: DymlNode | null, value?: string) {
        super(parentNode);
        this.value = value;
    }

    toJsonNode(): DymlJsonNode {
        const jsonNode = dymlToJsonNode(this);
        jsonNode.nodeType = "option";

        if (this.value) jsonNode.properties?.push(new DymlJsonProperty("value", this.value));

        return jsonNode;
    }
}

export class Scope extends DymlNode {
    toJsonNode(): DymlJsonNode {
        const jsonNode = dymlToJsonNode(this);
        jsonNode.nodeType = "scope";

        return jsonNode;
    }
}

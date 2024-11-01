"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scope = exports.Option = exports.Select = exports.Model = exports.DymlNode = exports.DymlJsonProperty = exports.DymlJsonNode = void 0;
class DymlJsonNode {
    constructor() {
        this.properties = [];
        this.childNodes = [];
    }
}
exports.DymlJsonNode = DymlJsonNode;
class DymlJsonProperty {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
exports.DymlJsonProperty = DymlJsonProperty;
class DymlNode {
    constructor(parentNode) {
        this.internalId = crypto.randomUUID();
        this.childNodes = [];
        this.parentNode = parentNode;
    }
    addChild(child) {
        this.childNodes.push(child);
        child.parentNode = this;
    }
    removeFromParent() {
        var _a, _b, _c;
        if (this.parentNode) {
            const index = (_b = (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.childNodes.indexOf(this)) !== null && _b !== void 0 ? _b : -1;
            if (index > 0) {
                (_c = this.parentNode) === null || _c === void 0 ? void 0 : _c.childNodes.splice(index, 1);
            }
        }
    }
    putBeforeOnParent(node) {
        var _a;
        if (this.parentNode && node.hasSameParent(this) && this.isAddedToParent()) {
            node.removeFromParent();
            (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.childNodes.splice(this.parentNode.childNodes.indexOf(this), 0, node);
        }
    }
    isAddedToParent() {
        var _a;
        if ((_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.childNodes.includes(this)) {
            return true;
        }
        else {
            return false;
        }
    }
    hasSameParent(node) {
        if (node.parentNode === this.parentNode) {
            return true;
        }
        else {
            return false;
        }
    }
    isDescendentOf(node, visited = new Set()) {
        if (visited.has(node)) {
            return false;
        }
        visited.add(node);
        if (node === null || node === void 0 ? void 0 : node.childNodes.includes(this)) {
            return true;
        }
        else {
            node === null || node === void 0 ? void 0 : node.childNodes.forEach((child) => {
                if (node.isDescendentOf(child, visited)) {
                    return true;
                }
            });
        }
        return false;
    }
    toJsonNode() {
        return dymlToJsonNode(this);
    }
}
exports.DymlNode = DymlNode;
function dymlToJsonNode(dymlNode) {
    var _a, _b;
    const jsonNode = new DymlJsonNode();
    if (dymlNode.name)
        (_a = jsonNode.properties) === null || _a === void 0 ? void 0 : _a.push(new DymlJsonProperty("name", dymlNode.name));
    if (dymlNode.label)
        (_b = jsonNode.properties) === null || _b === void 0 ? void 0 : _b.push(new DymlJsonProperty("label", dymlNode.label));
    dymlNode.childNodes.forEach((childNode) => {
        var _a;
        const jsonChild = childNode.toJsonNode();
        console.log("jsonChild: ", jsonChild);
        if (jsonChild) {
            (_a = jsonNode.childNodes) === null || _a === void 0 ? void 0 : _a.push(jsonChild);
        }
    });
    return jsonNode;
}
class Model extends DymlNode {
    // public addSelect(name: string, options?: string[]) {
    //     this.childNodes.push(new Select(this, name, options));
    // }    
    toJsonNode() {
        const jsonNode = dymlToJsonNode(this);
        jsonNode.nodeType = "model";
        return jsonNode;
    }
}
exports.Model = Model;
class Select extends DymlNode {
    constructor(parentNode, name, options) {
        super(parentNode);
        this.name = name;
        options === null || options === void 0 ? void 0 : options.forEach((optionValue) => {
            this.childNodes.push(new Option(this, optionValue));
        });
    }
    toJsonNode() {
        const jsonNode = dymlToJsonNode(this);
        jsonNode.nodeType = "select";
        return jsonNode;
    }
}
exports.Select = Select;
class Option extends DymlNode {
    constructor(parentNode, value) {
        super(parentNode);
        this.value = value;
    }
    toJsonNode() {
        var _a;
        const jsonNode = dymlToJsonNode(this);
        jsonNode.nodeType = "option";
        if (this.value)
            (_a = jsonNode.properties) === null || _a === void 0 ? void 0 : _a.push(new DymlJsonProperty("value", this.value));
        return jsonNode;
    }
}
exports.Option = Option;
class Scope extends DymlNode {
    toJsonNode() {
        const jsonNode = dymlToJsonNode(this);
        jsonNode.nodeType = "scope";
        return jsonNode;
    }
}
exports.Scope = Scope;
//# sourceMappingURL=DymlNode.js.map
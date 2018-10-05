export default class {

    constructor({ id, component, callback, options = {} }) {
        this.id = id;
        this.component = component;
        this.callback = callback;
        this.options = options;
    }

    getId() {
        return this.id;
    }

    getComponent() {
        return this.component;
    }

    getCallback() {
        return this.callback;
    }

    getOptions() {
        return this.options;
    }

}

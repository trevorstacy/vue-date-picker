/**
 * Parses Javascript Data from template
 */
class TemplateParsingService {

    constructor() {
        this.document = document;
        this.parsed = {};
    }

    /**
     * Returns parsed data or NULL if data cannot be found
     *
     * @param {String} name
     * @return {Array|String|Number|Object}
     */
    parse(name) {

        // return from history if it's there
        if (this.parsed[name]) {
            return this.parsed[name];
        }

        // Obtain data from DOM
        const element = this.document.querySelector('.injected-js-' + name);
        if (!element) {
            return null;
        }

        // Parse restaurants
        const data = JSON.parse(element.dataset.content);
        if (!data) {
            return null;
        }

        // add to history and return
        this.parsed[name] = data;
        return data;
    }

}

export default new TemplateParsingService();

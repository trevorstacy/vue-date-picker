export default class Restaurant {

    /**
     * Restaurant constructor
     *
     * @param data - object with restaurantData
     *      requiredKeys: [
     *          id,
     *          name,
     *          idStore,
     *          logoURL
     *      ]
     * @constructor
     */
    constructor(data) {
        this.id             = data.id;
        this.name           = data.name;
        this.idStore        = data.idStore;
        this.logoURL        = data.logoURL;
        this.active         = data.hasOwnProperty('active') ? data.active : true;
        this.allowDmToggle  = data.allowDmToggle;
    }

    /**
     * Returns the id of the restaurant (idShop)
     *
     * @return {number}
     */
    getId() {
        return +this.id;
    };

    /**
     * Returns the name of the restaurant
     *
     * @return {string}
     */
    getName() {
        return this.name;
    };

    /**
     * Returns the id of the restaurant's store (idStore)
     *
     * @return {number}
     */
    getStoreId() {
        return +this.idStore;
    };

    /**
     * Returns the URL of the restaurant's logo
     *
     * @return {string}
     */
    getLogoURL() {
        return this.logoURL;
    };

    /**
     * Returns the active state of the restaurant
     *
     * @return {boolean}
     */
    isActive() {
        return this.active;
    };

    /**
     * Sets the active state of the restaurant
     *
     * @param {boolean} isActive
     */
    setActiveState(isActive) {
        this.active = isActive;
    };

    /**
     * Returns if restaurant has allowed DM toggle.
     *
     * @returns {boolean}
     */
    getAllowDmToggle() {
        return this.allowDmToggle;
    }
}

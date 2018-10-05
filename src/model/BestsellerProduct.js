export default class BestsellerProduct {

    constructor(data) {
        this.productName = data['product'] + "";
        this.soldQuantity = +data['sold'];
        this.totalSales = +data['sales'];
        this.restaurantName = data['restaurantName'] + "";
    }

    getProductName() {
        return this.productName;
    }

    getSoldQuantity() {
        return this.soldQuantity;
    }

    getTotalSales() {
        return this.totalSales;
    }

    getRestaurantName() {
        return this.restaurantName;
    }
}

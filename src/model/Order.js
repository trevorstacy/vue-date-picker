import Moment       from "moment";
import Restaurant   from "./Restaurant";
import isNaN        from "lodash/isNaN";

export const PAYMENT_TYPES = {
    PAYMENT_TYPE_CASH: 1,
    PAYMENT_TYPE_CARD: 2
};

export const ORDER_STATES = {
    STATE_PREORDER: 1,
    STATE_ACCEPTED: 2,
    STATE_REJECTED: 3,
    STATE_PROGRESS: 4
};

/**
 * Order Model (mapped from order data returned by server)
 */
export default class Order {

    /**
     * Maps data to an Order object
     *
     * @param orderData
     */
    constructor(orderData) {
        this.id = +orderData['idOrder'];
        this.currentState = +orderData['currentState'];
        this.currentStateText = orderData['textualState'] + "";
        this.dateAdd = Moment(orderData['dateAdd'], "YYYY-MM-DD HH:mm:ss");
        this.customer = new OrderCustomer(orderData['firstname'] + "", orderData['lastname'] + "");
        this.paymentMethod = orderData['payment'];
        this.price = new OrderPrice(
            orderData['totalPaid'] || 0,
            orderData['totalShipping'] || 0,
            orderData['totalCredits'] || 0
        );
        this.address = new OrderAddress(
            orderData['address1'] + "",
            orderData['address2'] + "",
            orderData['city'] + "",
            orderData['addressNote'] + ""
        );
        this.restaurant = new Restaurant({'name': orderData['restaurantName']});
        this.products = (orderData['products'] || []).map(product => new OrderProduct(
            product['name'], product['price'], product['attributes'], product['quantity']));
        this.discounts = (orderData['discounts'] || []).map(discount => new OrderDiscount(discount['name'], -discount['value']));
        this.deliveryTime = orderData['deliveryTime'] || 'ihneď';
        this.takeaway = orderData['takeaway'];
    }

    /**
     * Returns id of the order
     *
     * @return {number}
     */
    getId() {
        return this.id;
    }

    /**
     * Returns current state of the order
     *
     * @return {number}
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * Returns current state of the order (textual)
     *
     * @return {string}
     */
    getCurrentStateText() {
        return this.currentStateText;
    }

    /**
     * Return Moment (date) object of the order's creation date
     *
     * @return {Moment}
     */
    getDateAdd() {
        return this.dateAdd;
    }

    /**
     * Returns OrderCustomer (customer) object of the order's customer
     *
     * @return {OrderCustomer}
     */
    getCustomer() {
        return this.customer;
    }

    /**
     * Returns payment method used to pay for the order
     *
     * @return {number}
     */
    getPaymentMethod() {
        return this.paymentMethod;
    }

    /**
     * Returns OrderPrice (prices) object of the order's prices
     *
     * @return {OrderPrice}
     */
    getPrice() {
        return this.price;
    }

    getAddress() {
        return this.address;
    }

    getRestaurant() {
        return this.restaurant;
    }

    getProducts() {
        return this.products;
    }

    getDiscounts() {
        return this.discounts;
    }

    getDeliveryTime() {
        return this.deliveryTime;
    }

    isTakeaway() {
        return this.takeaway;
    }
}

class OrderCustomer {

    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getFullName() {
        return this.getFirstName() + " " + this.getLastName();
    }
}

class OrderPrice {

    constructor(totalPaid, totalShipping, totalCredits) {
        this.totalProductsPrice = +totalPaid;
        this.shippingPrice = +totalShipping;
        this.creditsPrice  = +totalCredits;
    }

    getTotalProductsPrice() {
        return this.totalProductsPrice;
    }

    getShippingPrice() {
        return this.shippingPrice;
    }

    getCreditsPrice() {
        return this.creditsPrice;
    }

    getTotalPrice() {
        return this.getTotalProductsPrice() + this.getShippingPrice();
    }
}

class OrderAddress {

    constructor(address1, address2, city, note) {
        this.street = address1;
        this.number = address2;
        this.city   = city;
        this.note   = note;
    }

    getStreet() {
        return this.street;
    }

    getNumber() {
        return +this.number;
    }

    getCity() {
        return this.city;
    }

    getFullAddress() {
        return `${this.street} ${this.number} ${this.city}`;
    }

    getNote() {
        return this.note;
    }
}

class OrderProduct {

    constructor(name, price, attributes, quantity) {
        this.name = name;
        this.price = price;
        this.attributes = attributes;
        this.quantity = quantity;
    }

    getName() {
        return this.name;
    }

    getPrice() {
        return this.price;
    }

    getAttributes() {
        return this.attributes;
    }

    getQuantity() {
        return this.quantity;
    }
}

class OrderDiscount {

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    getName() {
        return this.name;
    }

    getValue() {
        return this.value;
    }
}

import { PAYMENT_TYPES } from "../../model/Order";

export default [
    {
        name: 'Hotovosť',
        value: PAYMENT_TYPES.PAYMENT_TYPE_CASH,
        selected: false
    },
    {
        name: 'Platobná karta',
        value: PAYMENT_TYPES.PAYMENT_TYPE_CARD,
        selected: false
    }
];

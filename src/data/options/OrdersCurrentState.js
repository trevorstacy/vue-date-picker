import { ORDER_STATES } from "../../model/Order";

export default [
    {
        name: 'Akceptovaná',
        value: ORDER_STATES.STATE_ACCEPTED,
        selected: false
    },
    {
        name: 'Predobjednávka',
        value: ORDER_STATES.STATE_PREORDER,
        selected: false
    },
    {
        name: 'Zrušená zákazníkom',
        value: ORDER_STATES.STATE_REJECTED,
        selected: false
    },
    {
        name: 'Prebieha spracovanie',
        value: ORDER_STATES.STATE_PROGRESS,
        selected: false
    }
];

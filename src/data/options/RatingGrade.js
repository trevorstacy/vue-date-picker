import { GRADE_TYPES } from "../../model/Rating";

export default [
    {
        name: 'Slabé',
        value: GRADE_TYPES.WORST,
        selected: false
    },
    {
        name: 'Nič moc',
        value: GRADE_TYPES.WORSE,
        selected: false
    },
    {
        name: 'Priemerné',
        value: GRADE_TYPES.MEDIUM,
        selected: false
    },
    {
        name: 'Veľmi dobré',
        value: GRADE_TYPES.BETTER,
        selected: false
    },
    {
        name: 'Výborné',
        value: GRADE_TYPES.BEST,
        selected: false
    }
];

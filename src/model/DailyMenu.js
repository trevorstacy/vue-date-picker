export default class DailyMenu {

    constructor(dailyMenuData) {
        this.id             = dailyMenuData['idProduct'];
        this.name           = dailyMenuData['name'];
        this.days           = dailyMenuData['daysOfWeek'];
        this.active         = dailyMenuData['active'];
        this.idCategory     = dailyMenuData['idCategory'];
        this.categoryName   = dailyMenuData['categoryName'];
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDays() {
        return this.days;
    }

    isActive() {
        return this.active;
    }

    setActive(active = true) {
        this.active = active;
    }

    getIdCategory() {
        return this.idCategory;
    }

    getCategoryName() {
        return this.categoryName;
    }
}

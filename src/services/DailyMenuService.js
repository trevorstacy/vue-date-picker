import axios                    from "axios";
import TemplateParsingService   from "./TemplateParsingService";
import Day                      from "../model/Day";
import DailyMenu                from "../model/DailyMenu";
import Moment                   from "moment";
import UrlBuilderService        from "../services/UrlBuilderService";

class DailyMenuService {

    async setActiveState(dailyMenu, active) {
        const url = UrlBuilderService.get(UrlBuilderService, { idProduct: dailyMenu.getId() });
        return await axios.post(url, { active });
    }

    preloadDailyMenuFromTemplate() {
        const dailyMenus = TemplateParsingService.parse('dailyMenus');

        if (!dailyMenus) {
            return;
        }

        // convert to DailyMenu objects and return
        return Object.keys(dailyMenus).map(key => new DailyMenu(dailyMenus[key]));
    };

    generateDayObjects() {
        // Creates Array[1, 2, ..., 7]
        let days = Array.from(new Array(7)).map((v, i) => i + 1);

        // Future dayTranslations are converted to last year's dayTranslations
        days = days.map(item => {
            return new Day(item);
        });

        days[Moment().day() - 1].setActive(true);

        // Converts to array of day objects
        return days;
    };

    getActiveDay() {
        let days = this.generateDayObjects();
        return days.find(day => day.isActive());
    };

    async getDailyMenus(params) {
        const url = this.router.get('api_get_daily_menu', params);
        const response = await axios.get(url);
        const dailyMenus = response.data;
        return Object.keys(dailyMenus).map(key => new DailyMenu(dailyMenus[key]));
    }

}

export default new DailyMenuService();

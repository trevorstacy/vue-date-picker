import { calendarTranslations } from "@/data/translations";

describe('translations.js', () => {
    it('should have all needed translations', () => {
        expect(calendarTranslations).toHaveProperty('dayMap');
        expect(calendarTranslations).toHaveProperty('shortDayMap');
        expect(calendarTranslations).toHaveProperty('monthMap');
        expect(calendarTranslations).toHaveProperty('cancelButtonText');
        expect(calendarTranslations).toHaveProperty('submitButtonText');
    });
});

const hbs = require("hbs");

class HbsConfigureCustomHelpers {
    /**
     * Define o custom helper do hbs, para realizar comporações de igualdade dentro de um view .hbs
     */
    static run() {
        hbs.registerHelper("eq", function (value1, value2) {
            if (value1 == value2)
                return true;
            return false;
        });

        hbs.registerHelper("formatDate", function (date) {
            if (!date) return "";
            const d = new Date(date);
            return d.toISOString().split("T")[0]; // Retorna YYYY-MM-DD
        });
    }
};

module.exports = HbsConfigureCustomHelpers;

const soap = require("soap");

module.exports = class CBRFFetcher {
    // noinspection JSMethodCanBeStatic
    async get(currency, date) {
        const client = await soap.createClientAsync("http://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL");

        const currencies = await client.GetCursOnDateXMLAsync({"On_date": date});

        return findCurrencyValue(currencies, currency).Vcurs || 0;
    }
};

function findCurrencyValue(currencies, currency) {
    return getCurrenciesListFromXML(currencies).find((cur) => cur.VchCode === currency.toUpperCase());
}

function getCurrenciesListFromXML(xml) {
    return xml[0] ? (xml[0].GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate || []) : [];
}

const assert = require("assert");

const CBRFFetcher = require("../../services/currency/lib/cbrf");

const UsdPrice = 65;
const EurPrice = 75;

const result = [{
    "GetCursOnDateXMLResult": {
        "ValuteData": {
            "attributes": {
                "OnDate": "20190509"
            },
            "ValuteCursOnDate": [
                {
                    "Vname": "Доллар США",
                    "Vnom": "1",
                    "Vcurs": UsdPrice.toString(),
                    "Vcode": "840",
                    "VchCode": "USD"
                },
                {
                    "Vname": "Евро",
                    "Vnom": "1",
                    "Vcurs": EurPrice.toString(),
                    "Vcode": "978",
                    "VchCode": "EUR"
                },
            ]
        }
    }
}];

class MockSoapClient {
    static async createClientAsync(url) {
        assert.strictEqual(url, "http://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL");

        return {
            async GetCursOnDateXMLAsync(options) {
                assert.ok(new Date(options["On_date"]).getTime() > 0);

                return result;
            }
        }
    }
}

describe("CBRFFetcher", function () {
    const cbrf = new CBRFFetcher(MockSoapClient);

    describe(".get", function () {
        it("should get currency value from CBRF API server", async function () {
            const usdResult = await cbrf.get("usd", new Date().toISOString());
            const eurResult = await cbrf.get("eur", new Date().toISOString());

            assert.strictEqual(usdResult, UsdPrice);
            assert.strictEqual(eurResult, EurPrice);
        });
    });
});

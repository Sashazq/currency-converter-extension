//get Rates and set it to localStorage

function get(methodType, url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open(methodType, url, true);
    httpRequest.onload = callback;
    httpRequest.onerror = function (e) {
        console.log(e)
    }
    httpRequest.send(null);
}

function updateRates() {
    var urlAPI = "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";
    get("GET", urlAPI, function () {
        var rates = JSON.parse(this.response);
        rates[rates.length - 1] = {ccy: "UAH", base_ccy: "UAH", buy: "1", sale: "1"};
        localStorage.setItem("Rates", JSON.stringify(rates));
    });
}

var updateInterval = 1000 * 60 * 60 * 1;
setInterval(updateRates, updateInterval);

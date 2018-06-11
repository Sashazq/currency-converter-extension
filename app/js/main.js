angular.module('ForEx', [])
    .service("Rates", function ($http) {
        this.getLocalRates = function () {
            return localStorage.getItem("Rates");
        };
        this.getRemoteRates = function () {
            return $http.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        };
    })
    .controller('ConvertCtrl', ['$scope', '$http', 'Rates', function ($scope, $http, Rates) {
        //init app
        //template's models
        //input models
        $scope.fromValue;
        $scope.toValue;
        //currency type models
        $scope.fromType;
        $scope.toType;
        //
        $scope.Loading = true;

        /**
         * saveRates
         * save data to localStorage
         * @param data -rates
         */
        $scope.convertCurrency = function () {
            var result = $scope.fromValue;

            if ($scope.fromType.buy === "1") {
                //if UAH
                //buy
                result = result * $scope.fromType.buy / $scope.toType.buy;
            } else {
                //sale
                result = result * $scope.fromType.sale / $scope.toType.sale;
            }

            $scope.toValue = result.toFixed(3);
        };

        var saveRates = function (data) {
                localStorage.setItem("Rates", JSON.stringify(data));
            },
            setDefaultSettings = function (rates) {
                $scope.toType = rates[0];
                $scope.fromType = rates[rates.length - 1];
                $scope.fromValue = 1;
                $scope.convertCurrency();
                $scope.Loading = false;
            };

        $scope.rates = Rates.getLocalRates();

        let parseRates = (res) => {
            let defaultCurrency = {ccy: "UAH", base_ccy: "UAH", buy: "1", sale: "1"};
            $scope.rates = res.data
                .map(item => item.ccy.toLocaleLowerCase() !== "btc" ? item : defaultCurrency);
            //add default rate for UAH to show in select elements

            setDefaultSettings($scope.rates);
            saveRates($scope.rates);
        };

        if ($scope.rates === null) {
            Rates.getRemoteRates()
                .then(parseRates);
        } else {
            $scope.rates = JSON.parse($scope.rates);
            setDefaultSettings($scope.rates);
        }
    }]);

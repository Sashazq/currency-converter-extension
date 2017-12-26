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
            if ($scope.fromType === "1") { //если конвертируем гривны в другую валюту
                result = result * $scope.toType;
            } else {
                result = result * $scope.fromType / $scope.toType;
            }

            $scope.toValue = result;
        };

        var saveRates = function (data) {
                localStorage.setItem("Rates", JSON.stringify(data));
            },
            setDefaultSettings = function (rates) {
                $scope.toType = rates[0].ccy;
                $scope.fromType = rates[1].ccy;
                $scope.fromValue = 1;
                $scope.convertCurrency();
                $scope.Loading = false;
            };

        $scope.rates = Rates.getLocalRates();
        if ($scope.rates === null) {
            Rates.getRemoteRates()
                .then(function (res) {
                    $scope.rates = res.data;
                    //add default rate for UAH to show in select elements
                    $scope.rates.push({ccy: "UAH", base_ccy: "UAH", buy: "1", sale: "1"});

                    setDefaultSettings($scope.rates);
                    saveRates($scope.rates);
                });
        } else {
            $scope.rates = JSON.parse($scope.rates);
            setDefaultSettings($scope.rates);
        }
    }]);
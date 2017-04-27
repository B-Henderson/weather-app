var angular = require('angular');
require('./scss/main.scss');
var app = angular.module('app', []);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);


app.factory('serviceFactory', function($http, provideWeatherFactory) {
  var serviceFactory = function(param) {
    return $http({
      method: 'GET',
      url: 'https://crossorigin.me/https://www.metaweather.com/api/location/' + param + '/'
    });
  }
  return serviceFactory;
});
app.factory('provideWeatherFactory', function($http) {
  var getweatherJson = function(param) {
    return $http({
      method: 'GET',
      url: 'https://crossorigin.me/https://www.metaweather.com/api/location/search/?query=' + param
    })
  }
  return getweatherJson;
});


function wController($scope, provideWeatherFactory, serviceFactory) {
  this.noLocation = null;
  $scope.loading = false;
  this.getReport = function(param) {
    $scope.loading = true;
    provideWeatherFactory(param).then(function(result) {
      console.log('results', result);
      serviceFactory(result.data[0].woeid).then(function(result) {
        $scope.weather = result.data;
        $scope.loading = false;
        displayResults();
      });
    });
  }

  var displayResults = function() {
    $scope.displaying = true;
    $scope.fiveDay = $scope.weather.consolidated_weather;
    console.log('five day', $scope.fiveDay);
  }
};


templatehtml = '<div class="container"><loading ng-if="loading"></loading><div class="display" ng-if="!loading && !displaying" ng-show="!widget.noLocation"><div>Enter a city: </div><input type="text" ng-model="widget.location"/><input type="button" value="GO" ng-click="widget.getReport(widget.location)"/></div><div class="five-day"><div class="days" ng-repeat="days in fiveDay track by $index">{{days.applicable_date}}{{days.weather_state_name}}<img ng-src="https://www.metaweather.com/static/img/weather/{{days.weather_state_abbr}}.svg" class="five-day-icon"/></div></div></div>';


angular.module('app').component('widgetComponent', {
  template: require('./templates/main.template.html'),
  controller: wController,
  controllerAs: 'widget'
});
app.component('loading', {
  template: require('./templates/loader.template.html')
});

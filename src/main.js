var angular = require('angular');
require('./scss/main.scss');
var app = angular.module('app', []);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);


app.filter('days', function($filter) {
  return function(input, name) {
    if (input) {
      var formatting = $filter('date')(input, 'dd-MMMM');
      var today = $filter('date')(new Date(), 'dd-MMMM');
      if (formatting === today && name) {
        return 'Today ';
      }
      var tomorrow = new Date();
      tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow = $filter('date')(tomorrow, 'dd-MMMM');
      if (formatting === tomorrow && name) {
        return 'Tomorrow';
      }

      if (name) {
        return $filter('date')(input, 'EEEE');
      }
      return formatting
    }
  };
})

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


function wController($scope, provideWeatherFactory, serviceFactory, daysFilter, $filter) {
  this.noLocation = null;
  $scope.loading = false;
  this.getReport = function(param) {
    $scope.loading = true;
    provideWeatherFactory(param).then(function(result) {
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
  }
};


angular.module('app').component('widgetComponent', {
  template: require('./templates/main.template.html'),
  controller: wController,
  controllerAs: 'widget'
});
app.component('loading', {
  template: require('./templates/loader.template.html')
});

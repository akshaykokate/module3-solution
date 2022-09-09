(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems',FoundItems)
.constant('ApiBasePath',"https://davids-restaurant.herokuapp.com");

function FoundItems(){
  var ddo = {
    restrict: 'A',
    templateUrl: 'foundItems.html',
    scope: {
      foundItems : '<foundItems',
      onRemove : '&'
    }
  };
  return ddo;
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  service.getMatchedMenuItems = function (searchTerm) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });
    return response;
  };
}

NarrowItDownController.$inject = ['$scope','MenuSearchService'];
function NarrowItDownController($scope,MenuSearchService) {
  var menu = this;
  menu.found = [];
  menu.errorMessage ='';

  menu.getMenuForCategory = function (searchTerm) {
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

    promise.then(function (response) {
      menu.found = [];
      menu.errorMessage ='';
      if(searchTerm != '' && searchTerm != undefined){
        for(var i=0;i<response.data.menu_items.length;i++){
          if(response.data.menu_items[i].description !=''){
            if(response.data.menu_items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >-1 ){
              menu.found.push(response.data.menu_items[i]);
            }
          }
        }
      }
      if(menu.found.length == 0){
        menu.errorMessage ='Nothing Found';
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  menu.removeItem = function (itemIndex) {
    menu.found.splice(itemIndex, 1);
  };
}

})();

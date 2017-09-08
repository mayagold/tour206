console.log('hi');

var app = angular.module('tour-app', []);

app.controller('mainController', ['$http', function($http){
  this.word = "sup";
}])


$(()=>{
  console.log('jquery');
})

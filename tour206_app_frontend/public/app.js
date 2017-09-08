console.log('hi');

var app = angular.module('tour-app', []);

app.controller('mainController', ['$http', function($http){
  const self    = this;

  this.word     = "sup";
  this.myshows  = [];
  this.formdata = {};


  // this is grabbing the form input data but sessions is not yet set up.

  this.login    = function(){
    console.log('logging in...');
    console.log('Formdata: ', this.formdata);
    
  }


}])

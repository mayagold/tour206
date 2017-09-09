console.log('hi');

var app = angular.module('tour-app', []);

app.controller('mainController', ['$http', function($http){
  const self    = this;


  this.word     = "sup";
  this.myshows  = [];
  this.formdata = {};

  $http({
    method: 'GET',
    url: 'http://localhost:3000/events/index'
  }).then(response => {
    console.log(response)
    this.events = response.data.top_match_events
  })
  .catch(err => console.log(err));

  // this is grabbing the form input data but sessions is not yet set up.

  this.login    = function(){
    console.log('logging in...');
    console.log('Formdata: ', this.formdata);

  }

  this.register = function(){
    console.log('registering...');
    console.log('Formdata: ', this.formdata);

  }

}])

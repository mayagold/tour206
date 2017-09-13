// // // // // // // // // // // // // // // // // // //
// FRONT END JS
// // // // // // // // // // // // // // // // // // //

var app = angular.module('tour-app', []);

// // // // // // // // // // // // // // // // // // //
// configuration
// // // // // // // // // // // // // // // // // // //

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

// // // // // // // // // // // // // // // // // // //
// MAIN CONTROLLER
// // // // // // // // // // // // // // // // // // //

app.controller('mainController', ['$http', '$scope', '$filter', function($http, $scope, $filter){

  // $scope variables
  $scope.currentPage    = 0;
  $scope.pageSize       = 10;
  $scope.data           = [];
  $scope.q              = '';
  $scope.currentEvent   = {};
  $scope.currentShow    = {};
  $scope.updatingShow   = {};

  // declare variables
  this.url = 'https://tour206backend.herokuapp.com';

  let self         = this;

  this.loggedIn    = false;
  this.formdata    = '';
  this.user        = {};
  this.myshows     = [];
  this.venues      = [];
  this.users       = [];
  this.loggedIn    = false;
  this.events      = [];

  // Pagination functionality
  $scope.getData = function () {
    return $filter('filter')($scope.data, $scope.q)
  }
  $scope.numberOfPages=function(){
    return Math.ceil($scope.getData().length/$scope.pageSize);
  }
  for (var i=0; i<65; i++) {
    $scope.data.push("Item "+i);
  }
  // GET EVENTS: Calls eventbrite API
  $http({
    method: 'GET',
    url: self.url + '/events/index'
  }).then(response => {
    this.events = response.data.events
    this.topmatch = response.data.top_match_events
  })
  .catch(err => console.log(err));
  // CREATE: POST request: grabs the show that the user wants to save and create a new Shows model
  $scope.favoriteShow = function(event){
    $scope.currentEvent = event;
    // POST REQUEST
    $http({
      method: 'POST',
      url: self.url + '/shows',
      data: {show: {
        name: $scope.currentEvent.name.text,
        start: $scope.currentEvent.start.local,
        description: $scope.currentEvent.description.text,
        user_id: self.user.id
      }},
    }).then(response=>{
      self.myshows.unshift(response.data);
    }).catch(err=>console.log(err))
  }

  // DELETE ROUTE
  $scope.unfavoriteShow = function(myshow){
    $scope.currentShow = myshow;
    let id = $scope.currentShow.id;
    let index = self.myshows.indexOf($scope.currentShow);
    $http({
      method: 'DELETE',
      url: self.url + '/shows/' + id,
    }).then(response=>{
      self.myshows.splice(index, 1);
    }).catch(err=>console.log(err))
  }

  $scope.updateShow = function(myshow){
    $scope.updatingShow = myshow;
  }

  $scope.updateDescription = function(){
    id = $scope.updatingShow.id;
    let index = self.myshows.indexOf($scope.updatingShow);
    $http({
      method: 'PUT',
      url: self.url + '/shows/' + id,
      data: {show: {
        name: $scope.updatingShow.name,
        start: $scope.updatingShow.start,
        description: self.formdata,
        user_id: $scope.updatingShow.user_id,
      }}
    }).then(response=>{
      self.myshows.splice(index, 1);
      self.myshows.unshift(response.data);
    }).catch(err=>console.log(err))
    // replace the old show object in the myshows array with the new one response.data, which has an updated description
  }

  // GET MY SHOWS
  $http({
    method: 'GET',
    url: self.url + '/shows'
  }).then(response => {
  })
  .catch(err => console.log(err));

  // // GET VENUES DATA
  // $http({
  //   method: 'GET',
  //   url: 'http://localhost:3000/venues',
  // }).then(function(response){
  //   console.log(response);
  //   this.venues = response.data;
  // }.bind(this));

  // Log In Function
  this.login = function(userPass){
    $http({
      method: 'POST',
      url: self.url + '/users/login',
      data: { user: { username: userPass.username, email: userPass.email, password: userPass.password }},
    }).then(function(response){
      self.loggedIn = true;
      self.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      self.getShows();
    }.bind(this));
  }

  this.getShows = function(){
        // the method below finds all of the user's favorite shows by making a get request to the shows model and finding all shows with a user_id identical to the current user's id. then it repopulates the myshows array with that data and renders it on the page. so when a user logs in, their saved favorited shows are automatically loaded in the myshows tab.
    $http({
      method: 'GET',
      url: self.url + '/shows',
    }).then(function(result){
      for (var i=0; i<result.data.length; i++){
        if (result.data[i].user_id == self.user.id){
          self.myshows.unshift(result.data[i]);
        }
      }
    })
  }

  // Register function
  this.register = function(userReg){
    $http({
      method: 'POST',
      url: self.url + '/users/',
      data: { user: { username: userReg.username, email: userReg.email, password: userReg.password }},
    }).then(function(result){
      self.login(userReg);
      // user is logged in immediately after sign up!
    })
  }
  // Log Out function: this works and button only displays when a user is logged in
  this.logout = function(){
    localStorage.clear('token');
    location.reload();
    self.loggedIn = false;
    this.myshows = [];
  }
}]) // end main controller


// // // // // // // // // // // // // // // // // // //
// Pagination functionality
// // // // // // // // // // // // // // // // // // //

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

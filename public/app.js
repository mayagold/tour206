console.log('hi');



var app = angular.module('tour-app', []);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.controller('PaginationController', ['$http', function($http){

}])

app.controller('mainController', ['$http', '$scope', '$filter', function($http, $scope, $filter){

  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.data = [];
  $scope.q = '';
  $scope.currentEvent = {};


  const self       = this;
  this.myshows     = [];
  this.venues      = [];
  this.formdata    = {};
  this.users       = [];
  this.user        = {};
  this.url         = 'http://localhost:3000';
  this.loggedIn    = false;
  this.events      = [];


  // Pagination
  $scope.getData = function () {
    return $filter('filter')($scope.data, $scope.q)
  }
  $scope.numberOfPages=function(){
    return Math.ceil($scope.getData().length/$scope.pageSize);
  }
  for (var i=0; i<65; i++) {
    $scope.data.push("Item "+i);
  }

  // GET SHOWS: Calls eventbrite API
  $http({
    method: 'GET',
    url: self.url + '/events/index'
  }).then(response => {
    console.log('this is the response ', response.data.events)
    this.events = response.data.events
    this.topmatch = response.data.top_match_events
    console.log(typeof response.data.events[1].start.local);
  })
  .catch(err => console.log(err));

  // CREATE: POST request: grabs the show that the user wants to save and create a new Shows model
  $scope.favoriteShow = function(event){
    // console.log($scope);
    // console.log(event);
    $scope.currentEvent = event;
    // THIS IS THE DATA ON THE PAGE WE WANT TO GRAB
    // show.name
    // console.log($scope.currentEvent.name.text);
    // // show.start
    // console.log( $scope.currentEvent.start.local);
    // // show.description
    // console.log( $scope.currentEvent.description.text);
    // console.log(typeof self.user.id);
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
      // console.log(response.data);
      self.myshows.unshift(response.data);
      // console.log("array ,", self.myshows);
    }).catch(err=>console.log(err))
  }

  // GET MY SHOWS
  $http({
    method: 'GET',
    url: self.url + '/shows'
  }).then(response => {
    console.log('this is the response ', response)
  })
  .catch(err => console.log(err));

  //
  // // GET VENUES DATA
  // $http({
  //   method: 'GET',
  //   url: 'http://localhost:3000/venues',
  // }).then(function(response){
  //   console.log(response);
  //   this.venues = response.data;
  // }.bind(this));
  //



  // Attach this function to user-authorized content
  // this.getUsers = function(){
  //   $http({
  //     url: this.url + '/users',
  //     method: 'GET',
  //     headers: {
  //       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
  //     }
  //   }).then(function(response){
  //     if (response.data.status==401){
  //       this.error = "UNAUTHORIZED";
  //     } else {
  //       this.users = response.data;
  //     }
  //   }.bind(this));
  // }
  // this.getUsers();

  // Log In Function
  this.login = function(userPass){
    console.log('User Entered Info: ', userPass);
    $http({
      method: 'POST',
      url: self.url + '/users/login',
      data: { user: { username: userPass.username, email: userPass.email, password: userPass.password }},
    }).then(function(response){
      console.log(response.data);
      self.loggedIn = true;
      self.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
    }.bind(this));

    // Still need to implement another ajax request using user id here, after login successful, through which user’s data [favorited shows, saved into backend server] is populated and the My Plans tab data is populated with user's favorited shows

  }

  // Register function:: works
  this.register = function(userReg){
    $http({
      method: 'POST',
      url: self.url + '/users/',
      data: { user: { username: userReg.username, email: userReg.email, password: userReg.password }},
    }).then(function(result){
      console.log('Data from server: ', result);
      self.login(userReg);
      // user should be logged in immediately after sign up!
    })
  }

  // Log Out function: this works and button only displays when a user is logged in
  this.logout = function(){
    localStorage.clear('token');
    location.reload();
    self.loggedIn = false;
    console.log(self.currentUser);
    this.myshows = [];
  }

  this.favoriteShow = function(){

    this.myshows.unshift(response.data)
  }

  this.saveShowsData = function(){
    console.log('saved to my shows');
    $http({
      method: 'POST',
      url: self.url + '/users/:id',
      data: this.myshows
    }).then(function(response){
      console.log(response);
      self.user.myshows.unshift(response.data)
    }).catch(err=>console.log(err));
  }

}]) // end main controller


// Pagination
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

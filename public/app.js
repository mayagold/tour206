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
  this.url         = 'http://localhost:3000';
  const self       = this;
  this.loggedIn    = false;
  this.formdata    = '';
  this.user        = {};
  this.myshows     = [];
  this.venues      = [];
  this.users       = [];
  this.user        = {};
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
    console.log('this is the response ', response.data.events)
    this.events = response.data.events
    this.topmatch = response.data.top_match_events
    console.log(typeof response.data.events[1].start.local);
  })
  .catch(err => console.log(err));
  // CREATE: POST request: grabs the show that the user wants to save and create a new Shows model
  $scope.favoriteShow = function(event){
    console.log($scope);
    console.log(event);
    $scope.currentEvent = event;
    // THIS IS THE DATA ON THE PAGE WE WANT TO GRAB
    // show.name
    console.log($scope.currentEvent.name.text);
    // show.start
    console.log( $scope.currentEvent.start.local);
    // show.description
    console.log( $scope.currentEvent.description.text);
    console.log(typeof self.user.id);
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
      console.log(response.data);
      self.myshows.unshift(response.data);
      // console.log("array ,", self.myshows);
    }).catch(err=>console.log(err))
  }

  // DELETE ROUTE
  $scope.unfavoriteShow = function(myshow){
    $scope.currentShow = myshow;
    // console.log($scope.currentShow);
    let id = $scope.currentShow.id;
    let index = self.myshows.indexOf($scope.currentShow);
    // console.log(id);
    $http({
      method: 'DELETE',
      url: self.url + '/shows/' + id,
    }).then(response=>{
      // console.log(response);
      // console.log('delete route');
      self.myshows.splice(index, 1);
    }).catch(err=>console.log(err))
  }

  $scope.updateShow = function(myshow){
    $scope.updatingShow = myshow;
    console.log($scope.updatingShow);
  }

  $scope.updateDescription = function(){
    console.log($scope.updatingShow);
    id = $scope.updatingShow.id;
    let index = self.myshows.indexOf($scope.updatingShow);
    console.log($scope);
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
      console.log(response);
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
    // console.log('this is the response ', response)
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
    // console.log('User Entered Info: ', userPass);
    $http({
      method: 'POST',
      url: self.url + '/users/login',
      data: { user: { username: userPass.username, email: userPass.email, password: userPass.password }},
    }).then(function(response){

      console.log(response.data);
      self.loggedIn = true;
      self.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      console.log(localStorage.token, " This is the token or at least it should be");
    }.bind(this));
    // the method below finds all of the user's favorite shows by making a get request to the shows model and finding all shows with a user_id identical to the current user's id. then it repopulates the myshows array with that data and renders it on the page. so when a user logs in, their saved favorited shows are automatically loaded in the myshows tab.
    $http({
      method: 'GET',
      url: self.url + '/shows',
    }).then(function(result){
      // console.log(result.data, " ... trying to call shows");
      // console.log(result.data.length);
      // console.log(result.data[0].user_id);
      // console.log(self.user.id);
      for (let i=1; i<=result.data.length; i++){
        // console.log("testing result data item #", i);
        // console.log("user id of result data is ", result.data[i].user_id);
        // console.log("user id of user is ", self.user.id);
        if (result.data[i].user_id === self.user.id){
          // console.log("SAME");
          self.myshows.unshift(result.data[i]);
        }
      }
      // console.log(self.myshows);
    })
  }
  // Register function
  this.register = function(userReg){
    $http({
      method: 'POST',
      url: self.url + '/users/',
      data: { user: { username: userReg.username, email: userReg.email, password: userReg.password }},
    }).then(function(result){
      console.log('Data from server: ', result);
      // self.user = result.data;
      self.login(userReg);
      // user is logged in immediately after sign up!
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

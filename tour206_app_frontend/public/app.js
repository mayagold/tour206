console.log('hi');

var app = angular.module('tour-app', []);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.controller('mainController', ['$http', function($http){
  const self    = this;
  this.shows       = [];
  this.venues      = [];
  this.formdata    = {};
  this.users       = [];
  this.user        = {};
  this.url         = 'http://localhost:3000';
  this.loggedIn    = false;
  // // GET SHOWS DATA
  // $http({
  //   method: 'GET',
  //   url: 'http://localhost:3000/shows',
  // }).then(function(response){
  //   console.log(response);
  //   this.shows = response.data;
  // }.bind(this));
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
  // // GET USERS DATA
  // $http({
  //   method: 'GET',
  //   url: 'http://localhost:3000/users',
  // }).then(function(response){
  //   console.log(response);
  //   this.users = response.data;
  // }.bind(this));

    // Attach this function to user-authorized content
  this.getUsers = function(){
    $http({
      url: this.url + '/users',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response){
      if (response.data.status==401){
        this.error = "UNAUTHORIZED";
      } else {
        this.users = response.data;
      }
    }.bind(this));
  }

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


  // Register function:: This does not work: function responds "status code 422 Unprocessable Entity"

  this.register = function(userReg){

    $http({
      method: 'POST',
      url: self.url + '/users/',
      data: { user: { username: userReg.username, email: userReg.email, password_digest: userReg.password }},
    }).then(function(result){
      console.log('Data from server: ', result)

      // user should be logged in immediately after sign up (doesn’t have to log in after signing up)
    })


  }


  // Log Out function: this works and button only displays when a user is logged in

  this.logout = function(){
    localStorage.clear('token');
    location.reload();
    self.loggedIn = false;
    console.log(self.currentUser);
  }

}]) // end main controller

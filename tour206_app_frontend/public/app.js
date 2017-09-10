console.log('hi');

var app = angular.module('tour-app', []);

app.controller('mainController', ['$http', function($http){
  const self    = this;

  this.shows       = [];
  this.venues      = [];
  this.myshows     = [];
  this.formdata    = {};
  this.users       = [];
  this.user        = {};
  this.url         = 'http://localhost:3000';

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
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, email: userPass.email, password: userPass.password }},
    }).then(function(response){
      console.log(response.data);
      this.user =response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
    }.bind(this));
  }


  // Register function

  this.register = function(userPass){
    console.log('registering...');
    console.log('Formdata: ', userPass)
    $http({
      method: 'POST',
      url: this.url + '/users',
      data: { user: { username: userPass.username, email: userPass.email, password: userPass.password }},
    }).then(function(result){
      console.log('Data from server: ', result)
    })
  }


  this.logout = function(){
    localStorage.clear('token');
    location.reload();
    console.log(self.currentUser);
  }



}])

console.log('hi');

var app = angular.module('tour-app', []);

app.controller('mainController', ['$http', function($http){
  const self    = this;

  this.word        = "sup";
  this.shows       = [];
  this.venues      = [];
  this.myshows     = [];
  this.formdata    = {};
  this.users       = [];
  this.currentUser = {};
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

  // this is grabbing the form input data but sessions is not yet set up.

  this.login    = function(formdata){
    console.log('logging in...');
    console.log('Formdata: ', this.formdata);
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: self.formdata.username, email: self.formdata.email, password: self.formdata.password }},
    }).then(function(response){
      console.log(response);
      localStorage.setItem('token', JSON.stringify(response.data.token));
      self.currentUser.username = self.formdata.username;
      self.currentUser.email = self.formdata.email;
      self.currentUser.password = self.formdata.password;
    }.bind(this));
  }

  this.logout = function(){
    localStorage.clear('token');
    location.reload();
    console.log(self.currentUser);
  }

  // this.register = function(){
  //   console.log('registering...');
  //   console.log('Formdata: ', this.formdata);
  //   $http({
  //     method: 'POST',
  //     url: 'http://localhost:3000/users',
  //     data: this.formdata
  //   }).then(function(result){
  //     self.currentUser = self.formdata;
  //     self.formdata = {};
  //     console.log('Data from server: '), result})
  // }

}])

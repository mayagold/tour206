# Tour(206)
A Ruby on Rails / Angular App

Two-model application built with Ruby on Rails for the backend API and a frontend framework built with AngularJs. Tour(206) is an easy way to find concerts happening in Seattle. Discover all the information you need to experience the best live music and venues in the city.



User Stories

1. User can view concerts happening in Seattle by date (calendar).
2. User can view concerts happening in Seattle by venue.
3. User can add/delete concerts to/from a list of favorites (attending).
4. User can access data about the concert including time, link to tickets, etc.
5. Concert data will be accessed through Ticketfly (Eventbrite, LiveNation, etc) API.
6. Single page app with two tabs (calendar view and list view, both organized by date).

(Admin User Stories: Stretch goals)

1. Admin can view concerts happening in Seattle.
2. Admin can create, update, and delete data for both venues and concerts.
3. Admin is required to sign in with password authentication in order to access the admin app.

---

Bugs:

0. Pagination lets you scroll thru negative pages... wtf...
0. User post not working in heroku (might fix itself when we push to heroku master again)
0. expand/collapse doesn't have a toggle yet

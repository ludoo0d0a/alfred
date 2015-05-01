/*global Backbone, _ */

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){
  
// Backbone.Collection.prototype.save = function (options) {
//     Backbone.sync("create", this, options);
// };
  // Movie Model
  // ----------

  // Our basic **Movie** model has `title`, `order`, and `done` attributes.
  var Movie = Backbone.Model.extend({

    // Default attributes for the movie item.
    defaults: function() {
      return {
        title: "empty movie...",
        id:0,
        banner: '',
        Overview: '',
        series: '',
        year: '',
        lead:''
        //order: Movies.nextOrder(),
        //done: false
      };
    }

    // // Ensure that each movie created has `title`.
    // initialize: function() {
    //   if (!this.get("title")) {
    //     this.set({"title": this.defaults().title});
    //   }
    // },

    // // Toggle the `done` state of this movie item.
    // toggle: function() {
    //   this.save({done: !this.get("done")});
    // }

  });

  // Movie Collection
  // ---------------
  var MovieList = Backbone.Collection.extend({
    model: Movie,
    url: '/scanner'
    
    // // Filter down the list of all movie items that are finished.
    // done: function() {
    //   return this.filter(function(movie){ return movie.get('done'); });
    // },

    // // Filter down the list to only movie items that are still not finished.
    // remaining: function() {
    //   return this.without.apply(this, this.done());
    // },

    // // We keep the Movies in sequential order, despite being saved by unordered
    // // GUID in the database. This generates the next order number for new items.
    // nextOrder: function() {
    //   if (!this.length) return 1;
    //   return this.last().get('order') + 1;
    // },

    // // Movies are sorted by their original insertion order.
    // comparator: function(movie) {
    //   return movie.get('order');
    // }

  });
  // Create our global collection of **Movies**.
  var Movies = new MovieList;
  
  // var MovieList = Backbone.Collection.extend({ model: Movie, url: '/movies'});
  // var Movies = new MovieList;
  // //var Movies = new MovieList({url: '/movies'});
  
  var TvshowList = Backbone.Collection.extend({ model: Movie, url: '/tvshows'});
  var Tvshows = new TvshowList;
  //var Tvshows = new MovieList({url: '/tvshows'});

  // Movie Item View
  // --------------

  // The DOM element for a movie item...
  var MovieView = Backbone.View.extend({

    //... is a list tag.
    //tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      // "click .toggle"   : "toggleDone",
      // "dblclick .view"  : "edit",
      // "click a.destroy" : "clear",
      // "keypress .edit"  : "updateOnEnter",
      // "blur .edit"      : "close"
    },

    // The MovieView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Movie** and a **MovieView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the titles of the movie item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      // this.$el.toggleClass('done', this.model.get('done'));
      // this.input = this.$('.edit');
      return this;
    },

    // // Toggle the `"done"` state of the model.
    // toggleDone: function() {
    //   this.model.toggle();
    // },

    // // Switch this view into `"editing"` mode, displaying the input field.
    // edit: function() {
    //   this.$el.addClass("editing");
    //   this.input.focus();
    // },

    // // Close the `"editing"` mode, saving changes to the movie.
    // close: function() {
    //   var value = this.input.val();
    //   if (!value) {
    //     this.clear();
    //   } else {
    //     this.model.save({title: value});
    //     this.$el.removeClass("editing");
    //   }
    // },

    // // If you hit `enter`, we're through editing the item.
    // updateOnEnter: function(e) {
    //   if (e.keyCode == 13) this.close();
    // }

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });
  
  var MovieViewDetail = Backbone.View.extend({
    template:_.template($('#detail-template').html()),
 
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
 
});
      
  // The Rooter
  // ---------------
  var AppRouter = Backbone.Router.extend({
    routes: {
        "": "home",
        "tvshows": "tvshows",
        "movies": "movies",
        "movies": "movies",
        "tvshows/:id": "tvshow",
        "movies/:id": "movie",
        "movies/:id": "movie"
    },
    tvshows: function(){
        Tvshows.fetch();
    },
    movies: function(){
        console.log('Router ** movies');
        Movies.fetch();
    },
    home: function() {
        console.log('Router ** home');
        Movies.fetch();
    },
    movies: function() {
        console.log('Router ** movies');
        Movies.fetch();
    },
    tvshow: function(id){
        console.log('Router ** tvshow');
        var model = Tvshows.get(id);
        this.showContent(model, 'TVShows');
    },
    movie: function(id){
        console.log('Router ** movie');
        var model = Movies.get(id);
        this.showContent(model, 'Movies');
    },
    showContent: function(model, title){
        $('.page-header h1').html(title);
        if (model){
          //model = new Movie();
          var view = new MovieViewDetail({model:model});
          $('#item-details').html(view.render().el);
        }
    }
  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    //el: $(".movieapp"),
    el: $('body'),

    // Our template for the line of statistics at the bottom of the app.
    //statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'click .navbar-nav a.tvshows': 'displayTvshows',
      'click .navbar-nav a.movies': 'displayMovies',
      'click .navbar-nav a.movies': 'displayMovies',
      'click #logbutton': 'log',
      'click #scanbutton': 'scan',
      'click #movebutton': 'move'
      // "keypress #new-movie":  "createOnEnter",
      // "click #clear-completed": "clearCompleted",
      // "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Movies`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting movies that might be saved in *localStorage*.
    initialize: function() {
      
      this.router = new AppRouter();
              
      //this.input = this.$("#new-movie");
      this.$elList = this.$(".movie-list");
      this.$elDetail = $('#item-details');
      //this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Movies, 'add', this.addOne);
      this.listenTo(Movies, 'reset', this.addAll);
      this.listenTo(Movies, 'all', this.render);
      this.listenTo(Movies, 'sync', this.onSync);
      this.listenTo(Movies, 'fetch', this.onFetch);

      // // Display a loading indication whenever the Collection is fetching.
      // Movies.on("fetch", function() {
      //   this.$elList.html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
      // }, this);
      // // Automatically re-render whenever the Collection is populated.
      // Movies.on("reset", this.render, this);
      

      // this.footer = this.$('footer');
      // this.main = $('#main');

      //Movies.fetch();
      
      //call to begin monitoring uri and route changes
      Backbone.history.stop(); 
      Backbone.history.start(/*{pushState: true}*/);
      
      //this.displayMovies();
    },

    displayTvshows: function() {
      this.router.navigate("tvshows", true);
    },
    displayMovies: function() {
      this.router.navigate("movies", true);
    },
    displayMovies: function() {
      this.router.navigate("movies", true);
    },
      
    // // Re-rendering the App just means refreshing the statistics -- the rest
    // // of the app doesn't change.
     render: function() {
    //   // var done = Movies.done().length;
    //   // var remaining = Movies.remaining().length;

    //   //this.allCheckbox.checked = !remaining;
      console.log('render');
    },

    // Add a single movie item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(movie) {
      console.log('addOne');
      var view = new MovieView({model: movie});
      this.$elList.append(view.render().el);
    },

    // Add all items in the **Movies** collection at once.
    addAll: function() {
      console.log('addAll');
      this.$elList.empty();
      
      if (Movies.length===0) {
        this.$elList.html('<p class="empty bg-warning">No item</p>');
      }
      
      Movies.each(this.addOne, this);
    },
    
    log: function() {
      console.log('log');
      this.clear();
      Movies.fetch({reset: true, data: { op:'log' }});
    },
    scan: function() {
      console.log('scan');
      this.clear();
      Movies.fetch({reset: true, data: { op:'scan' }});
    },
    move: function() {
      console.log('move');
      //Send a POST to force scan
      this.clear();
      //Backbone.sync('create', Movies, {attrs: {scan:1} });
      //Movies.fetch({reset: true, data: { op:'move' }});
      Movies.fetch({ data: { op:'move' }});
    },
    clear: function(){
      this.$elList.empty();
      this.$elDetail.empty();
    },

    onSync: function() {
      console.log('onSync');
    },
    
    onFetch: function() {
      console.log('onFetch');
      this.$elList.empty();
      this.$elList.html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
    },
   
    
    // // If you hit return in the main input field, create new **Movie** model,
    // // persisting it to *localStorage*.
    // createOnEnter: function(e) {
    //   if (e.keyCode != 13) return;
    //   if (!this.input.val()) return;

    //   Movies.create({title: this.input.val()});
    //   this.input.val('');
    // },

    // // Clear all done movie items, destroying their models.
    // clearCompleted: function() {
    //   _.invoke(Movies.done(), 'destroy');
    //   return false;
    // },

    // toggleAllComplete: function () {
    //   var done = false; //this.allCheckbox.checked;
    //   Movies.each(function (movie) { movie.save({'done': done}); });
    // }

  });
  

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});

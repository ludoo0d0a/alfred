/*global Backbone, _ */

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Book Model
  // ----------

  // Our basic **Book** model has `title`, `order`, and `done` attributes.
  var Book = Backbone.Model.extend({

    // Default attributes for the book item.
    defaults: function() {
      return {
        title: "empty book...",
        order: Books.nextOrder(),
        done: false
      };
    },

    // Ensure that each book created has `title`.
    initialize: function() {
      if (!this.get("title")) {
        this.set({"title": this.defaults().title});
      }
    },

    // Toggle the `done` state of this book item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

  // Book Collection
  // ---------------

  // The collection of books is backed by *localStorage* instead of a remote
  // server.
  var BookList = Backbone.Collection.extend({
    model: Book,
    url: '/books/all',

    // Save all of the book items under the `"books-backbone"` namespace.
    //localStorage: new Backbone.LocalStorage("books-backbone"),

    // Filter down the list of all book items that are finished.
    done: function() {
      return this.filter(function(book){ return book.get('done'); });
    },

    // Filter down the list to only book items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Books in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Books are sorted by their original insertion order.
    comparator: function(book) {
      return book.get('order');
    }

  });
  // Create our global collection of **Books**.
  var Books = new BookList;
  
  var MovieList = Backbone.Collection.extend({ model: Book, url: '/movies'});
  var Movies = new MovieList;
  //var Movies = new BookList({url: '/movies'});
  
  var TvshowList = Backbone.Collection.extend({ model: Book, url: '/tvshows'});
  var Tvshows = new TvshowList;
  //var Tvshows = new BookList({url: '/tvshows'});

  // Book Item View
  // --------------

  // The DOM element for a book item...
  var BookView = Backbone.View.extend({

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

    // The BookView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Book** and a **BookView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the titles of the book item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      // this.$el.toggleClass('done', this.model.get('done'));
      // this.input = this.$('.edit');
      return this;
    }

    // // Toggle the `"done"` state of the model.
    // toggleDone: function() {
    //   this.model.toggle();
    // },

    // // Switch this view into `"editing"` mode, displaying the input field.
    // edit: function() {
    //   this.$el.addClass("editing");
    //   this.input.focus();
    // },

    // // Close the `"editing"` mode, saving changes to the book.
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
    // },

    // // Remove the item, destroy the model.
    // clear: function() {
    //   this.model.destroy();
    // }

  });
  
  var BookViewDetail = Backbone.View.extend({
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
        "books": "books",
        "tvshows/:id": "tvshow",
        "movies/:id": "movie",
        "books/:id": "book"
    },
    tvshows: function(){
        Tvshows.fetch();
    },
    movies: function(){
        Movies.fetch();
    },
    home: function() {
        Books.fetch();
    },
    books: function() {
        Books.fetch();
    },
    tvshow: function(id){
        var model = Tvshows.get(id);
        this.showContent(model, 'TVShows');
    },
    movie: function(id){
        var model = Movies.get(id);
        this.showContent(model, 'Movies');
    },
    book: function(id){
        var model = Books.get(id);
        this.showContent(model, 'Books');
    },
    showContent: function(model, title){
        $('.page-header h1').html(title);
        var view = new BookViewDetail({model:model});
        $('#item-details').html(view.render().el);
    }
  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    //el: $(".bookapp"),
    el: $('body'),

    // Our template for the line of statistics at the bottom of the app.
    //statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'click .navbar-nav a.tvshows': 'displayTvshows',
      'click .navbar-nav a.books': 'displayBooks',
      'click .navbar-nav a.movies': 'displayMovies'
      
      // "keypress #new-book":  "createOnEnter",
      // "click #clear-completed": "clearCompleted",
      // "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Books`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting books that might be saved in *localStorage*.
    initialize: function() {
      
      this.router = new AppRouter();
              
      //this.input = this.$("#new-book");
      //this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Books, 'add', this.addOne);
      this.listenTo(Books, 'reset', this.addAll);
      this.listenTo(Books, 'all', this.render);

      // this.footer = this.$('footer');
      // this.main = $('#main');

      //Books.fetch();
      
      //call to begin monitoring uri and route changes
      Backbone.history.stop(); 
      Backbone.history.start(/*{pushState: true}*/);
      
      //this.displayBooks();
    },

    displayTvshows: function() {
      this.router.navigate("tvshows", true);
    },
    displayMovies: function() {
      this.router.navigate("movies", true);
    },
    displayBooks: function() {
      this.router.navigate("books", true);
    },
      
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      // var done = Books.done().length;
      // var remaining = Books.remaining().length;

      // if (Books.length) {
      //   this.main.show();
      //   this.footer.show();
      //   //this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      // } else {
      //   this.main.hide();
      //   this.footer.hide();
      // }

      //this.allCheckbox.checked = !remaining;
    },

    // Add a single book item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(book) {
      var view = new BookView({model: book});
      this.$(".book-list").append(view.render().el);
    },

    // Add all items in the **Books** collection at once.
    addAll: function() {
      Books.each(this.addOne, this);
    }

    // // If you hit return in the main input field, create new **Book** model,
    // // persisting it to *localStorage*.
    // createOnEnter: function(e) {
    //   if (e.keyCode != 13) return;
    //   if (!this.input.val()) return;

    //   Books.create({title: this.input.val()});
    //   this.input.val('');
    // },

    // // Clear all done book items, destroying their models.
    // clearCompleted: function() {
    //   _.invoke(Books.done(), 'destroy');
    //   return false;
    // },

    // toggleAllComplete: function () {
    //   var done = false; //this.allCheckbox.checked;
    //   Books.each(function (book) { book.save({'done': done}); });
    // }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});

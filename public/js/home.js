/*global Backbone, _ */

$(function(){
  
  var app = {};
  
  var Movie = Backbone.Model.extend({
    defaults: function() {
      return {
        title: '',
        id:0,
        banner: '',
        Overview: '',
        series: '',
        year: '',
        lead:''
      };
    }
  });
  
  var Settings = Backbone.Model.extend({
    url :'settings',
    defaults: function() {
      return {
        path: {
            download: '',
            tvshow:   '',
            movie :   ''
        },
        delay: '12h',
        minsize: -1
      };
    }
  });

  // Movie Collection
  // ---------------
  var MovieList = Backbone.Collection.extend({
    model: Movie,
    url: '/scanner'
  });
  
  var Movies = new MovieList;

  var MovieView = Backbone.View.extend({
    template: _.template($('#item-template').html()),
    
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    clear: function() {
      this.model.destroy();
    }

  });
  
  var MovieViewDetail = Backbone.View.extend({
    template: _.template($('#detail-template').html()),
 
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
  });
  
  var SettingsView = Backbone.View.extend({
    el: $('#ctn'),
    template: _.template($('#settings-template').html()),
    
    events: {
       'submit form': 'save'
       //'click #savebutton': 'save'
    },
      
    initialize: function() {
      this.model = new Settings();
      //this.listenTo(this.model, 'change', this.render);
      
      _.bindAll(this, 'render'); // make sure 'this' refers to this View in the success callback below
      this.model.fetch({ 
        success: this.render
      });
    },
 
    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    
    save: function(e){
      e.preventDefault();
        
      this.model.save({ 
        path: {
          tvshow: $('#tvshowpath', this.$el).val(),
          movie: $('#moviepath', this.$el).val(),
        }, 
        delay: $('#delay', this.$el).val()
      });
    }
  });

  var MoviesView = Backbone.View.extend({
    el: $('#ctn'),
    template: _.template($('#movies-template').html()),
    events: {
      'click #logbutton': 'log',
      'click #scanbutton': 'scan',
      'click #movebutton': 'move'
    },
    initialize: function(options){
      this.options = options || {};
      
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'reset', this.addAll);
      //this.listenTo(this.collection, 'all', this.render);
      this.listenTo(this.collection, 'change', this.render);
      this.listenTo(this.collection, 'sync', this.onSync);
      this.listenTo(this.collection, 'fetch', this.onFetch);
      this.listenTo(this.collection, 'destroy', this.remove);
      
      // this.collection.fetch();
      this.render();
    },

    render:function () {
        $(this.el).html(this.template({}));
        
        this.$elList = $('.movies__library', this.$el);
        this.$elDetail = $('.movies__viewer', this.$el);
      
        this.showMasterDetail(this.options.masterdetail);
        return this;
    },
    
    log: function() {
      console.log('log');
      this.clear();
      this.collection.fetch({reset: true, data: { op:'log' }});
    },
    scan: function() {
      console.log('scan');
      this.clear();
      this.collection.fetch({reset: true, data: { op:'scan' }});
    },
    move: function() {
      console.log('move');
      //Send a POST to force scan
      this.clear();
      //Backbone.sync('create', Movies, {attrs: {scan:1} });
      //Movies.fetch({reset: true, data: { op:'move' }});
      this.collection.fetch({ data: { op:'move' }});
    },
    addOne: function(movie) {
      console.log('addOne');
      var view = new MovieView({model: movie});
      this.$elList.append(view.render().el);
    },
    addAll: function() {
      console.log('addAll');
      this.$elList.empty();
      
      if (this.collection.length===0) {
        this.$elList.html('<p class="empty bg-warning">No item</p>');
      }
      this.collection.each(this.addOne, this);
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
    
    //renderSingleItem
    show: function(id){
        var model = this.collection.get(id);
        if (model){
          var view = new MovieViewDetail({model:model});
          $('#item-details', this.$el).html(view.render().el);
          this.showMasterDetail(true);
        }
    },

    //Toggle master/detail responsive
    showMasterDetail: function(xs){
      
      if (xs){
        //show detail in xs OVER
        $('.movies__viewer', this.$el).addClass('hidden-xs');
        $('.movies__library', this.$el).removeClass('hidden-xs');
      }else{
        //show master/detail
        $('.movies__viewer', this.$el).removeClass('hidden-xs');
        $('.movies__library', this.$el).addClass('hidden-xs');
      }
    },
 
  });

  var AppView = Backbone.View.extend({
    el: $('body'),
    initialize: function() {
      app.router = new AppRouter();
      Backbone.history.stop(); 
      Backbone.history.start(/*{pushState: true}*/);
    }
  });
  
  var AppRouter = Backbone.Router.extend({
    routes: {
        "": "movies",
        // "tvshows": "tvshows",
        "movies": "movies",
        "settings": "settings",
        //"tvshows/:id": "tvshow",
        "movie/:id": "movie"
    },
    movies: function(){
        console.log('Router ** movies');
        app.moviesview = new MoviesView({collection: Movies});
    },
    movie: function(id){
        console.log('Router ** movie');
        if (!app.moviesview){
          app.moviesview = new MoviesView({collection: Movies});
        }
        app.moviesview.show(id);
    },
    settings: function(id){
        console.log('Router ** settings');
        // var model = null;
        var view = new SettingsView();
        // $('#ctn').html(view.render().el);
    },
  });
  
  app = new AppView();

});

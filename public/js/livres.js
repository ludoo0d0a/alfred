//http://www.eccesignum.org/blog/simple-marionettejs-model-collection-and-collectionview-example

/* create a new instance of the Marionette app */
var app = new Backbone.Marionette.Application();
 
/* add the initial region which will contain the app */
app.addRegions({
    /* reference to container element in the HTML file */
    appRegion: '#AppBase'
});
 
/* define a module to keep the code modular */
app.module('App',function(module, App, Backbone, Marionette, $, _){
     
    /* definition for book model, with default example of data structure */
    module.BookModel = Backbone.Model.extend({
        defaults: {
            title: '',
            authorFirst: '',
            authorLast: ''
        }
    });
 
    /* definition for book collection */
    module.BookCollection = Backbone.Collection.extend({
         
        /* set model type used for this collection */
        model: module.BookModel,
 
        /* comparator determines how collection is sorted */
        comparator: 'authorLast'
    });
 
    /* definition for individual item view */
    module.BookItemView = Marionette.ItemView.extend({
        tagName: 'li',
 
        /* set the template used to display this view */
        template: '#itemView-template',
 
        /* used to show the order in which these method are called */
        initialize: function(){ console.log('BookItemView: initialize >>> ' + this.model.get('title')) },
        onRender: function(){ console.log('BookItemView: onRender >>> ' + this.model.get('title')) },
        onShow: function(){ console.log('BookItemView: onShow >>> ' + this.model.get('title')) }
    });
 
    /* definition for collection view */
    module.BookCollectionView = Marionette.CollectionView.extend({
        tagName: 'ul',
 
        /* explicitly set the childview (formerly 'itemView') used to display the models in this collection */
        childView: module.BookItemView,
 
        initialize: function(){ console.log('BookCollectionView: initialize') },
        onRender: function(){ console.log('BookCollectionView: onRender') },
        onShow: function(){ console.log('BookCollectionView: onShow') }
    });
 
    /* define a view; in this case a 'LayoutView' (formerly 'Layout') */
    module.AppLayoutView = Marionette.LayoutView.extend({
         
        /* the auto-generated element which contains this view */
        tagName: 'div',
 
        /* id attribute for the auto-generated container element */
        id: 'AppContainer',
 
        /* reference to the template which will be rendered for this view */
        template: '#layout-template',
 
        /* define the regions within this layout, into which we will load additional views */
        regions: {
            'RegionOne' : '#regionOne'
        },
 
        /* called when the view initializes, before it displays */
        initialize: function() {
            console.log('main layout: initialize');
        },
 
        /* called when view renders in the DOM. This is a good place to 
            add nested views, because the views need existing DOM elements
            into which to be rendered. */
        onRender: function() {
            console.log('main layout: onRender');
             
            /* create an array of books using anonymouse objects;
                the objects have the same structure as in the 'defaults'
                attribute of the module.BookModel definition */
            var bookArray = [];
            bookArray.push({title: 'Wolf',authorLast: 'Harrison', authorFirst: 'Jim'});
            bookArray.push({title: 'The Theory and Practice of Rivers', authorLast: 'Snyder', authorFirst: 'Gary'});
            bookArray.push({title: 'Weather Central',authorLast: 'Kooser', authorFirst: 'Ted'});
            bookArray.push({title: 'Losing Season',authorLast: 'Ridl', authorFirst: 'Jack'});
            bookArray.push({title: 'Mornings Like This',authorLast: 'Dillard', authorFirst: 'Annie'});
 
            /* create a collection using the array of anonymous objects */
            var bookCollection = new module.BookCollection(bookArray);
 
            /* create new instance of the collection view using the bookCollection */
            var bookCollectionView = new module.BookCollectionView({collection: bookCollection});
 
            /* display the collection view in region 1 */
            this.RegionOne.show(bookCollectionView);
        },
 
        /* called when the view displays in the UI */
        onShow: function() {
            console.log('main layout: onShow');
        }
    });
 
    /* Tell the module what to do when it is done loading */
    module.addInitializer(function(){
        /* create a new instance of the layout from the module */
        var layout = new module.AppLayoutView();
 
        /* display the layout in the region defined at the top of this file */
        app.appRegion.show(layout);
    });
});
 
/* once the DOM initializes, start the app */
$(document).ready(function() {app.start();});
{% extends 'layout.swig' %}

{% block content %}
  <h1>{{ title }}</h1>
  <p> <a href="http://www.eccesignum.org/blog/simple-marionettejs-model-collection-and-collectionview-example">Livres with Marionette</a></p>
{% endblock %}

{% block main %}
        <!-- Base element for app -->
        <!--
            Dont use the BODY element as the base because when the app renders in the BODY
            it will wipe out the template files before the views can pick them up 
        -->
        <div id="AppBase"></div>
 
        <!-- TEMPLATES -->
        <!-- main layout template -->
        <script type="text/template" id="layout-template">
            <h1>Main Template</h1>
            <div id="regionOne"></div>
        </script>
 
        <!-- bookItemView template -->
        <!-- This used the Underscore templating system, which is built into Marionette.js -->
        <script type="text/template" id="itemView-template">
            <span><b>Title</b>: <%- title %></span><br/>
            <span><b>Author</b>: <%- authorLast %>, <%- authorFirst %></span>
        </script>
 
 
{% endblock %}

{% block headerjs %}
    <script src="/components/backbone.localstorage/backbone.localStorage-min.js"></script>
    <script src="/components/backbone.marionette/lib/backbone.marionette.min.js"></script>
    <script src="/js/livres.js"></script>
{% endblock %}
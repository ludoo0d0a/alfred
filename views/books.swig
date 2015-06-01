{% extends 'layout.swig' %}

{% block content %}
  <h1>{{ title }}</h1>
{% endblock %}

{% block main %}
<div class="container">
  
  <div class="page-header">
    <h1>Books</h1>
  </div>
  
  <div class="row bookapp">
    <div id="item-details" class="books__viewer col-md-9 col-md-push-3"></div>
    <div class="books__library col-md-3 col-md-pull-9">
      <div class="list-group book-list"></div>
    </div>
  </div>
</div>

 <script type="text/template" id="detail-template">
      <div>
        <div class="books__title">
          <h1><%- title %> <small>(<%- year %>)</small></h1>
          <p class="lead"><%- author %></p>
        </div>
  
        <div class="books__image">
          <img class="img-thumbnail" src="<%- img %>" alt="<%- title %> (<%- year %>) by <%- author %>">
        </div>
        
        <div class="books__content">
          <p><%- description %></p>
        </div>
  
        <hr class="hidden-md hidden-lg">
      </div>
  </script>
  
  <script type="text/template" id="item-template">
    <a class="list-group-item __active" href="#books/<%- id %>">
      <h4 class="list-group-item-heading"><%- title %><small>(<%- year %>)</small></h4>
      <p class="list-group-item-text"><%- author %></p>
    </a>
  </script>

{% endblock %}

{% block headerjs %}
<script src="/js/books.js"></script>
{% endblock %}
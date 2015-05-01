{% extends 'layout.swig' %}

{% block content %}
  <div class="page-header">
    <h1>{{ title }}</h1>
  </div>
  
  <button id="logbutton" name="logbutton" class="btn btn-primary">Log</button>
  <button id="scanbutton" name="scanbutton" class="btn btn-info">Scan</button>
  <button id="movebutton" name="movebutton" class="btn btn-danger">Move</button>

{% endblock %}

{% block main %}
<div class="_container">
  <div class="row movieapp">
    <div id="item-details" class="movies__viewer col-md-9 col-md-push-3"></div>
    <div class="movies__library col-md-3 col-md-pull-9">
      <div class="list-group movie-list"></div>
    </div>
  </div>
</div>

 <script type="text/template" id="detail-template">
      <div>
        <div class="movies__title">
          <h1><%- series %> <%- title %> <% if (year) { %><small>(<%- year %>)</small><% } %></h1>
          <p class="lead"><%- filename %></p>
        </div>
  
        <div class="movies__image">
          <% if (banner) { %>
          <img class="img-thumbnail" src="<%- banner %>" alt="<%- series %> <%- title %> <% if (year) { %>(<%- year %>)<% } %>">
          <% } %>
        </div>
        
        <div class="movies__content">
          <p><%- Overview %></p>
        </div>
  
        <hr class="hidden-md hidden-lg">
      </div>
  </script>
  
  <script type="text/template" id="item-template">
    <a class="list-group-item __active" href="#movies/<%- id %>">
      <span class="badge"><%- type %></span>
      <h4 class="list-group-item-heading"><%- series %><%- title %><% if (year) { %><small>(<%- year %>)</small><% } %></h4>
      <p class="list-group-item-text">
        <%- filename %>
        <span class="badge status pull-right <%- status %>"><%- status %></span>
      </p>
    </a>
  </script>

{% endblock %}

{% block pagination %}
  <!-- Pagination -->
  <div class="row text-center">
      <div class="col-lg-12">
          <ul class="pagination">
              <li>
                  <a href="#">&laquo;</a>
              </li>
              <li class="active">
                  <a href="#">1</a>
              </li>
              <li>
                  <a href="#">2</a>
              </li>
              <li>
                  <a href="#">3</a>
              </li>
              <li>
                  <a href="#">4</a>
              </li>
              <li>
                  <a href="#">5</a>
              </li>
              <li>
                  <a href="#">&raquo;</a>
              </li>
          </ul>
      </div>
  </div>
{% endblock %}

{% block header %}
  <!-- Page Header -->
  <div class="row">
      <div class="col-lg-12">
          <h1 class="page-header">Page Heading
              <small>Secondary Text</small>
          </h1>
      </div>
  </div>
  <!-- /.row -->
{% endblock %}

{% block footer %}
  <!-- Footer -->
  <footer>
      <div class="row">
          <div class="col-lg-12">
              <p>Copyright &copy; Your Website 2014</p>
          </div>
      </div>
      <!-- /.row -->
  </footer>
{% endblock %}

{% block headercss %}
<link rel="stylesheet" href="/css/home.css">
{% endblock %}

{% block headerjs %}
<script src="/js/home.js"></script>
{% endblock %}
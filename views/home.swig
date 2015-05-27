{% extends 'layout.swig' %}

{% block content %}

{% endblock %}

{% block footer %}
  <footer class="footer">
    <div class="container">
      <p class="text-muted">Copyright &copy; Pitaso.com 2015</p>
    </div>
  </footer>
{% endblock %}

{% block tpls %}
  <script type="text/template" id="movies-template">
    <div class="row">
      <button id="logbutton" name="logbutton" class="btn btn-primary">Log</button>
      <button id="scanbutton" name="scanbutton" class="btn btn-info">Scan</button>
      <button id="movebutton" name="movebutton" class="btn btn-danger">Move</button>
    </div>
    <div class="row movieapp">
      <div class="movies__library col-md-5">
        <div class="list-group movie-list"></div>
      </div>
      <div id="item-details" class="movies__viewer col-md-7 hidden-xs"></div>
    </div>
  </script>
  
  <script type="text/template" id="detail-template">
      <div>
        <div class="movies__title">
          <h1>
            <i class="<%- type %> <%- badgeclass %>"></i>
            <a href="<%- link %>" target="_blank"><%- series %> <%- title %> <% if (year) { %><small>(<%- year %>)</small><% } %></a>
            <a href="#movies"><i class="icon-close pull-right visible-xs"></i></a>
          </h1>
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
    <a class="list-group-item __active" href="#/movie/<%- id %>">
      <span class="badge <%- type %>"><i class="<%- badgeclass %>"></i></span>
      <h4 class="list-group-item-heading"><%- series %><%- title %><% if (year) { %><small>(<%- year %>)</small><% } %></h4>
      <p class="list-group-item-text">
        <%- filename %>
        <span class="badge status pull-right <%- status %>"><%- status %></span>
      </p>
    </a>
  </script>

  <script type="text/template" id="settings-template">
    <form class="form-horizontal">
      <fieldset>
        <legend>Settings</legend>
        
        <div class="form-group">
          <label class="col-md-4 control-label" for="tvshowpath">TVshows path</label>  
          <div class="col-md-4">
          <input id="tvshowpath" name="tvshowpath" type="text" placeholder="Path for TVshows" class="form-control input-md" value="<%- path.tvshow %>">
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-md-4 control-label" for="moviepath">Movies path</label>  
          <div class="col-md-4">
          <input id="moviepath" name="moviepath" type="text" placeholder="Path for movies" class="form-control input-md" value="<%- path.movie %>">
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-md-4 control-label" for="delay">Delay</label>  
          <div class="col-md-4">
          <input id="delay" name="delay" type="text" placeholder="delay" class="form-control input-md" value="<%- delay %>">
          <span class="help-block">Delay between 2 consecutives scan</span>  
          </div>
        </div>
        
        <div class="form-group">
          <div class="col-md-4 col-md-offset-4 ">
            <button id="savebutton" name="savebutton" class="btn btn-primary">Save</button>
          </div>
        </div>
      
      </fieldset>
    </form>
  </script>
{% endblock %}

{% block headercss %}
<link rel="stylesheet" href="/css/home.css">
{% endblock %}

{% block headerjs %}
<script src="/js/home.js"></script>
{% endblock %}
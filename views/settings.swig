{% extends 'layout.swig' %}

{% block content %}
  <h1>{{ title }}</h1>
{% endblock %}

{% block main %}
<form class="form-horizontal">
  <fieldset>
    <legend>Settings</legend>
    
    <div class="form-group">
      <label class="col-md-4 control-label" for="tvshowpath">TVshows path</label>  
      <div class="col-md-4">
      <input id="tvshowpath" name="tvshowpath" type="text" placeholder="Path for TVshows" class="form-control input-md" value="{{ settings.path.tvshow }}">
      </div>
    </div>
    
    <div class="form-group">
      <label class="col-md-4 control-label" for="moviepath">Movies path</label>  
      <div class="col-md-4">
      <input id="moviepath" name="moviepath" type="text" placeholder="Path for movies" class="form-control input-md" value="{{ settings.path.movie }}">
      </div>
    </div>
    
    <div class="form-group">
      <label class="col-md-4 control-label" for="delay">Delay</label>  
      <div class="col-md-4">
      <input id="delay" name="delay" type="text" placeholder="delay" class="form-control input-md" value="{{ settings.delay }}">
      <span class="help-block">Delay between 2 consecutives scan</span>  
      </div>
    </div>
    
    <div class="form-group">
      <label class="col-md-4 control-label" for="savebutton">Save</label>
      <div class="col-md-4">
        <button id="savebutton" name="savebutton" class="btn btn-primary">Save</button>
      </div>
    </div>
  
  </fieldset>
</form>
{% endblock %}

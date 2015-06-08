<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <meta name="author" content="">
  <title>{{ title }}</title>

  <title>3 Col Portfolio - Start Bootstrap Template</title>
  
  <link rel="icon" type="image/svg" href="favicon.svg" />
  <link rel="icon" type="image/png" href="favicon.png" />

  <!-- Bootstrap Core CSS -->
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <link href="css/icomoon.css" rel="stylesheet">

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
    
  <link rel="stylesheet" href="/css/style.css">
  
  {% block headercss %}{% endblock %}

  <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
  <script src="/components/jquery/dist/jquery.min.js"></script>
  <script src="/components/underscore/underscore-min.js"></script>
  <script src="/components/backbone/backbone.js"></script>
  <script src="/components/bootstrap/dist/js/bootstrap.min.js"></script>
  
  <script src="/js/bbhack.js"></script>

  {% block headerjs %}{% endblock %}

</head>
<body>
  {% block nav %}
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/"><i class="logo"></i> Alfred</a>
            </div>
            <div class="collapse navbar-collapse" id="bs-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li>
                        <a class="movies" href="#movies">Movies</a>
                    </li>
                    <li>
                        <a class="settings" href="#settings">Settings</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  {% endblock %}
  
  <div class="container" id="ctn">
    {% block content %}{% endblock %}
  </div>
  
  {% block footer %}{% endblock %}
  {% block tpls %}{% endblock %}
</body>
</html>


var head = document.getElementsByTagName('head')[0];

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'fallback/{{module}}.css');
head.appendChild(link);

var script = document.createElement('script');
script.setAttribute('src', 'fallback/{{module}}.js');
head.appendChild(script);

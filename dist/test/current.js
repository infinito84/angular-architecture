var head = document.getElementsByTagName('head')[0];

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'v634/test.css');
head.appendChild(link);

var script = document.createElement('script');
script.setAttribute('src', 'v634/test.js');
head.appendChild(script);
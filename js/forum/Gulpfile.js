var flarum = require('flarum-gulp');

flarum({
  modules: {
    'squeevee/at-will-groups': [
      'src/**/*.js'
    ]
  }
});

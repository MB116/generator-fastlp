'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the \n' + chalk.red('FastLP') + ' generator!'
    ));

    var prompts = [{
      type: 'prompt',
      name: 'appName',
      message: 'Enter the name of your application:'
    },
    {
        type: 'input',
        name: 'appScrolls',
        message: 'Enter the number of scrolls in the project:',
        validate: function (input) {
          var number = parseInt(input);
          if(number >= "1" && number <= "15") {
            return true;
          } else {
            return "You need to provide a number (1-15)";
          }
        }
    },
    {
      type: 'list',
      name: 'appCSSPreprocessor',
      message: 'Select CSS preprocessor:',
      choices: [{
        name: 'SCSS',
        value: 'SCSS'
      },
      {
        name: 'Without a preprocessor (CSS)',
        name: 'CSS'
      }],
      default: 0
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.appScrolls = props.appScrolls;
      this.appCSSPreprocessor = props.appCSSPreprocessor;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('src');
    if(this.appCSSPreprocessor == "CSS") {
      this.mkdir('src/css');
      this.template('_css/_styles.css', 'src/css/styles.css');
    } else {
      this.mkdir('src/scss');
      this.copy('_scss/_main.scss', 'src/scss/main.scss');
      this.copy('_scss/_header.scss', 'src/scss/header.scss');
      this.copy('_scss/_footer.scss', 'src/scss/footer.scss');
      for(var i=1; i<=this.appScrolls; i++) {
        this.copy('_scss/_scroll-.scss', 'src/scss/scroll-'+i+'.scss');
      }
    }
    this.mkdir('src/js');
    this.template('_js/_scripts.js', 'src/js/scripts.js');

    this.mkdir('build');
    this.mkdir('build/css');
    this.mkdir('build/js');
    this.mkdir('build/img');
    this.mkdir('build/fonts');
    this.template('_index.html', 'build/index.html');

    this.copy('_thanks.html', 'build/thanks.html');
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_gulpfile.js', 'gulpfile.js');
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  },

  install: function () {
    this.installDependencies();

    this.log('Do not forget change path to php.');
    this.log(yosay(
      'Thank you for using ' + chalk.red('FastLP') + ' generator! \n Created by \n Pavel MB116 Andreichenko'
    ));
  }
});

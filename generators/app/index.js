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
          if(number >= "1" && number <= "10") {
            return true;
          } else {
            return "You need to provide a number (1-10)";            
          }
        }
    },
    {
      type: 'list',
      name: 'appCSSPreprocessor',
      message: 'Select CSS preprocessor:',
      choices: [{
        name: 'Without a preprocessor (CSS)',
        name: 'CSS'
      },
      {
        name: 'SCSS',
        value: 'SCSS'
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
    this.mkdir('app');
    this.mkdir('app/css');
    if(this.appCSSPreprocessor == "CSS") {
      this.template('_css/_style.css', 'app/css/style.css');
    } else {
      this.mkdir('app/scss');
      this.copy('_scss/_header.scss', 'app/scss/header.scss');
      this.copy('_scss/_footer.scss', 'app/scss/footer.scss');
      for(var i=1; i<=this.appScrolls; i++) {
        this.copy('_scss/_scroll-.scss', 'app/scss/scroll-'+i+'.scss');
      }
    }
    this.mkdir('app/img');
    this.mkdir('app/js');

    this.template('_index.html', 'app/index.html');    
    this.template('_js/_scripts.js', 'app/js/scripts.js');
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  },

  install: function () {
    this.installDependencies();

    this.log(yosay(
      'Thank you for using ' + chalk.red('FastLP') + ' generator! \n Created by \n Pavel MB116 Andreichenko'
    ));
  }
});

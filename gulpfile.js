'use strict';
var gulp = require('gulp');


var plugins = require('gulp-load-plugins')({lazy: false});
var es = require('event-stream');
var minifyCSS = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');
var concat = require('gulp-concat-sourcemap');

var jshint = require('gulp-jshint');
var map = require('map-stream');
var stylish = require('jshint-stylish');
var protractor = require("gulp-protractor").protractor;



//TODO: melhorar a forma como isso está sendo exportado!
var paths = require('./paths');
paths.buildfonts = paths.build + '/bootstrap';



// Tarefa usada so para testar se os GLOBS de um diretorio estao corretos.
gulp.task('testcopy', function () {
  return gulp.src('./app/**/e2e/**/*')
    .pipe(gulp.dest(paths.build));
});

// Tarefa limpa diretorio de "build"
gulp.task('clean', function () {
  return gulp.src(paths.build, {read: false})
    .pipe(plugins.clean());
});


//Roda testes e2e
gulp.task('e2e', function () {
  gulp.src(paths.testes.reports, {read: false})
    .pipe(plugins.clean());


  gulp.src([paths.testes.e2e])
    .pipe(protractor({
      configFile: "protractor-conf.js"
    }))
    .on('error', function (e) {
      throw e
    });
});


// Para bibliotecas de terceiros:
// Compila Sass, mescla com css normal e output para app.css
gulp.task('VendorCSS', ['CopiaGlyphIcons'], function () {

  var sassFiles = gulp.src(paths.vendorsass);
  var cssFiles = gulp.src(paths.vendorcss);

  return es.merge(
    sassFiles.pipe(plugins.sass()),
    cssFiles)
    .pipe(plugins.changed(paths.build))
    .pipe(plugins.concat('lib.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.build));
});

gulp.task('CopiaGlyphIcons', function () {
  gulp.src('./app/assets/fonts/*.*')
    .pipe(gulp.dest(paths.buildfonts));
});


//Compila Sass, mescla com css normal e output para app.css
//Tambem prefixa para 2 versoes e minifica.
gulp.task('AppCSS', function () {

  var sassFiles = gulp.src(paths.appsass);
  var cssFiles = gulp.src(paths.appcss);
    return es.merge(
      sassFiles.pipe(plugins.sass()),
      cssFiles)
      .pipe(plugins.changed(paths.build))
      .pipe(plugins.concat('app.css'))
      .pipe(plugins.autoprefixer('last 2 versions'))
      .pipe(minifyCSS())

      .pipe(gulp.dest(paths.build));
});



//minifica imagens.
gulp.task('imagemin', function () {
  var imgSrc = paths.images,
    imgDst = paths.build;

  gulp.src(imgSrc)
    .pipe(plugins.changed(imgDst))
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(imgDst));
});


//combine all js files of the app
gulp.task('copyEnvConfig', function () {
  gulp.src(paths.envConfigFiles.production)
});

gulp.task('scripts', function () {
  return es.merge(gulp.src(paths.scripts),
    gulp.src(paths.envConfigFiles.production)
  )
//    gulp.src(paths.scripts)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
//        .pipe(plugins.stripDebug())
    .pipe(plugins.ngmin())
    .pipe(plugins.uglify({mangle: false}))
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest(paths.build));
});

//combine all template files of the app into a js file and put into cache.
gulp.task('templates', function () {
  gulp.src(paths.templates)
    .pipe(plugins.angularTemplatecache('templates.js', {standalone: true}))
    .pipe(gulp.dest(paths.build));
});


// Junto JS de vendors, arranca debug e minifica
gulp.task('vendorJS', function () {
  //concatenate vendor JS files
  gulp.src(paths.vendorJS)
    .pipe(plugins.concat('lib.js'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('copyMapFiles', function () {
  gulp.src(paths.vendorMapFiles)
    .pipe(gulp.dest(paths.build));
});


gulp.task('copy-index', function () {
  //Aqui, vamos remover um pedaco do index.html e substituir com o trecho abaixo.
  //perceba que a ORDEM dos .js e importante. O lib precisa ir primeiro, pois traz todas as dependencias (angular, etc.)
  //em seguida vem o app que traz nossas definicoes.
  //Por fim, vem os templates que apenas carrega os "partials" em funcoes js.

  var prodJS = [
    'lib.js',
    'app.js',
    'templates.js'
  ];
  var prodCSS = [
    'lib.css',
    'app.css'
  ];

  //Substitui trechos de HTML para refletir as versoes de producao das bibliotecas JS e CSS.
  gulp.src(paths.index)
    .pipe(htmlreplace({
      js: prodJS,
      css: prodCSS
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('watch', function () {
  gulp.watch([
    'build/**/*.html',
    'build/**/*.js',
    'build/**/*.css'
  ], function (event) {
    return gulp.src(event.path)
      .pipe(plugins.connect.reload());
  });
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.appcss, ['AppCSS']);
  gulp.watch(paths.appsass, ['AppCSS']);
  gulp.watch(paths.index, ['copy-index']);

});


//Abaixo sao tarefas que usadas para DESENVOLVIMENTO.
gulp.task('ProcessaStilosParaDesenvolvimento', function () {
  var sassFiles = gulp.src('./app/assets/style/**/*.scss');
  var cssFiles = gulp.src('./app/assets/style/**/*.css');
  var fontDestinationDir = paths.build + '/external/bootstrap';
  var imageDestinationDir = paths.build + '/assets/images';

  //Copia fontes web
  gulp.src('./app/assets/fonts/*.*')
    .pipe(gulp.dest(fontDestinationDir));

  //Copia imagens
  gulp.src('./app/assets/images/*.*')
    .pipe(gulp.dest(imageDestinationDir));

  return es.merge(
    sassFiles.pipe(plugins.sass({errLogToConsole: true})),
    cssFiles)
    .pipe(plugins.autoprefixer('last 2 versions'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('copiaArquivosMock', function () {

  var mockDestino = paths.build + '/mockdata';

  //Copia arquivos mock.
  gulp.src(paths.mockFiles)
    .pipe(gulp.dest(mockDestino));
});

gulp.task('watchSTYLE', function () {
  gulp.watch(paths.appcss, ['ProcessaStilosParaDesenvolvimento']);
  gulp.watch(paths.appsass, ['ProcessaStilosParaDesenvolvimento']);
  gulp.watch(paths.vendorcss, ['ProcessaStilosParaDesenvolvimento']);
  gulp.watch(paths.vendorsass, ['ProcessaStilosParaDesenvolvimento']);
  gulp.watch(paths.images, ['ProcessaStilosParaDesenvolvimento']);
});

gulp.task('watchMock', function () {
  gulp.watch(paths.mockFiles, ['copiaArquivosMock']);

});


//Depois ver forma melhor de modularizar isso.
var fileWritingReporter = map(function (file, cb) {
  if (!file.jshint.success) {
    var fs = require('fs');
    var originalFileName = file.path.split("/").splice(-1)[0];
    var logFileDir = "./linterrorlog";
    var logFileName = logFileDir + "/errors_" + originalFileName + ".txt";

    //Cria diretorio se nao exitir.
    if (!fs.existsSync(logFileDir)) {
      fs.mkdirSync(logFileDir);
    }
    //Create new file.
    fs.writeFile(logFileName, 'Erros para: ' + file.path, function (err) {
      if (err) {
        console.log(err);
      }
    });


    //Grava erros.
    file.jshint.results.forEach(function (err) {
      if (err) {
        var msg = '\n' + originalFileName + ': line ' + err.error.line + ', col ' + err.error.character + ', code ' + err.error.code + ', ' + err.error.reason;
        fs.appendFile(logFileName, msg, {'flag': 'a'}, function (werr) {
          if (werr) {
            console.log(werr);
          }
        });

      }
    });
  }
  cb(null, file);
});

//Cria tarefa lint
gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(jshint('.jshintrc'))
    .pipe(fileWritingReporter)
    .pipe(jshint.reporter(stylish))
    ;


});


//Fim tarefas para desenvolvimento


gulp.task('connect', plugins.connect.server({
  root: ['build'],
  port: 9000,
  livereload: true
}));

gulp.task('connect-dev', plugins.connect.server({
  root: ['.', 'app'],
  port: 9000,
  livereload: true
}));


gulp.task('genNoServe', ['clean', 'scripts', 'templates', 'VendorCSS', 'AppCSS', 'imagemin', 'copy-index', 'vendorJS', 'copyMapFiles']);
gulp.task('genAndServeNoWatch', ['genNoServe', 'connect']);
gulp.task('genAndServeAndWatch', ['genAndServeNoWatch', 'watch']);
gulp.task('default', ['genNoServe']);
gulp.task('desenv', ['ProcessaStilosParaDesenvolvimento', 'copiaArquivosMock', 'watchSTYLE', 'watchMock']);

gulp.task('serve-desenv', ['desenv', 'connect-dev']);



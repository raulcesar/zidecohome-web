'use strict';
var gulp = require('gulp');


// var plugins = require('gulp-load-plugins')({lazy: false});
var es = require('event-stream');
var minifyCSS = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');
var replace = require('gulp-replace');
var concat = require('gulp-concat-sourcemap');

var jshint = require('gulp-jshint');
var map = require('map-stream');
var stylish = require('jshint-stylish');
var protractor = require('gulp-protractor').protractor;
var paths = require('./paths');
var rimraf = require('rimraf');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var autoprefixer = require('gulp-autoprefixer');
var logCapture = require('gulp-log-capture');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var angularTemplatecache = require('gulp-angular-templatecache');
var connect = require('gulp-connect');

var os = require('os');

function buildVersionString() {
    var jenkinsTag = process.env.BUILD_TAG;
    if (!jenkinsTag || jenkinsTag === '') {
        var hoje = new Date();
        var day = ('00' + hoje.getUTCDate()).slice(-2);
        var month = ('00' + (hoje.getUTCMonth() + 1)).slice(-2);
        var year = ('0000' + hoje.getUTCFullYear()).slice(-4);
        var hour = ('00' + hoje.getUTCHours()).slice(-2);
        var minute = ('00' + hoje.getUTCMinutes()).slice(-2);
        var second = ('00' + hoje.getUTCSeconds()).slice(-2);


        jenkinsTag = os.hostname() + '-UTC-' + year + '-' + month + '-' + day + '_' + hour + ':' + minute + ':' + second;
    }
    return jenkinsTag;
}


// Tarefa usada so para testar se os GLOBS de um diretorio estao corretos.
gulp.task('testcopy', function() {
    return gulp.src('./app/**/e2e/**/*')
        .pipe(gulp.dest(paths.build));
});

// Tarefa limpa diretorio de "build"
gulp.task('clean', function() {
    rimraf.sync(paths.build);
});

gulp.task('cleanE2eReports', function() {
    rimraf.sync(paths.testes.reports);
});

//Roda testes e2e
gulp.task('e2e', ['cleanE2eReports'], function() {
    gulp.src([paths.testes.e2e])
        .pipe(protractor({
            configFile: 'protractor-conf.js'
                //    ,    args: ['--baseUrl', 'http://127.0.0.1:8000']
        }))
        .on('error', function(e) {
            throw e;
        });
});



// Para bibliotecas de terceiros:
// Compila Sass, mescla com css normal e output para app.css
gulp.task('VendorCSS', ['CopiaWebFonts'], function() {

    var sassFiles = gulp.src(paths.vendorsass);
    var cssFiles = gulp.src(paths.vendorcss);

    return es.merge(
            sassFiles.pipe(sass()),
            cssFiles)
        .pipe(changed(paths.build))
        .pipe(concat('lib.css'))
        .pipe(minifyCSS())

    .pipe(gulp.dest(paths.build));
});

gulp.task('CopiaWebFonts', function() {
    gulp.src('./app/assets/fonts/*.*')
        .pipe(gulp.dest(paths.buildfonts));

    //ui-grid fonts need to be at same level as lib... WEEAAKKK!
    gulp.src(paths.uigridfonts)
        .pipe(gulp.dest(paths.uigridbuildfonts));

});


//Compila Sass, mescla com css normal e output para app.css
//Tambem prefixa para 2 versoes e minifica.
gulp.task('AppCSS', function() {

    var sassFiles = gulp.src(paths.appsass);
    var cssFiles = gulp.src(paths.appcss);
    return es.merge(
            sassFiles.pipe(sass()),
            cssFiles)
        //        .pipe(changed(paths.build))
        .pipe(concat('app.css'))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(minifyCSS())

    .pipe(gulp.dest(paths.build));
});



//minifica imagens.
gulp.task('imagemin', function() {
    var imgSrc = paths.images,
        imgDst = paths.build;

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});



//Combine e minifica os arquivos JS da aplicacao.
gulp.task('scripts', function() {
    var versionNumber = buildVersionString();

    return es.merge(
        gulp.src(paths.envConfigFiles.production)
        .pipe(replace('<!--BuildVersion-->', versionNumber)),
        gulp.src(paths.scripts))

    .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //        .pipe(stripDebug())
        //    .pipe(ngmin())
        //    .pipe(uglify({mangle: false}))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.build));
});

//combine all template files of the app into a js file and put into cache.
gulp.task('templates', function() {
    gulp.src(paths.templates)
        .pipe(angularTemplatecache('templates.js', {
            standalone: true
        }))
        .pipe(gulp.dest(paths.build));
});


// Junto JS de vendors, arranca debug e minifica
gulp.task('vendorJS', function() {
    //concatenate vendor JS files
    gulp.src(paths.vendorJS)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(paths.build));
});

gulp.task('copyMapFiles', function() {
    gulp.src(paths.vendorMapFiles)
        .pipe(gulp.dest(paths.build));
});

gulp.task('copy-index', function() {
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

gulp.task('watch', function() {
    gulp.watch([
        'build/**/*.html',
        'build/**/*.js',
        'build/**/*.css'
    ], function(event) {
        return gulp.src(event.path)
            .pipe(connect.reload());
    });
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.appcss, ['AppCSS']);
    gulp.watch(paths.appsass, ['AppCSS']);
    gulp.watch(paths.index, ['copy-index']);

});


//Abaixo sao tarefas que usadas para DESENVOLVIMENTO.
gulp.task('copyImagesNoMin', function() {
    var imageDestinationDir = paths.build + '/assets/images';

    gulp.src('./app/assets/images/*.*')
        .pipe(gulp.dest(imageDestinationDir));
});

gulp.task('debugsass', function() {
    var sassFiles = gulp.src('./app/assets/style/**/*.scss');
    sassFiles.pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(paths.build));
});

gulp.task('copyMockFiles', function() {

    var mockDestino = paths.build + '/mockdata';

    //Copia arquivos mock.
    gulp.src(paths.mockFiles)
        .pipe(gulp.dest(mockDestino));
});

gulp.task('watchSTYLE', function() {
    gulp.watch(paths.appcss, ['AppCSS']);
    gulp.watch(paths.appsass, ['AppCSS']);
    gulp.watch(paths.vendorcss, ['VendorCSS']);
    gulp.watch(paths.vendorsass, ['VendorCSS']);
    // gulp.watch(paths.images, ['ProcessaStilosParaDesenvolvimento']);
});

gulp.task('watchMock', function() {
    gulp.watch(paths.mockFiles, ['copyMockFiles']);

});


//Depois ver forma melhor de modularizar isso.
var fileWritingReporter = map(function(file, cb) {
    if (!file.jshint.success) {
        var fs = require('fs');
        var originalFileName = file.path.split('/').splice(-1)[0];
        var logFileDir = './linterrorlog';
        var logFileName = logFileDir + '/errors_' + originalFileName + '.txt';

        //Cria diretorio se nao exitir.
        if (!fs.existsSync(logFileDir)) {
            fs.mkdirSync(logFileDir);
        }
        //Create new file.
        fs.writeFile(logFileName, 'Erros para: ' + file.path, function(err) {
            if (err) {
                console.log(err);
            }
        });


        //Grava erros.
        file.jshint.results.forEach(function(err) {
            if (err) {
                var msg = '\n' + originalFileName + ': line ' + err.error.line + ', col ' + err.error.character + ', code ' + err.error.code + ', ' + err.error.reason;
                fs.appendFile(logFileName, msg, {
                    'flag': 'a'
                }, function(werr) {
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


gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint('.jshintrc'))
        .pipe(logCapture.start(console, 'log'))
        .pipe(jshint.reporter('jslint_xml'))
        .pipe(logCapture.stop('xml'))
        .pipe(gulp.dest('lint-reports'));


});

//Creio que poderia usar o logCapture acima para gerar os arquivos.
//O ideal contudo, creio que seria criar um reporter que aceitasse outro reporter e gravasse o resultado para um arquivo.
gulp.task('lint-dev', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint('.jshintrc'))
        .pipe(fileWritingReporter)
        .pipe(jshint.reporter(stylish));
});


gulp.task('connect', connect.server({
    root: ['build'],
    port: 9092,
    livereload: true
}));

gulp.task('connect-dev', connect.server({
    root: ['.', 'app'],
    port: 9092,
    livereload: true
}));




gulp.task('default', ['lint', 'genProductionBuild']);
gulp.task('genProductionBuild', ['genNoServe', 'copyMockFiles']);
//gulp.task('deploy', ['genProductionBuild']);

gulp.task('genNoServe', ['clean', 'scripts', 'templates', 'VendorCSS', 'AppCSS', 'imagemin', 'copy-index', 'vendorJS', 'copyMapFiles']);

gulp.task('genAndServeNoWatch', ['genNoServe', 'connect']);
gulp.task('genAndServeAndWatch', ['genAndServeNoWatch', 'watch']);
gulp.task('desenv', ['copyImagesNoMin', 'copyMockFiles', 'VendorCSS', 'AppCSS', 'watchSTYLE', 'watchMock']);
gulp.task('serve-desenv', ['desenv', 'connect-dev']);

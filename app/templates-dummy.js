//Este arquivo serve de dummy enquanto estiver no ambiente de desenvolvimento local.
//Ele nao e transferido para producao e somente existe para nao dar erro no app.js, que necessita do modulo "template".
//Em ambiente de producao, este modulo e gerado com base nos arquivos "html" pelo GULP.
var dummy = angular.module('templates', []);

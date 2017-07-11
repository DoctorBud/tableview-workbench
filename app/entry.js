// https://berkeleybop.github.io/bbop-graph-noctua/doc/graph.html#fold_evidence

// Main program
// Root of all the imports/requires

import angular from 'angular';
import ngGrid from 'angular-ui-grid/ui-grid.min.js';
import nguibootstrap from 'angular-ui-bootstrap';
import 'jsonformatter';
import 'jsonformatter/dist/json-formatter.min.css';
import '../node_modules/angular-ui-grid/ui-grid.min.css';
import './index.scss';
import 'font-awesome/css/font-awesome.min.css';

var app = angular.module('TVApp', [
  nguibootstrap,
  'jsonFormatter',
  'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav',
  'ui.grid.autoResize', 'ui.grid.resizeColumns',
  'ui.grid.treeView'
]);
app.config(['JSONFormatterConfigProvider', function (JSONFormatterConfigProvider) {

  // Enable the hover preview feature
  JSONFormatterConfigProvider.hoverPreviewEnabled = true;
}]);

import TVController from 'TVController';
app.controller('TVController', TVController);

import LookupService from './lookup.js';
app.service('lookup', LookupService);
//
// TVController
//  Primary controller driving the table-mode
//

// const each = require('lodash/forEach');
// import Lookup from './lookup';


// Noctua-specific
var model = require('bbop-graph-noctua');
var barista_response = require('bbop-response-barista');
// var bbop = require('bbop-core');
// var minerva_requests = require('minerva-requests');
// var barista_client = require('bbop-client-barista');
var jquery_engine = require('bbop-rest-manager').jquery;
var minerva_manager = require('bbop-manager-minerva');


//
//  Globals passed to Workbench from Noctua
/* global global_id */
/* global global_golr_server */
/* global global_barista_location */
/* global global_minerva_definition_name */
/* global global_barista_token */
/* global global_collapsible_relations */
var local_id = typeof global_id !== 'undefined' ? global_id : 'global_id';
var local_golr_server = typeof global_golr_server !== 'undefined' ? global_golr_server : 'global_id';
var local_barista_location = typeof global_barista_location !== 'undefined' ? global_barista_location : 'global_barista_location';
var local_minerva_definition_name = typeof global_minerva_definition_name !== 'undefined' ? global_minerva_definition_name : 'global_minerva_definition_name';
var local_barista_token = typeof global_barista_token !== 'undefined' ? global_barista_token : 'global_barista_token';
var local_collapsible_relations = typeof global_collapsible_relations !== 'undefined' ? global_collapsible_relations : 'global_collapsible_relations';

const GraphModel = require('GraphModel.js');

export default class TVController {
  constructor($scope, $http, $timeout, uiGridTreeViewConstants, lookup) {

    var tvc = this;
    this.$scope = $scope;
    this.uiGridTreeViewConstants = uiGridTreeViewConstants;
    tvc.$timeout = $timeout;
    tvc.lookup = lookup;

    tvc.model_id = local_id;
    tvc.golr_server = local_golr_server;
    tvc.barista_location = local_barista_location;
    tvc.minerva_definition_name = local_minerva_definition_name;
    tvc.barista_token = local_barista_token;
    tvc.collapsible_relations = local_collapsible_relations;

    //delete? tvc.fieldToRoot = {
    //delete?   GP: null,
    //delete?   MF: null,
    //delete?   MFe: null,
    //delete?   BP: null,
    //delete?   BPe: null,
    //delete?   CC: null,
    //delete?   CCe: null
    //delete? };

    tvc.clearForm();

    tvc.gridApi = null;
    tvc.gridOptions = {
      rowHeight: 50,
      width: 100,
      minWidth: 100,
      enableCellSelection: false,
      // rowEditWaitInterval: -1,
      enableCellEdit: false,
      enableCellEditOnFocus: false,
      multiSelect: false,
      xrowTemplate: 'TERowTemplate',
      showTreeExpandNoChildren: false
      // keyDownOverrides: [{keyCode: 27}]
    };

    let columnDefs = [];
    // columnDefs.push({
    //     name: 'Command',
    //     field: '',
    //     originalName: 'Command',
    //     displayName: '',
    //     width: 230,
    //     enableCellSelection: false,
    //     enableCellEditOnFocus: false,
    //     enableSorting: false,
    //     allowCellFocus: false,
    //     enableHiding: false,
    //     enableColumnMenu: false,
    //   });


    let commandColumn = {
      name: 'Command',
      displayName: '',
      width: 30,
      field: '',
      resizable: false,
      cellTemplate: 'uigridActionCell',
      headerCellTemplate: 'uigridActionHeader',
      enableCellEdit: false,
      enableCellSelection: false,
      enableCellEditOnFocus: false,
      enableSorting: false,
      allowCellFocus: false,
      enableHiding: false,
      enableColumnMenu: false
    };
    columnDefs.push(commandColumn);

    columnDefs.push({
        name: 'GP',
        field: 'GP',
        originalName: 'GP',
        displayName: 'GP',
        width: 200,
        minWidth: 200,
        enableCellEdit: false,
        enableCellEditOnFocus: false
      });
    columnDefs.push({
        name: 'Aspect',
        field: 'Aspect',
        originalName: 'Aspect',
        displayName: 'Aspect',
        width: 60,
        maxWidth: 60,
        // maxWidth: 200,
        enableCellEdit: false,
        enableCellEditOnFocus: false
      });
    columnDefs.push({
        name: 'Term',
        field: 'Term',
        originalName: 'Term',
        displayName: 'Term',
        minWidth: 200,
        enableCellEdit: false,
        enableCellEditOnFocus: false
      });
    columnDefs.push({
        name: 'Evidence',
        field: 'Evidence.label',
        originalName: 'Evidence',
        displayName: 'Evidence',
        minWidth: 200,
        enableCellEdit: false,
        enableCellEditOnFocus: false
      });
    columnDefs.push({
        name: 'Reference',
        field: 'Reference',
        originalName: 'Reference',
        displayName: 'Reference',
        minWidth: 200,
        enableCellEdit: false,
        enableCellEditOnFocus: false
      });
    columnDefs.push({
        name: 'With',
        field: 'With',
        originalName: 'With',
        displayName: 'With',
        minWidth: 200,
        enableCellEdit: false,
        enableCellEditOnFocus: false
      });
    tvc.gridOptions.columnDefs = columnDefs;

    tvc.gridOptions.onRegisterApi = function(gridApi) {
      tvc.gridApi = gridApi;
      tvc.$scope.gridApi = gridApi;

      tvc.$timeout(function() {
        tvc.gridApi.core.handleWindowResize();
      }, 0);
    };

    tvc.graph = null;

    tvc.engine = new jquery_engine(barista_response);
    tvc.engine.method('POST');
    var manager = new minerva_manager(tvc.barista_location,
                                      tvc.minerva_definition_name,
                                      tvc.barista_token,
                                      tvc.engine, 'async');

    function _shields_up(){
      console.log('_shields_up');
    }
    function _shields_down(){
      console.log('_shields_down');
    }

    // Internal registrations.
    manager.register('prerun', _shields_up);
    manager.register('postrun', _shields_down, 9);
    manager.register('manager_error', function(resp /*, man */){
      alert('There was a manager error (' +
        resp.message_type() + '): ' + resp.message());
    }, 10);

    // Likely the result of unhappiness on Minerva.
    manager.register('warning', function(resp /*, man */){
      alert('Warning: ' + resp.message() + '; ' +
        'your operation was likely not performed');
    }, 10);

    // Likely the result of serious unhappiness on Minerva.
    manager.register('error', function(resp /*, man */){
      // Do something different if we think that this is a
      // permissions issue.
      var perm_flag = 'InsufficientPermissionsException';
      var token_flag = 'token';
      if( resp.message() && resp.message().indexOf(perm_flag) !== -1 ){
        alert('Error: it seems like you do not have permission to ' +
        'perform that operation. Did you remember to login?');
      }
      else if( resp.message() && resp.message().indexOf(token_flag) !== -1 ){
        alert('Error: it seems like you have a bad token...');
      }
      else {
        // Generic error.
        alert('Error (' +
        resp.message_type() + '): ' +
        resp.message() + '; ' +
        'your operation was likely not performed.');
      }
    }, 10);

    // ???
    manager.register('meta', function(/* resp , man */){
      console.log('a meta callback?');
    });

    // Likely result of a new model being built on Minerva.
    manager.register('rebuild', function(resp /*, man */){
      console.log('rebuild callback', resp);

      // Noctua graph.
      var noctua_graph = model.graph;
      tvc.$timeout(function() {

        tvc.graph = new noctua_graph();
        tvc.graph.load_data_basic(resp.data());

        let annotons = GraphModel.graphToAnnotons(tvc.graph);
        let gridData = GraphModel.annotonsToTable(tvc.graph, annotons);
        tvc.gridOptions.data = gridData;

        tvc.title = tvc.graph.get_annotations_by_key('title');
        // tvc.annotations = {};
        // var annotations = tvc.graph._annotations;
        // each(annotations, function(annotation){
        //   // console.log('annotation', annotation);
        //   tvc.annotations[annotation.key()] = annotation.value();
        // });
      }, 0);
    }, 10);

    manager.get_model(tvc.model_id);
  }

  getTerm(field, term) {
    let result = null;
    if (term && term.length >= 3) {
      let oldValue = this.editingModel[field];
      // console.log('getTerm', field, oldValue, term);
      result = this.lookup.golrLookup(field, oldValue, term); // delete?, this.fieldToRoot[field]);
      // console.log('result', result);
    }
    return result;
  }

  termSelected(field, term) {
    // console.log('termSelected', field, this.editingModel[field], term);
  }

  clearForm() {
    this.editingModel = {
      GP: null,
      MF: null,
      MFe: null,
      BP: null,
      BPe: null,
      CC: null,
      CCe: null
    };
  }

  saveRowEnabled() {
    return  this.editingModel &&
            this.editingModel.GP &&
            this.editingModel.MF &&
            this.editingModel.MFe;
  }

  saveRow() {
    console.log('saveRow', this.editingModel);

    let oldData = this.gridOptions.data;
    let annoton = {
      GP: this.editingModel.GP.id,

      MF: this.editingModel.MF ? this.editingModel.MF.id : null,
      MFe: this.editingModel.MFe ? this.editingModel.MFe : null,

      BP: this.editingModel.BP ? this.editingModel.BP.id : null,
      BPe: this.editingModel.BPe ? this.editingModel.BPe : null,

      CC: this.editingModel.CC ? this.editingModel.CC.id : null,
      CCe: this.editingModel.CCe ? this.editingModel.CCe : null
    };

    let annotonRows = GraphModel.annotonxToTableRows(this.graph, this.editingModel);

    console.log('annotonRows', annotonRows);
    this.gridOptions.data = this.gridOptions.data.concat(annotonRows);

    this.clearForm();
  }

  editRow(row) {
    console.log('editRow', row);
  }
  deleteRow(row) {
    console.log('deleteRow', row);
  }
}
TVController.$inject = ['$scope', '$http', '$timeout', 'uiGridTreeViewConstants', 'lookup'];

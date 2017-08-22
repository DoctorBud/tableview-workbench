//
// TVController
//  Primary controller driving the table-mode
//


export default class TVController {
  constructor($scope, $rootScope, $http, $timeout, uiGridTreeViewConstants, graph, lookup) {
    var tvc = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.uiGridTreeViewConstants = uiGridTreeViewConstants;
    tvc.$timeout = $timeout;
    tvc.lookup = lookup;
    tvc.graph = graph;

    var userNameInfo = document.getElementById('user_name_info');
    if (userNameInfo) {
      userNameInfo.innerHTML = '';
    }

    tvc.clearForm();

    tvc.gridApi = null;
    tvc.gridOptions = {
      rowHeight: 120,
      width: 100,
      minWidth: 100,
      enableCellSelection: false,
      // rowEditWaitInterval: -1,
      enableCellEdit: false,
      enableCellEditOnFocus: false,
      multiSelect: false,
      rowTemplate: 'rowTemplate.html',
      showTreeExpandNoChildren: false
      // keyDownOverrides: [{keyCode: 27}]
    };

    let columnDefs = [];

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
        width: 55,
        maxWidth: 55,
        enableSorting: false,
        enableColumnMenu: false,
        // maxWidth: 200,
        enableCellEdit: false,
        enableCellEditOnFocus: false
      });
    columnDefs.push({
        name: 'Term',
        field: 'Term',
        originalName: 'Term',
        displayName: 'Term',
        minWidth: 250,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        cellTemplate: 'cellTemplate.html'
      });
    columnDefs.push({
        name: 'Evidence',
        field: 'Evidence.label',
        originalName: 'Evidence',
        displayName: 'Evidence',
        minWidth: 250,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        cellTemplate: 'cellTemplate.html'
      });
    columnDefs.push({
        name: 'Reference',
        field: 'Reference',
        originalName: 'Reference',
        displayName: 'Reference',
        minWidth: 100,
        maxWidth: 140,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        cellTemplate: 'cellTemplate.html'
      });
    columnDefs.push({
        name: 'With',
        field: 'With',
        originalName: 'With',
        displayName: 'With',
        minWidth: 100,
        maxWidth: 140,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        cellTemplate: 'cellTemplate.html'
      });
    tvc.gridOptions.columnDefs = columnDefs;

    tvc.gridOptions.onRegisterApi = function(gridApi) {
      tvc.gridApi = gridApi;
      tvc.$scope.gridApi = gridApi;

      tvc.$timeout(function() {
        tvc.gridApi.core.handleWindowResize();
      }, 0);
    };

    $rootScope.$on('rebuilt', function(event, data) {
      const gridData = data.gridData;
      tvc.clearForm();

      tvc.gridOptions.data = gridData;
    });

    graph.initialize();
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

  termSelected(/* field , term */) {
    // console.log('termSelected', field, this.editingModel[field], term);
  }

  loadEditingModel(annoton) {
    // console.log('loadEditingModel', annoton);
    this.editingModel = annoton;
  }

  fillModelWithFakeData() {
    this.loadEditingModel({
      GP: {id: 'MGI:MGI:4367793', label: 'Sho2 Mmus'},

      MF: {id: 'GO:0045551', label: 'cinnamyl-alcohol dehydrogenase activity'},
      MFe: {
        id: 'ECO:0006017',
        label: 'traceable author statement from published clinical study used in manual assertion',
        reference: 'PMID:1234',
        with: 'PMID:5678'},

      BP: {id: 'GO:0046577', label: 'long-chain-alcohol oxidase activity'},
      BPe: {
        id: 'ECO:0000501',
        label: 'evidence used in automatic assertion',
        reference: 'r2',
        with: 'w2'},

      CC: {id: 'GO:0047639', label: 'alcohol oxidase activity'},
      CCe: {
        id: 'ECO:0005542',
        label: 'biological system reconstruction evidence by exper…ence from single species used in manual assertion',
        reference: 'r3',
        with: 'w3'}
    });
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

    this.$timeout(() => {
      const element = angular.element("#GPFocus");
      element.focus()
    });
  }

  saveRowEnabled() {
    let result = this.editingModel && this.editingModel.GP;
    let reasons = [];

    if (!result) {
      reasons.push('A GP is required');
    }
    else {
      let hasAtLeastOneElement = false;

      if (result && this.editingModel.MF) {
        if (!this.editingModel.MFe) {
          result = false;
          reasons.push('Missing MFe');
        }
        else {
          hasAtLeastOneElement = true;
        }
      }


      if (result && this.editingModel.BP) {
        if (!this.editingModel.BPe) {
          result = false;
          reasons.push('Missing BPe');
        }
        else {
          hasAtLeastOneElement = true;
        }
      }

      if (result && this.editingModel.CC) {
        if (!this.editingModel.CCe) {
          result = false;
          reasons.push('Missing CCe');
        }
        else {
          hasAtLeastOneElement = true;
        }
      }

      if (!hasAtLeastOneElement) {
        result = false;
        reasons.push('At least one Aspect required.');
      }
    }

    // console.log('saveRowEnabled', this.editingModel, result);
    return {
      result: result,
      reasons: reasons
    }
  }


  saveRow() {
    this.graph.saveEditingModel(this.editingModel);
  }


  editRow(row) {
    this.clearForm();
    let annoton = {
      GP: row.original.GP,
      MF: row.original.MF,
      Annoton: row.Annoton
    };

    if (row.original.MFe) {
      annoton.MFe = {
        id: row.original.MFe.evidence.id,
        label: row.original.MFe.evidence.label,
        reference: row.original.MFe.reference,
        with: row.original.MFe.with
      };
    }

    if (row.original.BP) {
      annoton.BP = row.original.BP;

      if (row.original.BPe) {
        annoton.BPe = {
          id: row.original.BPe.evidence.id,
          label: row.original.BPe.evidence.label,
          reference: row.original.BPe.reference,
          with: row.original.BPe.with
        };
      }
    }

    if (row.original.CC) {
      annoton.CC = row.original.CC;

      if (row.original.CCe) {
        annoton.CCe = {
          id: row.original.CCe.evidence.id,
          label: row.original.CCe.evidence.label,
          reference: row.original.CCe.reference,
          with: row.original.CCe.with
        };
      }
    }

    // console.log('row.original', row.original, annoton);
    this.loadEditingModel(annoton);
  }

  deleteRow(row) {
    if (window.confirm('Are you sure you wish to delete this row?')) {
      this.graph.deleteAnnoton(row.Annoton);
    }
  }
}
TVController.$inject = ['$scope', '$rootScope', '$http', '$timeout', 'uiGridTreeViewConstants', 'graph', 'lookup'];

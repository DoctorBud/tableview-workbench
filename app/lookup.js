import _ from 'lodash';

export default class LookupService {
  constructor($http, $timeout, $location, $sce, $rootScope) {
    this.name = 'DefaultLookupName';
    this.$http = $http;
    this.$timeout = $timeout;
    this.$location = $location;
    this.$sce = $sce;
    this.$rootScope = $rootScope;
  }


/*
    var gen_auto_type = new bbop.widget.search_box(
  gserv, gconf, type_add_class_text.get_id(), gen_auto_args);
    gen_auto_type.lite(true);
    gen_auto_type.add_query_filter('document_category', 'general');
    gen_auto_type.set_personality('general');
    var gen_auto_bundle = new bbop.widget.search_box(
  gserv, gconf, bundle_add_class_text.get_id(), gen_auto_args);
    gen_auto_bundle.lite(true);
    gen_auto_bundle.add_query_filter('document_category', 'general');
    gen_auto_bundle.set_personality('general');

http://amigo-dev-golr.berkeleybop.org/select?
  defType=edismax
  qt=standard
  indent=on
  wt=json
  rows=10
  start=0
  fl=*,score
  facet=true
  facet.mincount=1
  facet.sort=count
  json.nl=arrarr
  facet.limit=25
  fq=document_category:%22general%22
  facet.field=category
  q=acid*
  qf=entity%5E3
  qf=entity_label_searchable%5E3
  qf=general_blob_searchable%5E3
  json.wrf=jQuery22405356163120992933_1502071381663
  _=1502071381664


http://amigo-dev-golr.berkeleybop.org/select
  defType=edismax
  qt=standard
  indent=on
  wt=json
  rows=10
  start=0
  fl=*,score
  facet=true
  facet.mincount=1
  facet.sort=count
  json.nl=arrarr
  facet.limit=25
  fq=document_category:"ontology_class"
  fq=regulates_closure_label:"molecular_function"
  facet.field=source
  facet.field=subset
  facet.field=regulates_closure_label
  facet.field=is_obsolete
  q=alcoh*
  qf=annotation_class^3
  qf=annotation_class_label_searchable^5.5
  qf=description_searchable^1
  qf=comment_searchable^0.5
  qf=synonym_searchable^1
  qf=alternate_id^1
  qf=regulates_closure^1
  qf=regulates_closure_label_searchable^1
  json.wrf=jQuery22408697930584089234_1502132315699
  _=1502132315700



http://golr.berkeleybop.org/select
  defType=edismax
  qt=standard
  indent=on
  wt=json
  rows=10
  start=0
  fl=*,score
  facet=true
  facet.mincount=1
  facet.sort=count
  json.nl=arrarr
  facet.limit=25
  fq=document_category:"ontology_class"
  fq=source:"eco"
  facet.field=source
  facet.field=subset
  facet.field=regulates_closure_label
  facet.field=is_obsolete
  q=PCS*
  qf=annotation_class^3
  qf=annotation_class_label_searchable^5.5
  qf=description_searchable^1
  qf=comment_searchable^0.5
  qf=synonym_searchable^1
  qf=alternate_id^1
  qf=regulates_closure^1
  qf=regulates_closure_label_searchable^1
  json.wrf=jQuery22409720743503634419_1502204138303
  _=1502204138304

*/

  golrLookup(field, oldValue, val) {
    var golrURLBase = 'http://amigo-dev-golr.berkeleybop.org/select';

    var baseRequestParams = {
      defType: 'edismax',
      qt: 'standard',
      wt: 'json',
      rows: '10',
      start: '0',
      fl: '*,score',
      'facet': true,
      'facet.mincount': 1,
      'facet.sort': 'count',
      'facet.limit': '25',
      'json.nl': 'arrarr',
      // fq: 'isa_partof_closure:"' + whichClosure + '"',
      // q: 'annotation_class_label_searchable:*' + val + '*',
      packet: '1',
      callback_type: 'search',
      _: Date.now()
    };

    var requestParamsGP = Object.assign({}, baseRequestParams, {
      q: val + '*',
      'facet.field': 'category',
      fq: 'document_category:"general"',
      qf: [
        'entity^3',
        'entity_label_searchable^3',
        'general_blob_searchable^3'
      ],
    });

    var requestParamsMF = Object.assign({}, baseRequestParams, {
      q: val + '*',
      'facet.field': [
        'source',
        'subset',
        'regulates_closure_label',
        'is_obsolete'
      ],
      fq: [
        'document_category:"ontology_class"',
        'regulates_closure_label:"molecular_function"'
      ],
      qf: [
        'annotation_class^3',
        'annotation_class_label_searchable^5.5',
        'description_searchable^1',
        'comment_searchable^0.5',
        'synonym_searchable^1',
        'alternate_id^1',
        'regulates_closure_label_searchable^1'
      ],
    });

/*
http://golr.berkeleybop.org/select
  defType=edismax
  qt=standard
  indent=on
  wt=json
  rows=10
  start=0
  fl=*,score
  facet=true
  facet.mincount=1
  facet.sort=count
  json.nl=arrarr
  facet.limit=25
  fq=document_category:"ontology_class"
  fq=source:"eco"
  facet.field=source
  facet.field=subset
  facet.field=regulates_closure_label
  facet.field=is_obsolete
  q=PCS*
  qf=annotation_class^3
  qf=annotation_class_label_searchable^5.5
  qf=description_searchable^1
  qf=comment_searchable^0.5
  qf=synonym_searchable^1
  qf=alternate_id^1
  qf=regulates_closure^1
  qf=regulates_closure_label_searchable^1
  json.wrf=jQuery22409720743503634419_1502204138303
  _=1502204138304
*/
    var requestParamsEvidence = Object.assign({}, baseRequestParams, {
      q: val + '*',
      'facet.field': [
        'source',
        'subset',
        'regulates_closure_label',
        'is_obsolete'
      ],
      fq: [
        'document_category:"ontology_class"',
        'source:"eco"'
      ],
      qf: [
        'annotation_class^3',
        'annotation_class_label_searchable^5.5',
        'description_searchable^1',
        'comment_searchable^0.5',
        'synonym_searchable^1',
        'alternate_id^1',
        'regulates_closure^1',
        'regulates_closure_label_searchable^1'
      ],
    });

    let fieldToParams = {
      GP: requestParamsGP,
      MF: requestParamsMF,
      MFe: requestParamsEvidence
    };

    var requestParams = fieldToParams[field];
    // console.log('golrLookup', field, requestParams);
/*
  The following are experiments with using the Monarch /search ontology for AC.
  Unfortunately, the Monarch /search core doesn't seem to have as fine-grained closures
  needed for our purposes, but I may end up revisiting this, so I'm keeping the code around
  for a while. DBK
    var golrURLBaseImproved = 'https://solr.monarchinitiative.org/solr/search/select';
    var requestParamsImproved = {
      defType: 'edismax',
      qt: 'standard',
      wt: 'json',
      start: 0,
      rows: '15',
      fl: '*,score',
      'facet.mincount': 1,
      'facet.sort': 'count',
      'json.nl': 'arrarr',
      'facet.limit': '25',
      fq: 'category:"Phenotype"',
      // fq: 'isa_partof_closure:"' + whichClosure + '"',
      'facet.field': 'id',
      // fq: 'isa_partof_closure:"' + whichClosure + '"',
      // q: 'annotation_class_label_searchable:*' + val + '*',
      q: val + '+"' + val + '"',
      qf: [
    'label_searchable^1',
    'definition_searchable^1',
    'synonym_searchable^1',
    'iri_searchable^2',
    'id_searchable^2',
    'equivalent_iri_searchable^1',
    'equivalent_curie_searchable^1',
    'taxon_label_searchable^1',
    'taxon_label_synonym_searchable^1',
    'iri_std^3',
    'iri_kw^3',
    'iri_eng^3',
    'id_std^3',
    'id_kw^3',
    'id_eng^3',
    'label_std^2',
    'label_kw^2',
    'label_eng^2',
    'definition_std^1',
    'definition_kw^1',
    'definition_eng^1',
    'synonym_std^1',
    'synonym_kw^1',
    'synonym_eng^1',
    'category_std^1',
    'category_kw^1',
    'category_eng^1',
    'equivalent_iri_std^1',
    'equivalent_iri_kw^1',
    'equivalent_iri_eng^1',
    'equivalent_curie_std^1',
    'equivalent_curie_kw^1',
    'equivalent_curie_eng^1',
    'taxon_label_std^1',
    'taxon_label_kw^1',
    'taxon_label_eng^1',
    'taxon_label_synonym_std^1',
    'taxon_label_synonym_kw^1',
    'taxon_label_synonym_eng^1'
    ]
    };

    var requestParamsFromMonarchAC = {
      defType: 'edismax',
      qt: 'standard',
      indent: 'on',
      wt: 'json',
      start: 0,
      fl: '*,score',
      facet: true,
      'facet.mincount': 1,
      'facet.sort': 'count',
      'json.nl': 'arrarr',
      'facet.limit': '25',
      hl: true,
      'hl.simple.pre': '<em class="hilite">',
      'hl.snippets': '1000',
      'facet.field': 'id',
      q: val, // 'sedoheptulos+"sedoheptulos"',
      qf: [ 'label_searchable^1',
            'definition_searchable^1',
            'synonym_searchable^1',
            'iri_searchable^2',
            'id_searchable^2',
            'equivalent_iri_searchable^1',
            'equivalent_curie_searchable^1',
            'taxon_label_searchable^1',
            'taxon_label_synonym_searchable^1',
            'iri_std^3',
            'iri_kw^3',
            'iri_eng^3',
            'id_std^3',
            'id_kw^3',
            'id_eng^3',
            'label_std^2',
            'label_kw^2',
            'label_eng^2',
            'definition_std^1',
            'definition_kw^1',
            'definition_eng^1',
            'synonym_std^1',
            'synonym_kw^1',
            'synonym_eng^1',
            'category_std^1',
            'category_kw^1',
            'category_eng^1',
            'equivalent_iri_std^1',
            'equivalent_iri_kw^1',
            'equivalent_iri_eng^1',
            'equivalent_curie_std^1',
            'equivalent_curie_kw^1',
            'equivalent_curie_eng^1',
            'taxon_label_std^1',
            'taxon_label_kw^1',
            'taxon_label_eng^1',
            'taxon_label_synonym_std^1',
            'taxon_label_synonym_kw^1',
            'taxon_label_synonym_eng^1']
    };
*/

    var trusted = this.$sce.trustAsResourceUrl(golrURLBase);
    return this.$http.jsonp(
      trusted,
      {
        // withCredentials: false,
        jsonpCallbackParam: 'json.wrf',
        params: requestParams
      })
      .then(
        function(response) {
          var data = response.data.response.docs;
          var result = data.map(function(item) {
            if (field === 'GP') {
              return {
                id: item.entity,
                label: item.entity_label
              };
            }
            else {
              return {
                id: item.annotation_class,
                label: item.annotation_class_label
              };
            }
          });
          // console.log('GOLR success', response, requestParams, data, result);
          return result;
        },
        function(error) {
          console.log('GOLR error: ', golrURLBase, requestParams, error);
        }
      );
  }

  ensureUnderscores(curie) {
    return curie.replace(/:/, '_');
  }

  ensureColons(curie) {
    return curie.replace(/_/, ':');
  }

  inlineLookup(colName, oldValue, val/*, acEntry */) {
    var inlineBlock = this.parsedConfig.inline;

    var terms = [];
    if (inlineBlock && inlineBlock[colName]) {
      terms = inlineBlock[colName];
    }

    var matches = [];

    val = val || '';
    if (val !== null) {
      var valUpper = val.toUpperCase();
      _.each(terms, function(v) {
        if (v.label.toUpperCase().indexOf(valUpper) >= 0) {
          matches.push(v);
        }
      });
    }

    return new Promise(function(resolve/*, reject */) {
      setTimeout(function() {
        resolve(matches);
      }, 20);
    });

    // return matches;
  }
}
LookupService.$inject = ['$http', '$timeout', '$location', '$sce', '$rootScope'];



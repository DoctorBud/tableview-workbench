//
// TVController
//  Primary controller driving the table-mode
//

const each = require('lodash/forEach');
// import Lookup from './lookup';


// Noctua-specific
// var model = require('bbop-graph-noctua');

function getNodeLabel(node) {
  var label = '';
  if (node) {
    each(node.types(), function(in_type) {
      label += in_type._class_label +
                '\n(' + in_type._class_id + ')';
    });
  }

  return label;
}

function getNodeId(node) {
  var result = null;
  if (node) {
    each(node.types(), function(in_type) {
      result = in_type._class_id;
    });
  }

  return result;
}

const PredicateEnabledBy = 'RO:0002333';
const PredicatePartOf = 'BFO:0000050';
const PredicateOccursIn = 'BFO:0000066';

function idToAspectLabel(predicateId) {
  const knownAspects = {
    PredicateEnabledBy: 'F',
    PredicatePartOf: 'P',
    PredicateOccursIn: 'C'
  };
  return knownAspects[predicateId] || '?aspect?';
}

function idToPredicateLabel(id) {
  const knownPredicates = {
    'RO:0002333': 'enabled by',
    'BFO:0000050': 'part of',
    'BFO:0000066': 'occurs in'
  };
  return knownPredicates[id] || id;
}

function edgeToEvidence(graph, edge) {
  var result = {
    evidence: {
      id: null,
      label: ''
    },
    reference: '',
    with: ''
  };

  // console.log('edgeToEvidence', edge);
  var evidenceAnnotations = edge.get_annotations_by_key('evidence');
  if (evidenceAnnotations.length > 0) {
    var firstAnnotationId = evidenceAnnotations[0].value();
    var firstAnnotationNode = graph.get_node(firstAnnotationId);
    if (firstAnnotationNode) {
      console.log('...firstAnnotationId', firstAnnotationId);
      console.log('...firstAnnotationNode', firstAnnotationNode);
      result.evidence.id = getNodeId(firstAnnotationNode);
      result.evidence.label = getNodeLabel(firstAnnotationNode);
      console.log('...firstAnnotationNode result.evidence', result.evidence);

      let sources = firstAnnotationNode.get_annotations_by_key('source');
      let withs = firstAnnotationNode.get_annotations_by_key('with');
      // console.log('...sources', sources);
      // console.log('...withs', withs);
      result.reference = sources[0].value();
      result.with = withs[0].value();
      // console.log('...evidenceLabel', edge, firstAnnotationId, firstAnnotationNode);
    }
  }

  return result;
}


function graphToAnnotons(graph) {
  // graph.fold_evidence();
  // graph.fold_go_noctua(global_collapsible_relations);

  // First pass through the edges to locate the GPs

  var annotons = [];

  each(graph.all_edges(), function(e) {
    if (e.predicate_id() === PredicateEnabledBy) {
      let mfId = e.subject_id();
      let gpId = e.object_id();

      let annoton = {
        GP: null,
        MF: mfId,
        MFe: null,
        BP: null,
        BPe: null,
        CC: null,
        CCe: null
      };

      let mfEdgesIn = graph.get_edges_by_subject(mfId);
      each(mfEdgesIn, function(toMFEdge) {
        let predicateId = toMFEdge.predicate_id();
        let predicateLabel = idToPredicateLabel(e.predicate_id());
        let evidence = edgeToEvidence(graph, toMFEdge);

        let toMFObject = toMFEdge.object_id();
        if (predicateId === PredicateEnabledBy) {
          // console.log('......PredicateEnabledBy GP', toMFObject);
          annoton.GP = toMFObject;
          annoton.MFe = evidence;
        }
        else if (predicateId === PredicatePartOf) {
          // console.log('......PredicatePartOf BP', toMFObject);
          annoton.BP = toMFObject;
          annoton.BPe = evidence;
        }
        else if (predicateId === PredicateOccursIn) {
          // console.log('......PredicateOccursIn BP', toMFObject);
          annoton.CC = toMFObject;
          annoton.CCe = evidence;
        }
        else {
          console.log('......mfEdgesIn UNKNOWN PREDICATE', predicateId, predicateLabel, toMFEdge);
        }
      });
      annotons.push(annoton);
    }
  });

  // console.log('annotons', annotons);

  return annotons;
}


function annotonToTableRows(graph, annoton) {
  let result = [];

  let gp = graph.get_node(annoton.GP);
  let gpLabel = getNodeLabel(gp);
  let mf = graph.get_node(annoton.MF);
  let mfLabel = getNodeLabel(mf);
  let bp = graph.get_node(annoton.BP);
  let bpLabel = getNodeLabel(bp);
  let cc = graph.get_node(annoton.CC);
  let ccLabel = getNodeLabel(cc);

  result.push({
      Aspect: 'FPC',
      GP: gpLabel,
      Term: 'TERM',
      Evidence: 'EVIDENCE',
      Reference: 'REFERENCE',
      With: 'WITH',
      $$treeLevel: 0
  });
  result.push({
      Aspect: 'F',
      // GP: gpLabel,
      Term: mfLabel,
      Evidence: annoton.MFe.evidence,
      Reference: annoton.MFe.reference,
      With: annoton.MFe.with,
      $$treeLevel: 1
  });
  if (bp) {
    result.push({
        Aspect: 'P',
        // GP: gpLabel,
        Term: bpLabel,
        Evidence: annoton.BPe.evidence,
        Reference: annoton.BPe.reference,
        With: annoton.BPe.with,
        $$treeLevel: 1
    });
  }

  if (cc) {
    result.push({
        Aspect: 'C',
        // GP: gpLabel,
        Term: ccLabel,
        Evidence: annoton.CCe.evidence,
        Reference: annoton.CCe.reference,
        With: annoton.CCe.with,
        $$treeLevel: 1
    });
  }

  console.log('annotonToTableRows', annoton, result);

  return result;
}

function annotonxToTableRows(graph, annoton) {
  let result = [];

  let gpLabel = annoton.GP.label;
  let mfLabel = annoton.MF.label;

  result.push({
    Aspect: 'FPC',
    GP: gpLabel,
    Term: 'TERM',
    Evidence: 'EVIDENCE',
    Reference: 'REFERENCE',
    With: 'WITH',
    $$treeLevel: 0
  });
  result.push({
    Aspect: 'F',
    GP: gpLabel,
    Term: mfLabel,
    Evidence: annoton.MFe,
    Reference: annoton.MFe.reference,
    With: annoton.MFe.with,
    $$treeLevel: 1
  });
  if (annoton.BP) {
    let bpLabel = annoton.BP.label;
    result.push({
      Aspect: 'P',
      GP: gpLabel,
      Term: bpLabel,
      Evidence: annoton.BPe.evidence,
      Reference: annoton.BPe.reference,
      With: annoton.BPe.with,
      $$treeLevel: 1
    });
  }

  if (annoton.CC) {
    let ccLabel = annoton.CC.label;
    result.push({
      Aspect: 'C',
      GP: gpLabel,
      Term: ccLabel,
      Evidence: annoton.CCe.evidence,
      Reference: annoton.CCe.reference,
      With: annoton.CCe.with,
      $$treeLevel: 1
    });
  }

  console.log('annotonxToTableRows', annoton, result);

  return result;
}

function annotonsToTable(graph, annotons) {
  let result = [];

  each(annotons, function(annoton) {
    let annotonRows = annotonToTableRows(graph, annoton);

    result = result.concat(annotonRows);
  });

  return result;
}

module.exports = {
  graphToAnnotons: graphToAnnotons,
  annotonToTableRows: annotonToTableRows,
  annotonxToTableRows: annotonxToTableRows,
  annotonsToTable: annotonsToTable,
  getNodeLabel: getNodeLabel,
  idToPredicateLabel: idToPredicateLabel,
  idToAspectLabel: idToAspectLabel
};

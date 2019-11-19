var cy = cytoscape({

  container: $('#cy'), // container to render in

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  zoom: 1,
  pan: { x: 0, y: 0 }

});


var nodeCount = 0; //for id of node
var previous = null; //for creatine vertices

//adds node when double-clicked
$("#cy").dblclick(function (e) {
  let offset = cy.pan();
  cy.add({
    data: { id: ++nodeCount },
    position: { x: e.pageX - offset.x, y: e.pageY - offset.y }
  });
});

//phone doesn't have double-click
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  cy.on('taphold', 'node', function (e) {
    if (previous === null) {
      previous = e.target.id();
      return;
    }
  });
}

//removes right-clicked node
cy.on('cxttap', 'node, edge', function (e) {
  cy.remove(cy.$('#' + e.target.id()));
});

// create edge when 2 nodes are clicked
cy.on('tap', 'node', function (e) {
  if (previous === null) {
    previous = e.target.id();
    return;
  }

  cy.add({
    data: {
      id: previous + 'e' + e.target.id(),
      source: previous,
      target: e.target.id()
    }
  });

  previous = null;

//-----------gets edges of node
for(edge of e.target._private.edges) {
  console.log(edge.id());
}

});
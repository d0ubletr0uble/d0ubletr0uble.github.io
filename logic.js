//canvas initialization
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
                'width': '3',
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'label': 'data(label)'
            }
        }
    ],

    zoom: 1,
    pan: { x: 0, y: 0 }

});


var nodeCount = 0; //for id of node
var previous = null; //for creation of vertices

//adds node when double-clicked
$("#cy").dblclick(function(e) {
    let offset = cy.pan();
    cy.add({
        data: { id: ++nodeCount },
        position: { x: e.pageX - offset.x, y: e.pageY - offset.y },
    });
});

//phone doesn't have double-click so also adds node when tap-hold
cy.on('taphold', function(e) {
    let offset = cy.pan();
    cy.add({
        data: { id: ++nodeCount },
        position: { x: e.position.x, y: e.position.y }
    });
});

//removes right-clicked node
cy.on('cxttap', 'node, edge', function(e) {
    cy.remove(cy.$('#' + e.target.id()));
});

// create edge when 2 nodes are clicked
cy.on('tap', 'node', function(e) {
    if (previous === null) {
        previous = e.target.id();
        return;
    }


    let weight = prompt("Enter the weight for this edge", "1");

    if (weight == null || weight == "")
        weight = 1;

    cy.add({
        data: {
            id: previous + 'e' + e.target.id(),
            source: previous,
            target: e.target.id(),
            label: weight
        }
    });

    previous = null;
});

function beginSearch(e) {
    $(e).text('Select starting node');

    cy.removeListener('tap', 'node');

    cy.on('tap', 'node', function(n) {
        n.target.style('background-color', 'green');

    });

}


//todo .neighbourhood('edge or node') is defined
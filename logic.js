//canvas initialization
var cy = cytoscape({

    container: $("#cy"), // container to render in

    style: [ // the stylesheet for the graph
        {
            selector: "node",
            style: {
                "background-color": "#666",
                "label": "data(id)"
            }
        },

        {
            selector: "edge",
            style: {
                "width": "3",
                "line-color": "#ccc",
                "target-arrow-color": "#ccc",
                "target-arrow-shape": "triangle",
                "label": "data(label)"
            }
        }
    ],

    zoom: 1,
    pan: { x: 0, y: 0 }

});
//--

//node add
var nodeCount = 0; //sequentially
//adds node when double-clicked
$("#cy").dblclick(function(e) {
    let offset = cy.pan();
    cy.add({
        data: { id: ++nodeCount },
        position: { x: e.pageX - offset.x, y: e.pageY - offset.y },
    });
});

//phone doesn"t have double-click so also adds node when tap-hold
cy.on("taphold", function(e) {
    let offset = cy.pan();
    cy.add({
        data: { id: ++nodeCount },
        position: { x: e.position.x, y: e.position.y }
    });
});
//--

//remove right-clicked element (on phones 2 finger tap)
cy.on("cxttap", "node, edge", function(e) {
    cy.remove(cy.$("#" + e.target.id()));
});

{ //edge creation
    let previous = null; //to remember begining

    // create edge when 2 nodes are clicked
    cy.on("tap", "node", function(e) {
        if (previous == null) {
            previous = e.target.id();
            return;
        }

        do { //input edge weight
            var weight = parseInt(window.prompt("Enter the weight for this edge", "1"), 10);
        } while (isNaN(weight));

        cy.add({ //add new edge with specified weight
            data: {
                id: previous + "e" + e.target.id(),
                source: previous,
                target: e.target.id(),
                label: weight
            }
        });
        previous = null;
    });
} //--

{ //selecting START and END nodes
    let start = null;

    function beginSearch(button) {
        $(button).text("Select START");

        cy.removeListener("tap", "node");

        cy.on("tap", "node", function(node) {
            node.target.style("background-color", "green");
            if (start == null) {
                start = node.target.id();
                $(button).text("Select END");
            } else
                calculatePath(start, node.target.id());
        });

    }
} //--

function calculatePath(start, end) {
    let structures = reMapToAdjacencyStructure();
    let adjacencyNodes = structures[0];
    let adjacencyWeights = structures[1];

    console.log('selected start: ' + start + '\n' + 'selected end: ' + end);
}

function reMapToAdjacencyStructure() { //to use arrays instead of what is given
    let adjacencyNodes = [];
    let adjacencyWeights = [];

    for (let i = 0; i < nodeCount; i++) {
        let adjacentNodes = [];
        let adjacentWeights = [];
        cy.$id(i + 1).neighbourhood("node").forEach(
            n => {
                adjacentNodes.push(n.id()); //adjacent node
                adjacentWeights.push(cy.$id(i + 1).edgesWith(n).data().label); //weight of path to that node
            }
        );

        adjacencyNodes.push(adjacentNodes);
        adjacencyWeights.push(adjacentWeights);
    }
    return [adjacencyNodes, adjacencyWeights];
}
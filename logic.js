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
                "curve-style": "bezier",
                "width": "3",
                "line-color": "#ccc",
                "target-arrow-shape": "triangle",
                "arrow-scale": "1.5",
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
            } else {
                calculatePath(start, node.target.id());
                start = null;
            }
        });

    }
} //--



function calculatePath(start, end) {
    let structure = getAdjacencyStructure();
    let nodes = structure[0];
    let edges = structure[1];

    //initialization
    let prec = Array(nodes.length).fill(0);
    let d = Array(nodes.length).fill(Infinity);
    d[start - 1] = 0;
    prec[start - 1] = start;
    //--

    //Bellman-Ford algorythm
    for (let i = 0; i < nodes.length - 1; i++) { //i N-1 times
        for (let j = 0; j < nodes.length; j++) { //j nodes
            for (let k = 0; k < edges[j].length; k++) { //k edges
                let gretimas = nodes[j][k];
                let kainuoja = edges[j][k];
                if (d[gretimas - 1] > kainuoja + d[j]) {
                    d[gretimas - 1] = kainuoja + d[j];
                    prec[gretimas - 1] = j + 1;
                }
            }
        }
    }
    //--
    showResult(d, prec, start, end);
}

function showResult(d, prec, start, end) {
    let result = [];
    if (d[end - 1] != Infinity) {
        let node = end;
        while (node != start) {
            result.unshift(node);
            node = prec[node - 1];
        }
        result.unshift(start);

        console.log("result: " + result);
        console.log("d: " + d);
        console.log("prec: " + prec);


        for (const node of result) {
            cy.$id(node).style({
                "background-color": "green",
                "border-width": "2",
                "shape": "barrel"
            });
        }
    } else
        console.log("Path doen't exist :(");
}

function getAdjacencyStructure() { //to use arrays instead of what is given
    let adjacencyNodes = [];
    let adjacencyWeights = [];

    for (let i = 0; i < nodeCount; i++) {
        let adjacentNodes = [];
        let adjacentWeights = [];
        cy.$id(i + 1).neighbourhood(`edge[source="${i+1}"]`).forEach(
            n => {
                adjacentNodes.push(n.target().id()); //adjacent node
                adjacentWeights.push(n.data().label); //weight of path to that node
            }
        );

        adjacencyNodes.push(adjacentNodes);
        adjacencyWeights.push(adjacentWeights);
    }
    return [adjacencyNodes, adjacencyWeights];
}
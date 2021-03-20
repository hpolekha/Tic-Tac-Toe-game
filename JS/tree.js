/*
*    A tree diagram used d3.js library
*    This is done by following the example https://jsfiddle.net/augburto/YMa2y/
*    Used for debugging the minimax algoritm
*/

//
// Default root for debug
//
let root = {
    "row1": "x x x",
    "row2": "o o o",
    "row3": "x x x",
    "heuristic": "3",
    "childrenMax":"",
    "children": []
};

//
// Build new tree
//
function Tree(root){
    let margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    }
        //width = 960 - margin.right - margin.left,
        //height = ;

    let rectW = 60,
        rectH = 60,
        duration = 750;
   let i = 0;

    let tree = d3.layout.tree().nodeSize([70, 40]);
    let diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x + rectW / 2, d.y + rectH / 2];
        });

    // Append tree diagram
    let svg = d3.select("#treeBody").append("svg").attr("id", "treeDiagram")
    .attr("width", 2000).attr("height", 2000)
        .call(zm = d3.behavior.zoom().scaleExtent([1, 1]).on("zoom", redraw)).append("g")
        .attr("transform", "translate(" + (window.innerWidth/2 - rectW/2) + "," + 100 + ")");



    zm.translate([window.innerWidth/2 - rectW/2, 100]);

    root.x0 = 0;
    root.y0 = (800 - margin.top - margin.bottom) / 2;

    // Prevent leaf overlay
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    root.children.forEach(collapse);
    update(root);

    d3.select("#treeBody").style("height", "800px");

    // Update tree
    function update(source) {

        // Get new tree layout
        let nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Fixed depth normalization
        nodes.forEach(function (d) {
            d.y = d.depth * 180;
        });

        // Update the node
        let node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        let nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            })
            .on("click", click);

        nodeEnter.append("rect")
            .attr("width", rectW)
            .attr("height", rectH)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("x", rectW / 2)
            .attr("y", 30 / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                //console.log(d.name);
                return d.row1;
            });
        nodeEnter.append("text")
            .attr("x", rectW / 2)
            .attr("y", 30 / 1.2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                //console.log(d.name);
                return d.row2;
            });
            nodeEnter.append("text")
            .attr("x", rectW / 2)
            .attr("y", 30 / 0.9)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                //console.log(d.name);
                return d.row3;
            });
            nodeEnter.append("text")
            .attr("x", rectW / 2)
            .attr("y", 30 / 0.65)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                //console.log(d.name);
                return d.heuristic;
            });
            nodeEnter.append("text")
            .attr("x", rectW / 2)
            .attr("y", 30 / 0.53)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                let nodesCount = 0;
               if( d._children != undefined )
                    nodesCount = d._children.length;
                return nodesCount +  "/"+ d.childrenMax;
            });


        // Nodes transition to their new position.
        let nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        nodeUpdate.select("rect")
            .attr("width", rectW)
            .attr("height", rectH)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Exiting nodesransition to the parent's new position.
        let nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();

        nodeExit.select("rect")
            .attr("width", rectW)
            .attr("height", rectH)
            //.attr("width", bbox.getBBox().width)""
            //.attr("height", bbox.getBBox().height)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        nodeExit.select("text");

        // Update the path.links
        let link = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });

        // Links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("x", rectW / 2)
            .attr("y", rectH / 2)
            .attr("d", function (d) {
                let o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Links transition to their new position
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Exiting nodes transition to the parent's new position
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                let o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Hide old positions for the transition
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Show node children onclick.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    //Redraw tree for zoom
    function redraw() {
        //console.log("here", d3.event.translate, d3.event.scale);
        svg.attr("transform",
            "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
    }
}

//
// Delete tree
//
function removeTree(){
    d3.select("#treeBody").select("svg").remove();
}

//
// Draw new tree
//
function updateTree(root){
    removeTree();
    Tree(root);
}

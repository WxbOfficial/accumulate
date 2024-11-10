import DagreOperationEvents from './dagre_operation_evnets.js';

export default class DagreOperation{

	constructor( container ){

		this.g = new dagre.graphlib.Graph({compound:true})
				.setGraph({})
				.setDefaultEdgeLabel(function() { return {}; });

		this.dagreOperationEvents = new DagreOperationEvents( this );

		this.svgSelection = d3.select(container)
				.append("svg")
				.attr("width", '100%')
				.attr("height", '100%')

		// path
		this.svgSelection.append("defs")
				.append("marker")
					.attr("id", "arrowhead")
					.attr("viewBox", "0 0 10 10")
					.attr("refX", "8")
					.attr("refY", "5")
					.attr("markerUnits", "strokeWidth")
					.attr("markerWidth", "8")
					.attr("markerHeight", "5")
					.attr("orient", "auto")
					.attr("style", "fill: #333")
				.append("path")
					.attr("d", "M 0 0 L 10 5 L 0 10 z");

		this.svgSelection.on('contextmenu', this.dagreOperationEvents.svgSelectionContextmenu );


		this.gNodes = this.svgSelection.append('g')
						.attr("class", "nodes")
						.attr("pointer-events", "all");

		this.gEdges = this.svgSelection.append('g')
						.attr("class", "links")
						.attr("pointer-events", "all");
	}

	addNode( node ){

		this.g.setNode( node.id, node );
		this.updateView();
	}

	delNode( nodeId ){

		this.g.removeNode( nodeId );
		this.updateView();
	}

	// d3
	updateView(){

		const nodeData = Object.values( this.g._nodes );
		const edgesData = Object.values( this.g._edgeLabels );

		const node = this.gNodes.selectAll("g")
			.data( nodeData, (d) => {
				return d.id;
			}).join((enter)=>{
				return createRect(enter);
			});

		const edge = this.gEdges.selectAll('path')
			.data(edgesData)
			.join((enter)=>{
				return createPath(enter);
			});

		dagre.layout(this.g);

		node
			.attr("transform", function(d) {

				return "translate(" +
					(d.x - d.width / 2) +
					"," +
					(d.y - d.height / 2) +
					")";
			})
			.select('rect')
				.attr('width', function(d){
					return d.width;
				})
				.attr('height', function(d){
					return d.height;
				});

		edge.attr("d", function(d) {
			return (
				d3.line()
					.x((d) => { return d.x })
					.y((d) => { return d.y })
					.curve(d3.curveBasis)
			)(d.points);
		});
	}

	parseJSON( json ){

	}

	toJSON(){

	}
}

function createPath(enter){
	const
		edge = enter
			.append("g")
			.attr("class", "edge"),

		path = edge.append("path")
			.attr("class", "link")
			.attr("id", (d)=>{ return d.label })
			.attr("marker-end", "url(#arrowhead)");

	return path;
}

function createRect(enter, nodeEvents){
	let
		nodePadding = [10, 20, 10, 20],

		node = enter.append("g")
			.attr("class", function(d){
				if( d.isParent ){
					return "node parent"
				}
				return "node"
			})
			.attr("id", function(d) { return d.label }),

		rects = node.append("rect"),

		labels = node.append("text")
								.attr("text-anchor", function(d){
									if( d.isParent ){
										return "start";
									}
									return "middle";
								})
								.attr("x", 0);

	labels
		.append("tspan")
			.attr("x", 0)
			.attr("dy", "1em")
			.text(function(d) { return d.label; });

	labels.each(function(d) {

		var bbox = this.getBBox();
		d.bbox = bbox;

		if( !d.isParent ){

			d.width = bbox.width + nodePadding[1] + nodePadding[3];
			d.height = bbox.height + nodePadding[0] + nodePadding[2];
		}
	});

	rects
		.attr("width", function(d) { return d.width; })
		.attr("height", function(d) { return d.height; });

	rects
		.attr("x", function(d) {
			if( d.isParent ){
				return 0;
			}
			return 0;
		})
		.attr("y", function(d) {
			if( d.isParent ){
				return 0;
			}
			return 0;
		})

	labels
		.attr("y", function(d) {
			if( d.isParent ){
				return 0;
			}
			return nodePadding[0];
		})
		.selectAll('tspan')
			.attr("x", function(d) {
				if( d.isParent ){
					return 0;
				}
				return d.bbox.width / 2 + nodePadding[1];
			});

	return node;
}



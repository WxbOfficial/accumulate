
export default function createRect(enter, nodeEvents){
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
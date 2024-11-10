
export function initPath( svgSelection ){

	svgSelection.append("defs")
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
}

export default function createPath(enter){
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
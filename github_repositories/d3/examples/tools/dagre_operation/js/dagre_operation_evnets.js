
const eventsName = [
	'svgSelectionContextmenu',
	'nodeClick',
];

export default class DagreOperationEvents{

	constructor( dagreOperation ){

		this.dagreOperation = dagreOperation;

		eventsName.forEach(( eventName)=>{
			this[eventName] = this['_' + eventName].bind(this.dagreOperation)
		});
	}

	_svgSelectionContextmenu(e){
		e.preventDefault();
	}

	_nodeClick(e){

	}
}
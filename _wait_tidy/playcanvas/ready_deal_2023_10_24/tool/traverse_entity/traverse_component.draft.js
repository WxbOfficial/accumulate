
export default function traverseComponent(objCom, keyName, com){
	let c = {
		type: `${keyName}Component`,
	}
	objCom.push(c);
}
/*
 Copyright 2011 Abdulla Abdurakhmanov
 Original sources are available at https://code.google.com/p/x2js/

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

function X2JS() {

	var DOMNodeTypes = {
		ELEMENT_NODE : 1,
		TEXT_NODE    : 3,
		DOCUMENT_NODE : 9
	}

	function parseDOMChildren( node ) {
	
	
		if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
			var result = new Object;
			var child = node.firstChild; 
			var childName = child.localName;
			if(childName == null)
				childName = child.nodeName;
			
			result[childName] = parseDOMChildren(child);
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
			var result = new Object;
			result._cnt=0;
			
			var nodeChildren = node.childNodes;
			
			// Children nodes
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren[cidx];
				var childName = child.localName;
				if(childName == null)
					childName = child.nodeName;
				
				result._cnt++;
				if(result[childName] == null) {
					result[childName] = parseDOMChildren(child);
					result[childName+"_asArray"] = new Array();
					result[childName+"_asArray"][0] = result[childName];
				}
				else {
					if(result[childName] != null) {
						if( !(result[childName] instanceof Array)) {
							var tmpObj = result[childName];
							result[childName] = new Array(nodeChildren.length);
							result[childName][0] = tmpObj;
							
							result[childName+"_asArray"] = result[childName];
						}
					}
					var aridx = 0;
					while(result[childName][aridx]!=null) aridx++;
					(result[childName])[aridx] = parseDOMChildren(child);
				}			
			}
			
			// Attributes
			for(var aidx=0; aidx <node.attributes.length; aidx++) {
				var attr = node.attributes[aidx];
				result._cnt++;
				result["_"+attr.name]=attr.value;
			}
			
			if( result._cnt == 1 && result["#text"]!=null  ) {
				result = result["#text"];
			} 
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.TEXT_NODE) {
			return node.nodeValue;
		}	
	}
	
	function startTag(jsonObj, element, attrList, closed) {
		var resultStr = "<"+element;
		if(attrList!=null) {
			for(var aidx = 0; aidx < attrList.length; aidx++) {
				var attrName = attrList[aidx];
				var attrVal = jsonObj[attrName];
				resultStr+=" "+attrName.substr(1)+"='"+attrVal+"'";
			}
		}
		if(!closed)
			resultStr+=">";
		else
			resultStr+="/>";
		return resultStr;
	}
	
	function endTag(elementName) {
		return "</"+elementName+">"
	}
	
	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	
	function parseJSONTextObject ( jsonTxtObj ) {
		var result ="";
		if(jsonTxtObj["#text"]!=null) {
			result+=jsonTxtObj["#text"];
		}
		else {
			result+=jsonTxtObj;
		}
		return result;
	}
	
	function parseJSONObject ( jsonObj ) {
		var result = "";	
		
		for( var it in jsonObj  ) {
						
			if(endsWith(it.toString(),("_asArray")) || it.toString()[0]=="_")
				continue;
			
			var subObj = jsonObj[it];						
			
			var attrList = [];
			for( var ait in subObj  ) {
				if(ait.toString()[0]=="_") {
					attrList.push(ait)
				}
			}						
			
			if(subObj!=null && subObj instanceof Object && subObj["#text"]==null) {
				
				if(subObj instanceof Array) {
					var arrayOfObjects = true;
					if(subObj.length > 0) {
						arrayOfObjects = subObj[0] instanceof Object;
					}
					else {
						result+=startTag(subObj, it, attrList, true);
					}
						
					for(var arIdx = 0; arIdx < subObj.length; arIdx++) {						
						if(arrayOfObjects)
							result+=parseJSONObject(subObj[arIdx]);
						else {
							result+=startTag(subObj, it, attrList, false);
							result+=parseJSONTextObject(subObj[arIdx]);
							result+=endTag(it);
						}
					}
				}
				else {
					result+=startTag(subObj, it, attrList, false);
					result+=parseJSONObject(subObj);
					result+=endTag(it);
				}
			}
			else {
				result+=startTag(subObj, it, attrList, false);
				result+=parseJSONTextObject(subObj);
				result+=endTag(it);
			}
						
		}
		
		return result;
	}

	this.xml2json = function (xmlDoc) {
		return parseDOMChildren ( xmlDoc );
	}
	
	this.xml_str2json = function (xmlDocStr) {
		var parser=new DOMParser();
		var xmlDoc=parser.parseFromString(xmlDocStr,"text/xml");
		return this.xml2json(xmlDoc);
	}

	this.json2xml_str = function (jsonObj) {
		return parseJSONObject ( jsonObj, true );
	}

	this.json2xml = function (jsonObj) {
		var parser=new DOMParser();
		var xmlStr = this.json2xml_str (jsonObj);
		return parser.parseFromString( xmlStr, "text/xml" );
	}	
}

var x2js = new X2JS();
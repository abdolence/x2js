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
	function parseDOMChildren( node ) {
	
		var DOMNodeTypes = {
			ELEMENT_NODE : 1,
			TEXT_NODE    : 3,
			DOCUMENT_NODE : 9
		}
	
		if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
			var result = new Object;
			result[node.firstChild.nodeName] = parseDOMChildren(node.firstChild);
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
			var result = new Object;
			result["_cnt"]=0;
			
			var nodeChildren = node.childNodes;
			
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren[cidx];
				result._cnt++;
				if(result[child.nodeName] == null) {
					result[child.nodeName] = parseDOMChildren(child);
					result[child.nodeName+"_asArray"] = new Array();
					result[child.nodeName+"_asArray"][0] = result[child.nodeName]; 						
				}
				else {
					if(result[child.nodeName] != null) {
						if( !(result[child.nodeName] instanceof Array)) {
							var tmpObj = result[child.nodeName];
							result[child.nodeName] = new Array(nodeChildren.length);
							result[child.nodeName][0] = tmpObj;
							
							result[child.nodeName+"_asArray"] = result[child.nodeName]; 						
						}
					}
					var aridx = 0;
					while(result[child.nodeName][aridx]!=null) aridx++;
					(result[child.nodeName])[aridx] = parseDOMChildren(child);
				}			
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
	
	function startTag(elementName, tns, tagged) {
		if(tagged) {
			if(tns == null) {
				return "<"+elementName+">";
			}
			else {
				return "<"+elementName+" tns=\""+tns+"\">";
			}				
		}
		else
			return "";
	}
	
	function endTag(elementName, tagged) {
		if(tagged)
			return "</"+elementName+">"
		else
			return "";
	}
	
	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	
	function parseJSONObject ( jsonObj, tagged ) {
		var result = "";	
		var jsonObjTNS = null;
		for( var it in jsonObj  ) {
			if(it=="_tns" || endsWith(it.toString(),("_asArray")))
				continue;
			var subObj = jsonObj[it];
			if(subObj!=null && subObj instanceof Object) {
				if(subObj instanceof Array) {
					for(var arIdx = 0; arIdx < subObj.length; arIdx++) {
						result+=startTag(it, jsonObjTNS, tagged);
						arrayTagging = subObj[arIdx] instanceof Object;
						result+=parseJSONObject(subObj[arIdx], arrayTagging);
						result+=endTag(it, tagged);
					}
				}
				else {
					jsonObjTNS = subObj["_tns"];				
					result+=startTag(it, jsonObjTNS, tagged);
					result+=parseJSONObject(subObj, true);
					result+=endTag(it, tagged);
					jsonObjTNS = null;
				}
			}
			else
			if(subObj instanceof String || typeof (subObj) == "string") {
				result+=startTag(it, jsonObjTNS, tagged);			
				result+=subObj;
				result+=endTag(it, tagged);			
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
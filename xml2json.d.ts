/*
Author: Dileep Miriyala
Last updated on : 05-Sep-2017 20:30:00EST
*/
declare type X2JSConfig = {
    attributePrefix?: string;
    emptyNodeForm?: string;
    enableToStringFunc?: boolean;
    arrayAccessFormPaths?: string[];
    skipEmptyTextNodesForObj?: boolean;
    stripWhitespaces?: boolean;
    datetimeAccessFormPaths?: string[];
    useDoubleQuotes?: boolean;
    xmlElementsFilter?: string[];
    keepCData?: boolean;
}
declare class X2JS {
    constructor();
    constructor(config: X2JSConfig);
    xml_str2json(xmlText: string): Object;
    json2xml_str(json: Object): string;
}
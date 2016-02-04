

//-----------
// test data
//-----------
var testData = {
    getXmlString: function () {
        return "<MyOperation myAttr='SuccessAttrValue'>" +
            "<testdt>2002-10-10T12:00:00-05:00</testdt>" +
            "<ctest><![CDATA[Hello world!]]></ctest>" +
            "<description test-attr='hey'>&lt; --&gt; &amp;lt;</description>" +
        "</MyOperation>";
    },
    getJsonObj: function(){
        var x2js = new X2JS();
        return x2js.xml_str2json(testData.getXmlString());
    }
}

QUnit.test("null attributes should be excluded from the xml document", function (assert) {

    // get test data and modify attribute
    var jsonObj = testData.getJsonObj();
    jsonObj.MyOperation._myAttr = null;

    // transform to xml string
    var newXmlString = (new X2JS()).json2xml_str(jsonObj);

    // assert that attribute is not included in xml string
    assert.ok(newXmlString.indexOf("<MyOperation>") === 0, "Attribute has been deleted from node");
});

QUnit.test("undefined attributes should be excluded from the xml document", function (assert) {

    // get test data and modify attribute
    var jsonObj = testData.getJsonObj();
    jsonObj.MyOperation._myAttr = undefined;

    // transform to xml string
    var newXmlString = (new X2JS()).json2xml_str(jsonObj);

    // assert that attribute is not included in xml string
    assert.ok(newXmlString.indexOf("<MyOperation>") === 0, "Attribute has been deleted from node");
});

QUnit.test("empty string attributes should be included in the xml document", function (assert) {

    // get test data and modify attribute
    var jsonObj = testData.getJsonObj();
    jsonObj.MyOperation._myAttr = "";

    // transform to xml string
    var newXmlString = (new X2JS()).json2xml_str(jsonObj);

    // assert that attribute is not included in xml string
    assert.ok(newXmlString.indexOf("<MyOperation myAttr=''>") === 0, "Attribute is included and empty");
});
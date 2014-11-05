x2js
====

x2js clone for the GIT world. 
Original sources, issue tracker and mercurial repository available at http://code.google.com/p/x2js

### 1.1.8
- attributePrefix can be configured for receive a void string ''
- keepCdata is a new config param which is true by default for keep the previous behaviour. Set to false it allow the node with a simple cdata to become automatically a property and not a property __cdata in a property.

Example:

```
<root>
<toto><![CDATA[Hello world!]]></toto>
</root>
```

become
```
{"root":{"toto":"Hello world!"}}
```

instead of
```
{"root":{"toto":{"__cdata":"Hello world!"}}}
```

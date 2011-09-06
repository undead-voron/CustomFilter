var Util = {};
Util.regExpAmp = new RegExp('&','g'); // &amp;
Util.regExpLt = new RegExp('<','g'); // &lt;
Util.regExpGt = new RegExp('>','g'); // &gt;
Util.escapeHTML = function (str)
{
	return str
	.replace(Util.regExpAmp,'&amp;')
	.replace(Util.regExpGt, '&gt;')
	.replace(Util.regExpLt, '&lt');
};

Util.getElementsByXPath = function (xpath)
{
	var list = new Array();
	var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
	var node;
	while (node = result.iterateNext()) 
	{
		list.push(node);
	}
	return list;
};

Util.shorten = function (text, limit)
 {
 	if (text.length<limit) return text;
	return text.substring(0, limit) + '...';
 };
Util.getRelativeElementsByXPath = function(targetNode, xpath)
{
	var list = new Array();
	try 
	{
		var result = document.evaluate(xpath, targetNode, null, XPathResult.ANY_TYPE, null);
		var node;
		
		while (node = result.iterateNext()) 
		{
			list.push(node);
		}
	} 
	catch (e) 
	{
		console.log(e)
	}
	return list;
};
Util.arrayContains = function (array, str) 
{
	for (var i=0, l=array.length; i<l; i++) if (str==array[i].xpath) return true;
	return false;
};


Util.isEmpty = function (str) 
{
	return (null==str || ''==str);
};

Util.notEmpty = function (str)
{
	return !Util.isEmpty(str);
}
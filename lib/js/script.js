/// <reference path="/imagedetect.js">
/// <reference path="/runeappslib.js">
/// <reference path="/alt1lib.js">
/// <reference path="/imagelibs/dialogfull.js">

var readerO = new DialogFullReader();
var cureUI = new cureSeekerInterface();
var version = "2.0.0";
function message(s) {
	box = promptbox2({ width: 325, title: "Message", style: popupFrame, stylesheets: [] }, [{t:'text', text: s}, { t:'h/11', attr: { rel: 'buttoncontainer'}}, { t:'subregion/1', attr: { rel: 'button', col:'blue'}},{ t:'button:ok',text: 'Ok'}]);
	box.ok.onclick = function() {
		box.frame.close();
		cureUI = new cureSeekerInterface();
		cureUI.init();
	}
}
function start() {
	a1lib.identifyUrl("appconfig.json");
	qw(PasteInput);
	PasteInput.listen(pasted, function (e) {
		if(setting("table"))
			elid("output").innerText = e;
		else {
			message(e);
		}
	});
	loadStorage();
	if (window.alt1 && window.alt1.permissionPixel) { setSetting('alt1Detected', true); } else { setSetting('alt1Detected', false); }
	qw(setting("version"), version);
	if(setting("version") != version) {
		setSetting('version', version);
		setSetting('activemode', 0);
	}
	
	cureUI.init();
					
	/*window.addEventListener("blur", blur);
	window.addEventListener("focus", focus);
	if (!window.alt1) {
		elid("solvepaste").style.display = "block";
		elid("unlockbutton").style.display = "none";
		if (!document.hasFocus()) { blur(); }
		elid("output").innerText = "Paste a screenshot with the answer options visible.";
	} else {
	}*/
}
var settings = {
	version: "1.0.0",
	table: false,
	icons: true,
	tooltip: true,
	alt1Detected: false,
	debug: false,
	activemode: 0
};
var settingsVar = [
	{ setting: 'table', name: 'Full Table', tooltip: 'Show full table or minimal information', vars: [true, false]},
	{ setting: 'icons', name: 'Show Icons', tooltip: 'Toggle icons shown on table', vars: [true, false]},
	{ setting: 'tooltip', name: 'Tooltips', tooltip: 'Toggle showing response on hover of box', vars: [true, false] },
	{ setting: 'debug', name: 'Debug', tooltip: 'Toggle debug', vars: [true, false] }
]

function setSetting(a, v) {
	if(v == "true") v = true;
	if(v == "false") v = false;
	qw(a,v);
	settings[a] = v;
	saveStorage();	
	qw(settings);
	return settings;
}
function setting(a) {
	if(a) return settings[a];
	return settings;
}
function saveStorage() {
	localStorage.cureSeeker_settings = jsonEncode(settings);
}
function loadStorage() {
	var settingsImport=jsonDecode(localStorage.cureSeeker_settings);
	if (settingsImport) {
		for (var a in settingsImport) {
			if (typeof settings[a] != "undefined") { settings[a] = settingsImport[a]; }
		}
	}
	qw(settings);
}

function ifDebug() {
	if(!setting("debug")) return false;
	for(a in arguments) {
		qw(arguments[a]);
	}
	return true;
}
onPageReady(start);

function focus() {
	elid("solvepaste").classList.remove("blur");
}

function blur() {
	if (document.hasFocus()) { return; }
	elid("solvepaste").classList.add("blur");
}

function pasted(i) {
	var imgref = new ImgRefCtx(i);
	qw(imgref);
	solve(imgref);
}
function findBody(str) {
	var p=["head","eyes","legs","stomach"]
	return p.indexOf(str);
}
function findDisease(str) {
	var d=["flu","curse","dry-nose","wooting-cough","foot-in-mouth","bone-rattle"]
	return d.indexOf(str);
}
function getDisease(str) {
	var d={
		"flu":"Flu treatment",
		"curse":"Curse treatment",
		"dry-nose":"Dry nose treatment",
		"wooting-cough":"Wooting cough treatment",
		"foot-in-mouth":"Foot-in-mouth treatment",
		"bone-rattle":"Bone rattle treatment"
	};
	return d[str];
}
var count = 1;
function solve(img) {
	if(box) return;
	setSetting('activemode', 2); 
	if (!img && !(img = a1lib.bindfullrs())) {
		if(setting("table"))
			elid("output").innerHTML = "Need pixel permission.";
		else
			message("Need pixel permission.");	
		return;
	}
	if (!readerO.find(img)) {
		qw("here !readerO.find(img)");
		if(setting("table"))
			elid("output").innerHTML = "Disease dialog not found, click the button when you have selected a body part in-game.";
		else {
			message("Disease dialog not found, click the button when you have selected a body part in-game.");
			return;
		}
	} else {
		qw("here readerO.find(img)");
	}

		
	var output = readerO.read(img);
	if(cureUI.els.diseaseMinimal.EOF && output.text) {
		cureUI = new cureSeekerInterface(); 
		cureUI.init();	
	}
	ifDebug("Reader: ",output);
	if(setting("alt1Detected") && output.opts && (cureUI.els.diseaseMinimal.known != "" || cureUI.els.diseaseMinimal.steps.length == 4)) {
		ifDebug("Reader: Title: "+output.title+" Opts:", output.opts);
		var bestans = false;
		var opts = output.opts;
		if(cureUI.els.diseaseMinimal.known != "") {
			for (a in opts) {
				var opt = opts[a];
				if(opt.str == getDisease(cureUI.els.diseaseMinimal.known)) {
					alt1.overLayRect(a1lib.mixcolor(0, 255, 0), opt.buttonx, opt.y - 6, opt.w, 14, 10000, 2);
				}
			}
		} else if(cureUI.els.diseaseMinimal.steps.length == 4) {
			for (a in opts) {
				var opt = opts[a];
				for(b in cureUI.els.diseaseMinimal.steps) {
					var step = cureUI.els.diseaseMinimal.steps[b];
					if(step.symptoms.length == 1) continue;
					for(c in step.symptoms) {
						var symptom = step.symptoms[c];
						if(opt.str == getDisease(symptom)) {
							alt1.overLayRect(a1lib.mixcolor(0, 255, 0), opt.buttonx, opt.y - 6, opt.w, 14, 10000, 2);
						}
					}
				}
			}
		}
	} else if(output.text) {
		output = output.text.join(" ");
		ifDebug("Reader Text: ",output);
		if(setting("table")) {
			var a, b, c, d;
			for(a in bodyparts) {
				if(output.includes(bodyparts[a].t)) {
					ifDebug("Output BodyPart: "+bodyparts[a].type)
					var b = elid(bodyparts[a].type);
					b.className = "checked";
					for(c in bodyparts[a].disease) {
						var d = bodyparts[a].disease[c];
						
						if(output.includes(d.t)) {
							if(d.d == "all") {
								for (var i = 0; i < 6; i++) {
									cureUI.els.cureTable.rows[i].cells[findBody(bodyparts[a].type)+1].setAttribute("class", "fine tooltip");
									cureUI.els.cureTable.rows[i].cells[findBody(bodyparts[a].type)+1].innerHTML = "&#9940;";
									cureUI.els.cureTable.rows[i].cells[findBody(bodyparts[a].type)+1].appendChild(eldiv('tooltiptext tooltip-top '+bodyparts[a].type, {tag:'span'}, [output]));
								}
							} else {
								ifDebug("Contains: " + d.t+ "("+output +")");
								qw(findDisease(d.d));
								qw(cureUI.els.cureTable.rows);
			
								cureUI.els.cureTable.rows[findDisease(d.d)].cells[findBody(bodyparts[a].type)+1].setAttribute("class", "has tooltip");
								cureUI.els.cureTable.rows[findDisease(d.d)].cells[findBody(bodyparts[a].type)+1].innerHTML = "&#10004;";
								cureUI.els.cureTable.rows[findDisease(d.d)].cells[findBody(bodyparts[a].type)+1].appendChild(eldiv('tooltiptext tooltip-top '+bodyparts[a].type, {tag:'span'}, [output]));
							}
						}
					}
				}
			}
			elid("output").innerHTML = output;
		} else {
			var disease = "";
			var symptoms = []
			for(a in bodyparts) {
				var body = bodyparts[a];
				if(output.includes(bodyparts[a].t)) {
					ifDebug("Body Part: "+ body.type);
					disease = body.type;
					for(c in body.disease) {
						var d = body.disease[c];
						if(output.includes(d.t)) {
							ifDebug("Contains: " + d.t+ "("+output +")");
							symptoms.push(d.d);
						}
					}
				}
			}
			qw(symptoms);
			if(symptoms.length == 1 && symptoms[0] != "all") {
				cureUI.els.diseaseMinimal.known = symptoms[0];
				known = true;
			} else if(symptoms.length > 0){
				var dupe = false;
				for(d in cureUI.els.diseaseMinimal.steps) {
					if(cureUI.els.diseaseMinimal.steps[d].disease == disease)
						dupe = true;
				}
				if(dupe) {
					box = promptbox2({ width: 275, title: "Body Part already checked?", style: popupFrame, stylesheets: [] }, [{t:'text', text: 'Body Part has already been checked would you like to reset progress?'}, { t:'h/1111', attr: { rel: 'buttoncontainer'}}, { t:'subregion/1', attr: { rel: 'button', col:'blue'}},{ t:'button:yes',text: 'Reset'}, { t:'subregion/1', attr: { rel: 'button', col:'green'}}, {t:'button:no',text: 'Overwrite'}]);
					box.no.onclick = function() {
						for(d in cureUI.els.diseaseMinimal.steps) {
							if(cureUI.els.diseaseMinimal.steps[d].disease == disease)
								cureUI.els.diseaseMinimal.steps[d] = {disease: disease, symptoms};
						}
						box.frame.close();
						cureUI.draw();
					}
					box.yes.onclick = function() {
						box.frame.close();
						cureUI = new cureSeekerInterface();
						cureUI.init();
					}
				} else {
					cureUI.els.diseaseMinimal.steps.push({disease: disease, symptoms});
				}
			} else {
				box = promptbox2({ width: 275, title: "Missing Symptom", style: popupFrame, stylesheets: [] }, [{t:'text', text: output}, { t:'h/1111', attr: { rel: 'buttoncontainer'}}, { t:'subregion/1', attr: { rel: 'button', col:'blue'}},{ t:'button:report',text: 'Report'}, { t:'subregion/1', attr: { rel: 'button', col:'green'}}, {t:'button:cancel',text: 'Cancel'}]);
				box.report.onclick = function() {
					var xmlhttp = new XMLHttpRequest();
					str = "message=" + encodeURIComponent(output);
					xmlhttp.open("POST","send.php", true);
					xmlhttp.onreadystatechange=function(){
						qw(xmlhttp.responseText);
					    if (xmlhttp.readyState == 4){
					        if(xmlhttp.status == 200){
					            alert (xmlhttp.responseText);
					        }
					    }
					};
					xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xmlhttp.send(str);
					box.frame.close();
					cureUI.draw();
				}
				box.cancel.onclick = function() {
					box.frame.close();
					cureUI = new cureSeekerInterface();
					cureUI.init();
				}
			}
		}
		cureUI.draw();
	}
}

function alt1onrightclick() {
	elid("unlockbutton").classList.add("fakeactive");
	setTimeout(function () { solve(); elid("unlockbutton").classList.remove("fakeactive"); }, 50);
}
function updateTableHTML(table, myArray) {
    var tableBody = document.getElementById(table);

    // Reset the table
    tableBody.innerHTML = "";

    // Build the new table
    for(a in myArray) {
    	var row = myArray[a];
    	var newRow = null
    	qw(row);
    	if(tableBody.rows.length < a) {
	        newRow = document.createElement("tr");
	    } else {
	    	newRow = tableBody.rows[a];
	    }
        
        tableBody.rows[a] = newRow;
    }
    return tableBody;
}
function setTooltips(el) {
	$(el).tooltipster({
		functionInit: function (instance, helper) {
	    	if(!$(helper.origin).attr('data-tooltip-content')) return;
	    	var crewM = $(helper.origin).attr('data-tooltip-content').split('-');
	    	var selected = pCrew.getCrew(crewM[0], crewM[1]);
			var frag = eldiv('tooltip_content', [
	    		eldiv({id:'crewTooltip'}, [
	    			eldiv('crewBody', [
	    				eldiv('name', {tag:'span'}, [selected.name]),
	    				eldiv('crew '+selected.type),
	    				eldiv('level', ['Level '+selected.level]),
	    				eldiv('stat morale', [selected.morale, eldiv({tag:'span'}, ['Morale:'])]),
						eldiv('stat combat', [selected.combat, eldiv({tag:'span'}, ['Combat:'])]),
						eldiv('stat seafaring', [selected.seafaring, eldiv({tag:'span'}, ['Seafaring:'])]),
						eldiv('stat speed', [selected.speed, eldiv({tag:'span'}, ['Speed:'])]),
						eldiv('traits', {tag:'span'}, [selected.type])
	    			])
	    		])
	    	]);
	    	$(helper.origin).append(frag)
			var content = $(helper.origin).find('.tooltip_content').detach();
	      	if(content.length > 0) {
	      		instance.content(content);
	      	}
	    }, plugins: ["follower"]
	});
}
function popupReset() {
	if(box) box.frame.close();
	box = null;
}
var box = null;
function popupFrame(options) {
	popupReset();
	options = applyobject({
		width: options.width,
		measurewidth: options.measurewidth,
		measureheight: options.measureheight,
		style: options.style,
		onclose: options.onclose,
		onchange: options.onchange,
		title: options.title,
		fadein: options.fadein,
		stylesheets: options.stylesheets,
		parent: options.parent,
		v2: options.v2,//flag for the boxcontainer functions
		id: ''
	}, options);
	var root = eldiv('fakePopupBorder', {onclick: function() { /*portUI.box.frame.close();*/ }}, [
					eldiv('popup', {id: options.id, style:'width: '+options.width+'px !important'}, [
						eldiv('headerTitle', [options.title]),
						eldiv('inner')
					])
				]);
	return({
		"root": root,
		"title":{},
		"closebutton":{},
		"contentbox":root.children[0].children[1],
		"insertfunc":function() {},
		"closefunc":function() {
			box.frame.root.remove();
			box = null;
			cureUI.draw();
		}
	});
};

/*function popupFrame(options) {
	popupReset();
	options = applyobject({
		width: options.width,
		measurewidth: options.measurewidth,
		measureheight: options.measureheight,
		style: options.style,
		onclose: options.onclose,
		onchange: options.onchange,
		title: options.title,
		fadein: options.fadein,
		stylesheets: options.stylesheets,
		parent: options.parent,
		v2: options.v2,//flag for the boxcontainer functions
		id: ''
	}, options);
	var root = eldiv('fakePopupBorder', {onclick: function() { }}, [
					eldiv('popupPortCalc', {id: options.id, style:'width: '+options.width+'px'}, [
						eldiv('topLeft'),
						eldiv('top', [options.title]),
						eldiv('topRight'),
						eldiv('left'),
						eldiv('right'),
						eldiv('bottomLeft'),
						eldiv('bottom'),
						eldiv('bottomRight'),
						eldiv('close', {onclick: function() { qw(box); box.frame.close();}}),
						eldiv('body')
					])
				]);
	return({
		"root": root,
		"title":{},
		"closebutton":{},
		"contentbox":root.children[0].children[9],
		"insertfunc":function() {},
		"closefunc":function() {
			box.frame.root.remove();
			box = null;
			cureUI.draw();
		}
	});
};
*/

function cureSeekerInterface() {
	var me = this;
	var els = [];
	this.els = els;
	this.crewEdit = false;
	this.root = elfrag(
		els.header = eldiv('header', [
			els.headerFind = eldiv('headerTitle'),
			els.tabroot = eldiv("nisseperator")		
		]),
		els.body = eldiv("curestate"),
		els.footer = eldiv('footer', [eldiv("nisbutton", {id:"unlockbutton",onclick:function() { cureUI = new cureSeekerInterface(); cureUI.init();}},["Reset"])])
	);
	
	this.init = function () {
		if(setting('alt1Detected')) {
			els.headerFind.appendChild(eldiv("nisbutton", {id:"unlockbutton", onclick:function () { solve(); }}, ["Check Disease"]));
		} else { 
			els.headerFind.appendChild(eldiv({id:"solvePaste"}, [eldiv({tag:"img", height:"24", src:"https://runeapps.org/apps/alt1/meg/pasteicon.png", style: "vertical-align: middle;",width: "24"}), eldiv({tag:"span", id: "solvepastestr"}, ["Paste a screenshot (ctrl+v)"])]));
		}
		els.minimalMessage = "";
		els.curePrompt = eldiv("nistext", {id:"output"}, [setting('alt1Detected') ? "Click the button or press alt+1 when the prompt is visible. " : "Paste a screenshot with the prompt visible."]);
		els.cureTable = eldiv({tag:"table", id:"diseaseTable"}, [eldiv({tag:"thead"}, [eldiv({tag:"th"}),eldiv({tag:"th", id:"head"},["Head"]), eldiv({tag:"th", id:"eyes"},["Eyes"]), eldiv({tag:"th", id:"legs"},["Legs",eldiv({tag:"br"}),"Feet"]), eldiv({tag:"th", id:"stomach"},["Stomach"])]),eldiv({tag:"tbody"}, [eldiv({tag:"tr"}, [eldiv({tag:"th"},["Flu"]), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"})]),eldiv({tag:"tr"}, [eldiv({tag:"th"},["Curse"]), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"})]),eldiv({tag:"tr"}, [eldiv({tag:"th"},["Dry nose"]), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"}),eldiv({tag:"td"})]),eldiv({tag:"tr"}, [eldiv({tag:"th"},["Wooting Cough"]), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"})]), eldiv({tag:"tr"}, [eldiv({tag:"th"},["Foot-in-mouth"]), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"})]),eldiv({tag:"tr"}, [eldiv({tag:"th"},["Bone Rattle"]), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"}), eldiv({tag:"td"})])])]);
		els.diseaseMinimal = eldiv({id:"diseaseMinimal"});
		els.diseaseMinimal.main = eldiv("noData", [setting('alt1Detected') ? "Click the button or press alt+1 when the prompt is visible. " : "Paste a screenshot with the prompt visible."]);
		els.diseaseMinimal.steps = [];
		els.diseaseMinimal.known = "";
		els.diseaseMinimal.EOF = false;
		var allTD = els.cureTable.querySelectorAll("td");
		for(a in allTD)
			allTD[a].innerHTML = "&#10008;";
		elput(document.body, me.root);
		me.draw();
	}
	
	this.draw = function () {
		var frag = elfrag(
			eldiv("contenttab lefttab" + (setting('activemode') == 0 ? " activetab" : ""), { onclick: function () { if(box != null) return; setSetting('activemode', 0); me.draw(); } }, ["News"]),
			eldiv("contenttab lefttab" + (setting('activemode') == 1 ? " activetab" : ""), { onclick: function () { if(box != null) return; setSetting('activemode', 1); me.draw(); } }, ["Information"]),
			eldiv("contenttab lefttab" + (setting('activemode') == 2 ? " activetab" : ""), { onclick: function () { if(box != null) return; setSetting('activemode', 2); me.draw(); } }, ["Cures"]),
			eldiv("contenttab lefttab" + (setting('activemode') == 3 ? " activetab" : ""), { onclick: function () { if(box != null) return; setSetting('activemode', 3); me.draw(); } }, ["Settings"])
		);
		elput(els.tabroot, frag);
		if (setting('activemode') == 0) { 
			els.body.setAttribute("id", "news");
			elput(els.body, me.drawNews());
		}
		if (setting('activemode') == 1) { 
			els.body.setAttribute("id", "overview");
			elput(els.body, me.drawOverview());
			if(setting("table")) {
				elid("poS").innerHTML = "&#10004;";
				elid("noS").innerHTML = "&#10008;";
				elid("boS").innerHTML = "&#9940;";
			}
		}
		if (setting('activemode') == 2) { 
			els.body.setAttribute("id", "cures");
			elput(els.body, me.drawCures());
		}
		if (setting('activemode') == 3) {  
			els.body.setAttribute("id", "settings");
			els.settings = elfrag();
			els.settings.appendChild(eldiv("crty-header", ["Settings"]));
			var optID = 0;
			for (var a in settingsVar) {
				var key = a;
				var seting = settingsVar[a];
				var val = setting(seting.setting);
				var el = eldiv("setting borderImage", { "data-settingname": seting.setting }, [eldiv('name', [seting.name])]);
				var options = eldiv('options');
				for (b = 0; b < seting.vars.length; b++) {
					var option = seting.vars[b];
					var input = null;
					var label = null;
					var opt = eldiv('option', [
						input = eldiv({tag:'input', type:'radio', id: optID, name: seting.setting, "data-var": option+"", onclick: function() { setSetting(this.getAttribute('name'), this.dataset['var']); me.draw(); }}),
						label = eldiv("far fa-circle",{tag:'label', for: optID}, [option])
					]);
					if(val == option) {
						input.setAttribute('checked', '');
						label.className = "fas fa-circle";
					}
					options.appendChild(opt);
					optID++;
				}
				el.appendChild(options);
				if (seting.tooltip) { el.classList.add("tooltip"); el.setAttribute('title', seting.tooltip)}
				els.settings.appendChild(el);
			}
			elput(els.body, me.drawSettings());
		}
		setTooltips('.tooltip');
	}
	this.drawInformation = function() {
		var frag = elfrag();
		if(setting("table")) {
			frag.appendChild(eldiv("crty-header", ["Table ledger"]));
			frag.appendChild(eldiv("crty-story", [
				eldiv({tag:"table", id:"ledger"}, 
				[
					eldiv({tag:"thead"}, [eldiv({tag:"th"},["Possible symptom"]), eldiv({tag:"th"},["No symptom"]), eldiv({tag:"th"},["Body part fine"])]),
					eldiv({tag:"tr"}, [eldiv("has", {tag:"td", id:"poS"}), eldiv({tag:"td", id:"noS"}), eldiv("fine",{tag:"td", id:"boS"})])
				])]));
		} else {
			frag.appendChild(eldiv("crty-header", ["How it Works"]));
			if(setting('alt1Detected')) {
				frag.appendChild(eldiv("crty-story", ["Pressing Check Disease (Alt + 1 keybind) will activate solve."]));
			} else {
				frag.appendChild(eldiv("crty-story", ["Pasting a image on clipboard will activate solve."]));
			}
			frag.appendChild(eldiv("crty-story", ["If body part message is visible app will step forward if not a error message will be displayed."]));
			frag.appendChild(eldiv({tag:"h3"}, ["Symptom Not Found"]));
			frag.appendChild(eldiv("nisseperator"));
			frag.appendChild(eldiv({id:"diseaseMinimal"}, [eldiv("step", [eldiv({tag:"img", src:"lib/img/head.png"}), eldiv("part",{tag:"span"}, ["head"])])]));
			frag.appendChild(eldiv("crty-story", ["When a symptom message is not linked to a possible disease a Step will be added showing that you have checked a body part."]));
			frag.appendChild(eldiv({tag:"h3"}, ["Symptom Found"]));
			frag.appendChild(eldiv("nisseperator"));
			frag.appendChild(eldiv({id:"diseaseMinimal"}, [eldiv("noData", ["Known Treatment: Bone rattle treatment"])]));
			frag.appendChild(eldiv("crty-story", ["When symptom message is linked to multiple diseases a step will be added.  If a single disease steps will disappear and just show treament type."]));
			if(setting('alt1Detected')) {
				frag.appendChild(eldiv("crty-story", ["Once a treatment has been confirmed pressing Check Disease (Alt + 1 keybind) with treatment options visible will draw a box around the treament."]));
			}

			frag.appendChild(eldiv({tag:"h3"}, ["Multiple Symptoms Found"]));
			frag.appendChild(eldiv("nisseperator"));
			frag.appendChild(eldiv({id:"diseaseMinimal"}, [eldiv("step", [eldiv({tag:"img", src:"lib/img/eyes.png"}), eldiv("part",{tag:"span"}, ["eyes"]), eldiv("count tooltip tooltipstered",{tag:"span"}, ["2",eldiv("tooltiptext tooltip-top",{tag:"span"}, ["flu, wooting-cough"])])])]));
			frag.appendChild(eldiv("crty-story", ["Multiple symptoms for a body part will show a number in top right corner of step. On hover will have a tooltip displaying which possible diseases."]));
			if(setting('alt1Detected')) {
				frag.appendChild(eldiv("crty-story", ["Once all body parts have been checked pressing Check Disease (Alt + 1 keybind) with treatment options visible will draw a box around the possible treaments."]));
			}
		}
		return frag;
	}
	this.drawOverview = function () {
		var frag = elfrag(
			eldiv("alert",{tag:"a", target: "_blank", href:"https://runeapps.org/forums/viewtopic.php?id=885"},["App still in early stages Click to post missing symptoms to forumn."]),
			eldiv("crty-header", ["General Information"]),
			eldiv("crty-story", ["Help cure your diseased animals for Player Owned Farms."]),
			me.drawInformation()
					
		);

		return frag;
	}
	this.drawNews = function() {
		var frag = elfrag(
			eldiv("alert",{tag:"a", target: "_blank", href:"https://runeapps.org/forums/viewtopic.php?id=885"},["App still in early stages Click to post missing symptoms to forumn."]),
			eldiv("crty-header", ["Updates"]),
			eldiv("update", [
				eldiv("updatehead", [
					eldiv("updatetitle", {tag:"span"}, ["Cure Seeker Update"]),
					eldiv("updateversion", {tag:"span"}, ["v2.0.0"]),
					eldiv("updatetime", {tag:"span"}, ["21 Sept 2018"]),
				]),
				eldiv("updatesummary", ["Minimal UI release."]),
				eldiv("updatesummary", [eldiv("",{tag:"a", target: "_blank", href:"https://runeapps.org/forums/viewtopic.php?pid=3138#p3138"},["Click Here for full Update list."])])
			]),
			eldiv("update", [
				eldiv("updatehead", [
					eldiv("updatetitle", {tag:"span"}, ["Cure Seeker Update"]),
					eldiv("updateversion", {tag:"span"}, ["v1.0.1"]),
					eldiv("updatetime", {tag:"span"}, ["10 Sept 2018"]),
				]),
				eldiv("updatesummary", ["Icons added to table, more symptoms added, UI update."]),
				eldiv("updatesummary", [eldiv("",{tag:"a", target: "_blank", href:"https://runeapps.org/forums/viewtopic.php?pid=3127#p3127"},["Click Here for full Update list."])])
			]),
			eldiv("update", [
				eldiv("updatehead", [
					eldiv("updatetitle", {tag:"span"}, ["Cure Seeker Update"]),
					eldiv("updateversion", {tag:"span"}, ["v1.0.0"]),
					eldiv("updatetime", {tag:"span"}, ["9 Sept 2018"]),
				]),
				eldiv("updatesummary", ["Initial relase"]),
				eldiv("updatesummary", [eldiv("",{tag:"a", target: "_blank", href:"https://runeapps.org/forums/viewtopic.php?pid=3104#p3104"},["Click Here for full Update list."])])
			])
		);
		return frag;
	};
	
	this.drawCures = function() {
		var frag = setting("table") ? elfrag(els.curePrompt, els.cureTable) : elfrag(me.drawMinimal());
		return frag;
	}
	this.drawMinimal = function() {
		var frag = elfrag();
		while (els.diseaseMinimal.firstChild) {
	    	els.diseaseMinimal.removeChild(els.diseaseMinimal.firstChild);
		}
		qw("Draw Minimal: steps.length("+els.diseaseMinimal.steps.length+")");
		qw(els.diseaseMinimal.steps);
		if(els.diseaseMinimal.known != "") {
			qw("Draw Known Minimal Main");
			els.diseaseMinimal.main.innerHTML = "Known Treatment: " + getDisease(els.diseaseMinimal.known)+"<br/>";
			els.minimalMessage = "";
			els.diseaseMinimal.appendChild(els.diseaseMinimal.main);
			els.diseaseMinimal.EOF = true;
		} else if(els.minimalMessage != "") {
			qw("Draw Minimal Main");
			els.diseaseMinimal.main.innerHTML = els.minimalMessage;
			els.minimalMessage = "";
			els.diseaseMinimal.appendChild(els.diseaseMinimal.main);
		} else if(els.diseaseMinimal.steps.length == 0) {
			qw("Draw Minimal Main");
			els.diseaseMinimal.appendChild(els.diseaseMinimal.main);
		} else {
			for(var s in els.diseaseMinimal.steps) {
				qw("Draw Minimal Step: "+s);
				var step = els.diseaseMinimal.steps[s];
				step.count = null;
				if(step.symptoms.length > 1) {
					step.count = eldiv("count tooltip", {tag:"span"}, [step.symptoms.length, eldiv('tooltiptext tooltip-top', {tag:'span'}, [step.symptoms.join(', ')])]);
				}
				els.diseaseMinimal.appendChild(eldiv("step", [eldiv({tag:"img", src:"lib/img/"+step.disease+".png"}), eldiv("part", {tag:"span"}, [step.disease]), step.count]));
			}
		}
		frag.appendChild(els.diseaseMinimal);
		return frag;
	}
	
	this.drawSettings = function() {
		var frag = elfrag(els.settings, eldiv("crty-story", ["Debug will be added back shortly with even more settings."]));
		return frag;
	}

}

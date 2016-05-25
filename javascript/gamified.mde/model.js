//-- MODEL  ----------------------------------------------------------------------------------
var draggedId = null;

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

var MyObject = function (game, level, objectName, identity) {
    this.game = game;
    this.level = level;
    this.objectName = objectName;
    this.identity = identity;
}

var Objective = function (game, level, objectiveName, description) {
    this.objectiveName = objectiveName;
    this.level = level;
    this.game = game;
    this.description = description;
}

var Level = function (game, levelName) {
    this.levelName = levelName;
    this.game = game;
    this.objectives = new Array();
    this.objects = new Array();
    this.caseDescription = "";

    this.points = 0;
    this.timeElapsed = "00:00:00";

    this.initialize = function () {
    }

    this.setCaseDescription = function (caseDescription) {
        this.caseDescription = caseDescription;
    }

    this.getCaseDescription = function () {
        return this.caseDescription;
    }


    this.addObject = function (objectName, identity) {
        var myObject = new MyObject(this.game, this, objectName, identity);
        this.objects.push(myObject);
        return myObject;
    }

    this.addObjective = function (objective) {
        this.objectives.push(objective);
    }

    this.evaluateObjectives = function () {
        var trueCounter = 0;
        for (var i = 0; i < this.objectives.length; i++) {
            if (this.objectives[i].check()) {
                trueCounter += 1;
                document.getElementById(this.objectives[i].objectiveName).style.color = "#007826";
            }
        }
        if (trueCounter == this.objectives.length) {
            showDialog();
        }
    }
}

var Stage = function () {
    this.reset = function () {

    }
}

var Game = function () {
    this.stage = new Stage();
    //SET THE DEFAULT LEVEL 0 = level 1, 1 = level 2
    this.currentLevel = 0;

    this.levels = new Array();

    this.levels[0] = new Level(this, "Level 01 - Object Modelling: Create a Single Object");
    this.levels[0].setCaseDescription(
        "Create a <span id='DraggableCaseItem1' class='DraggableCaseItem' draggable='true' " +
        "style='color:#0066cc'>button</span>!!!!!!"
    );
    var objectiveLevel01 = new Objective(this, this.levels[0], "Objective-1",
        "Create an object with name 'button'"
    );
    objectiveLevel01.check = function () {
        //alert(this.level.name);
        if (this.level != null && this.level.objects.length >= 1) {
            for (var i = 0; i < this.level.objects.length; i++) {
                //alert(this.level.objects[i].name);
                if (this.level.objects[i].objectName == "button") {
                    return true;
                }
            }
            return false;
        }
    }.bind(objectiveLevel01);

    this.levels[0].initialize = function () {

        this.objects.length = 0;
        document.getElementById("Title").innerHTML = this.levelName;
        document.getElementById("Instruction").innerHTML = this.caseDescription;
        $('.DraggableCaseItem').draggable({
            opacity: 0.7, helper: "clone",
            start: function (event, ui) {
                draggedId = $(event.target).attr('id');
            }
        });

        var ol = document.getElementById("Objective");
        ol.style.color = "#000000";
        while (ol.hasChildNodes()) {
            ol.removeChild(ol.lastChild);
        }
        for (var i = 0; i < game.levels[game.currentLevel].objectives.length; i++) {
            var li = document.createElement("li");
            li.style.color = "#000000";
            li.id = game.levels[game.currentLevel].objectives[i].objectiveName;
            var text = document.createTextNode(game.levels[game.currentLevel].objectives[i].description);
            li.appendChild(text);
            ol.appendChild(li);
        }
    }.bind(this.levels[0]);
    this.levels[0].addObjective(objectiveLevel01);


    this.levels[1] = new Level(this, "Level 02 - Object Modelling: Create Two Objects");
    this.levels[1].setCaseDescription(
        "Create two buttons:<br/> " +
        "<span id='DraggableCaseItem1' class='DraggableCaseItem' draggable='true' style='color:#0066cc'>button 1</span> " +
        "and <span id='DraggableCaseItem2' class='DraggableCaseItem' draggable='true' style='color:#0066cc'>button 2</span>"
    );

    var objectiveLevel02_1 = new Objective(this, this.levels[1], "Objective-1",
        "Create an object named 'button 1'!");
    objectiveLevel02_1.check = function () {
        if (this.level != null && this.level.objects.length >= 1) {
            for (var i = 0; i < this.level.objects.length; i++) {
                if (this.level.objects[i].objectName == "button 1") {
                    return true;
                }
            }
        }
        return false;
    }.bind(objectiveLevel02_1);
    this.levels[1].addObjective(objectiveLevel02_1);

    var objectiveLevel02_2 = new Objective(this, this.levels[1], "Objective-2",
        "Create an object named 'button 2'!");
    objectiveLevel02_2.check = function () {
        if (this.level != null && this.level.objects.length >= 1) {
            for (var i = 0; i < this.level.objects.length; i++) {
                if (this.level.objects[i].objectName == "button 2") {
                    return true;
                }
            }
        }
        return false;
    }.bind(objectiveLevel02_2);
    this.levels[1].addObjective(objectiveLevel02_2);

    this.levels[1].initialize = function () {

        this.objects.length = 0;
        document.getElementById("Title").innerHTML = this.levelName;
        document.getElementById("Instruction").innerHTML = this.caseDescription;
        $('.DraggableCaseItem').draggable({
            opacity: 0.7, helper: "clone",
            start: function (event, ui) {
                draggedId = $(event.target).attr('id');
            }
        });

        var ol = document.getElementById("Objective");
        ol.style.color = "#000000";
        while (ol.hasChildNodes()) {
            ol.removeChild(ol.lastChild);
        }
        for (var i = 0; i < game.levels[game.currentLevel].objectives.length; i++) {
            var li = document.createElement("li");
            li.style.color = "#000000";
            li.id = game.levels[game.currentLevel].objectives[i].objectiveName;
            var text = document.createTextNode(game.levels[game.currentLevel].objectives[i].description);
            li.appendChild(text);
            ol.appendChild(li);
        }

    }.bind(this.levels[1]);


    this.run = function () {

        //Level 1
        this.levels[this.currentLevel].initialize();

    }

    this.replay = function () {
        closeDialog();
        graph.clear();
        game.levels[this.currentLevel].initialize();
    }

    this.nextLevel = function () {
        closeDialog();
        graph.clear();
        this.currentLevel += 1;
        game.levels[this.currentLevel].initialize();
    }
}

function click(x, y) {
    var ev = document.createEvent("MouseEvent");
    var el = document.elementFromPoint(x, y);
    ev.initMouseEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, null,
        x, y, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
}




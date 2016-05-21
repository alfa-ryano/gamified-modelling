//-- MODEL  ----------------------------------------------------------------------------------
var draggedId = null;

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

var MyObject = function (game, level, name) {
    this.game = game;
    this.level = level;
    this.name = name;
    this.getName = function(){
        return this.name;
    }
}

var Objective = function (game, level, name, description) {
    this.name = name;
    this.level = level;
    this.game = game;
    this.description = description;
}

var Level = function (game, name) {
    this.name = name;
    this.game = game;
    this.objectives = new Array();
    this.objects = new Array();
    this.caseDescription = "";

    this.points = 0;
    this.timeElapsed = "00:00:00";

    this.initialize = function(){
    }

    this.setCaseDescription = function (caseDescription) {
        this.caseDescription = caseDescription;
    }

    this.getCaseDescription = function () {
        return this.caseDescription;
    }


    this.addObject = function (name) {
        var myObject = new MyObject(this.game, this, name);
        this.objects.push(myObject);
    }

    this.addObjective = function (objective) {
        this.objectives.push(objective);
    }

    this.evaluateObjectives = function () {
        var allTrue = false;
        for (var i = 0; i < this.objectives.length; i++){
            if (this.objectives[i].check()) {
                allTrue = true;
                document.getElementById(this.objectives[i].name).style.color = "#007826";
            }
        }
        if (allTrue == true) {
            alert("Level Complete");
        }
    }
}

var Stage = function () {
    this.reset = function () {

    }
}

var Game = function () {
    this.stage = new Stage();
    this.currentLevel = 0;

    this.levels = new Array();

    this.levels[0] = new Level(this, "Level 1");
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
            for (var i = 0; i < this.level.objects.length;i++) {
                //alert(this.level.objects[i].name);
                if (this.level.objects[i].name == "button") {
                    return true;
                }
            }
            return false;
        }
    }.bind(objectiveLevel01);

    this.levels[0].initialize = function() {
        document.getElementById("Instruction").innerHTML = this.caseDescription;
        $('#DraggableCaseItem1').draggable({
            opacity: 0.7, helper: "clone",
            start: function (event,ui) {
                draggedId = $(event.target).attr('id');
            }
        });
    }.bind(this.levels[0]);
    this.levels[0].addObjective(objectiveLevel01);


    this.levels[1] = new Level(this, "Level 2");
    this.levels[1].setCaseDescription(
        "Create two buttons:<brr/> <span id='DraggableCaseItem1' class='DraggableCaseItem' draggable='true' " +
        "style='color:#0066cc'>button 1</span> and <span id='DraggableCaseItem2' class='DraggableCaseItem' draggable='true' " +
        "style='color:#0066cc'>button 2</span>"
    );
    var objectiveLevel02 = new Objective(this, this.levels[1], "Objective-1",
        "Create two objects named 'button 1' and 'button 2'!");
    objectiveLevel02.check = function () {
        if (this.levels != null && this.levels[1].objects.size >= 2) {
            var countTrue = 0;
            for (var item in this.levels[1].objects) {
                if (item.getName() == "button 1" || item.getName() == "button 2") {
                    countTrue += 1;
                }
                if (countTrue >= 2) {
                    true;
                }
            }
        }
    }.bind(objectiveLevel02);
    this.levels[1].initialize = function() {
        document.getElementById("Instruction").innerHTML = this.caseDescription;
        $('#DraggableCaseItem1').draggable({
            opacity: 0.7, helper: "clone",
            start: function (event,ui) {
                draggedId = $(event.target).attr('id');
            }
        });
    }.bind(this.levels[1]);
    this.levels[1].addObjective(objectiveLevel02);

    this.run = function () {

        //Level 1
        this.levels[this.currentLevel].initialize();
        var ol = document.getElementById("Objective");
        while (ol.hasChildNodes()) {
            ol.removeChild(ol.lastChild);
        }
        for(var i = 0; i < this.levels[this.currentLevel].objectives.length;i++){
            var li = document.createElement("li");
            li.id = this.levels[this.currentLevel].objectives[i].name;
            var text = document.createTextNode(this.levels[this.currentLevel].objectives[i].description);
            li.appendChild(text);
            ol.appendChild(li);
        }

    }
}

function click(x,y){
    var ev = document.createEvent("MouseEvent");
    var el = document.elementFromPoint(x,y);
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
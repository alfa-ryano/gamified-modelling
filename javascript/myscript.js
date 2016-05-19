//var imported = document.createElement('script');
//imported.src = '/path/to/imported/script';
//document.head.appendChild(imported);

//-- PRESENTATION ----------------------------------------------------------------------------------

var ICON_WIDTH = 100;
var ICON_HEIGHT = 90;

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#DrawingViewport'),
    width: "100%",
    height: "100%",
    origin: {x: 0, y: 0},
    model: graph,
    gridSize: 1
});

joint.shapes.html = {};
joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
    defaults: joint.util.deepSupplement({
        type: 'html.Element',
        attrs: {
            rect: {stroke: 'none', 'fill-opacity': 0}
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.html.ElementView = joint.dia.ElementView.extend({

    template: [
        '<div id="HtmlObjectIcon" class="HtmlIcon">',
        '<button class="delete">x</button>',
        '<div id="HtmlNameObject" class="HtmlContainerIcon">',
        '<input class="HtmlObjectNameText" type="text" value="object" />',
        '</div>',
        '<div id="HtmlSlotObject" class="HtmlContainerIcon">',
        '<input class="HtmlObjectSlotText" type="text" value="" />',
        '</div>',
        '<div id="HtmlOperationObject" class="HtmlContainerIcon">',
        '<input class="HtmlObjectOperationText" type="text" value="" />',
        '</div>',
        '</div>'
        //'<div class="html-element">',
        //'<button class="delete">x</button>',
        //'<label></label>',
        //'<span></span>', '<br/>',
        //'<select><option>--</option><option>one</option><option>two</option></select>',
        //'<input type="text" value="I\'m HTML input" />',
        //'</div>'
    ].join(''),

    initialize: function () {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.$box = $(_.template(this.template)());

        // Prevent paper from handling pointerdown.
        this.$box.find('div input').on('dblclick', function (evt) {
        });

        this.$box.find('input').on('change', _.bind(function (evt) {
            this.model.set('input', $(evt.target).val());
        }, this));

        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
    },
    render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
    },
    updateBox: function () {
        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // Example of updating the HTML with a data stored in the cell model.

        //this.$box.find('input').text(this.model.get('input'));
        //this.$box.find('input').text(this.model.get('name'));
        var temp = this.$box.find('.HtmlObjectNameText')[0];
        temp.value = this.model.get('name');
        //this.$box.find('HtmlObjectNameText').text(this.model.get('name'));
        this.$box.css({
            width: bbox.width,
            height: bbox.height,
            left: bbox.x - 1,
            top: bbox.y - 1
        });
    },

    removeBox: function (evt) {
        this.$box.remove();
    }
});

/*--Add Event Listener--*/

$('#ObjectIcon').draggable({
    opacity: 0.7, helper: "clone",
    start: function (event) {
    }
});

$('#LinkIcon').draggable({
    opacity: 0.7, helper: "clone",
    start: function (event) {
    }
});

$("#DrawingViewport").droppable({
    drop: function (event, ui) {
        var paperPoint = paper.clientToLocalPoint({x: event.clientX, y: event.clientY});

        var elementId = ui.draggable.attr("id");
        var className = ui.draggable.attr("class");
        var objectName = document.getElementById(elementId).innerHTML;

        if (elementId == "ObjectIcon") {
            var object = new joint.shapes.html.Element({
                position: {x: paperPoint.x - ICON_WIDTH / 2, y: paperPoint.y - ICON_HEIGHT / 2},
                size: {width: ICON_WIDTH, height: ICON_HEIGHT},
                span: "object",
                name: ""
            });
            graph.addCell(object);
        } else if (elementId == "LinkIcon") {

            var link = new joint.dia.Link({
                source: {x: paperPoint.x + ICON_WIDTH / 2, y: paperPoint.y - ICON_HEIGHT / 2},
                target: {x: paperPoint.x - ICON_WIDTH / 2, y: paperPoint.y + ICON_HEIGHT / 2}
            });
            graph.addCell(link);
        } else if (elementId == "DraggableCaseItem1") {
            var object = new joint.shapes.html.Element({
                position: {x: paperPoint.x - ICON_WIDTH / 2, y: paperPoint.y - ICON_HEIGHT / 2},
                size: {width: ICON_WIDTH, height: ICON_HEIGHT},
                span: "object",
                name: objectName
            });
            graph.addCell(object);

            var level = game.levels[game.currentLevel];
            level.addObject(objectName);
            level.evaluateObjectives();
        }


    }
});

paper.on('blank:pointerclick', function (evt, x, y) {
    if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.parentNode.parentNode.style.pointerEvents = 'none';
        document.activeElement.blur();
        var x = 2;
    }
});

paper.on('cell:pointerdblclick', function (cellView, evt, x, y) {
    var element = graph.get('cells').find(function (cell) {
            if (cell instanceof joint.dia.Link) return false;
            if (cell.id === cellView.model.id) {
                cellView.$box.css({
                        'pointer-events': function () {
                            if (cellView.$box.css("pointer-events") == 'none') {
                                return 'auto'
                            }
                        }
                    }
                );
                //var input = prompt("Object name: ", "object");
                //cellView.$box.find('input')[0].value = input;
                return true;
            }
            return false;
        })
        ;
})
;


//$("#ObjectIcon").on('doubletap', function(event) {
$(".HtmlIcon").on('doubletap', function (event) {
    try {
        alert("B");
        //var input = prompt("Object name: ", "object");
        //var name = $(event.target).parent("#HtmlObjectIcon").find("HtmlObjectNameText")[0];
        //name.value(input);
    } catch (err) {
        alert(err.message);
    }
});

//-- MODEL  ----------------------------------------------------------------------------------

var MyObject = function (game, level, name) {
    this.game = game;
    this.level = level;
    this.name = name;
    this.getName = function(){
        return this.name;
    }
}

var Objective = function (game, level, description) {
    this.level = level;
    this.game = game;
    this.description = description;
    this.check = function(){alert("BBBB")};
}

var Level = function (game, name) {
    this.name = name;
    this.game = game;
    this.objectives = new Array();
    this.objects = new Array();
    this.caseDescription = "";

    this.points = 0;
    this.timeElapsed = "00:00:00";

    this.setInitialization = function (myInitialization) {
        this.initialize = myInitialization;
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
            allTrue = this.objectives[i].check();
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
    var objectiveLevel01 = new Objective(this, this.levels[0],
        "Create an button with name 'button'"
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
        }
        return false;
    }.bind(objectiveLevel01);
    this.levels[0].addObjective(objectiveLevel01);

    this.levels[1] = new Level(this, "Level 2");
    this.levels[1].setCaseDescription(
        "Create two buttons:<brr/> <span id='DraggableCaseItem1' class='DraggableCaseItem' draggable='true' " +
        "style='color:#0066cc'>button 1</span> and <span id='DraggableCaseItem2' class='DraggableCaseItem' draggable='true' " +
        "style='color:#0066cc'>button 2</span>"
    );
    var objectiveLevel02 = new Objective(this, this.levels[1],
        "Create two objects named 'button 1' and 'button 2'!",
        function () {
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
        });
    this.levels[1].addObjective(objectiveLevel02);

    this.run = function () {
        //Level 1
        document.getElementById("Instruction").innerHTML = this.levels[0].caseDescription;
        $('#DraggableCaseItem1').draggable({
            opacity: 0.7, helper: "clone",
            start: function (event) {
            }
        });
    }
}

// MAIN ------------------------------------
try {
    var game = new Game();
    game.run();
} catch (error) {
    alert(error.message);
}

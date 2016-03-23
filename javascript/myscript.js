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
        this.$box.find('input').text(this.model.get('input'));
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

    //initialize: function () {
    //    _.bindAll(this, 'updateBox');
    //    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    //
    //    this.$box = $(_.template(this.template)());
    //    // Prevent paper from handling pointerdown.
    //    this.$box.find('input,select').on('mousedown click', function (evt) {
    //        evt.stopPropagation();
    //    });
    //    // This is an example of reacting on the input change and storing the input data in the cell model.
    //    this.$box.find('input').on('change', _.bind(function (evt) {
    //        this.model.set('input', $(evt.target).val());
    //    }, this));
    //    this.$box.find('select').on('change', _.bind(function (evt) {
    //        this.model.set('select', $(evt.target).val());
    //    }, this));
    //    this.$box.find('select').val(this.model.get('select'));
    //    this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
    //    // Update the box position whenever the underlying model changes.
    //    this.model.on('change', this.updateBox, this);
    //    // Remove the box when the model gets removed from the graph.
    //    this.model.on('remove', this.removeBox, this);
    //
    //    this.updateBox();
    //},
    //render: function () {
    //    joint.dia.ElementView.prototype.render.apply(this, arguments);
    //    this.paper.$el.prepend(this.$box);
    //    this.updateBox();
    //    return this;
    //},
    //updateBox: function () {
    //    // Set the position and dimension of the box so that it covers the JointJS element.
    //    var bbox = this.model.getBBox();
    //    // Example of updating the HTML with a data stored in the cell model.
    //    this.$box.find('label').text(this.model.get('label'));
    //    this.$box.find('span').text(this.model.get('select'));
    //    this.$box.css({
    //        width: bbox.width,
    //        height: bbox.height,
    //        left: bbox.x,
    //        top: bbox.y,
    //        transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
    //    });
    //},
    //removeBox: function (evt) {
    //    this.$box.remove();
    //}
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

        if (elementId == "ObjectIcon") {
            var object = new joint.shapes.html.Element({
                position: {x: paperPoint.x - ICON_WIDTH / 2, y: paperPoint.y - ICON_HEIGHT / 2},
                size: {width: ICON_WIDTH, height: ICON_HEIGHT},
                span: "object"
            });
            graph.addCell(object);
        } else if (elementId == "LinkIcon") {

            var link = new joint.dia.Link({
                source: {x: paperPoint.x + ICON_WIDTH / 2, y: paperPoint.y - ICON_HEIGHT / 2},
                target: {x: paperPoint.x - ICON_WIDTH / 2, y: paperPoint.y + ICON_HEIGHT / 2}
            });
            graph.addCell(link);
        }
    }
});

//document.getElementById("ObjectIcon").addEventListener("dragstart", function drag(event) {
//    event.dataTransfer.setData("text", event.target.id);
//});
//
//document.getElementById("LinkIcon").addEventListener("dragstart", function drag(event) {
//    event.dataTransfer.setData("text", event.target.id);
//});
//
//document.getElementById("DrawingViewport").addEventListener("dragover", function allowDrop(event) {
//    event.preventDefault();
//});
//document.getElementById("DrawingViewport").addEventListener("drop", function drop(event) {
//
//    event.preventDefault();
//    var paperPoint = paper.clientToLocalPoint({x: event.clientX, y: event.clientY});
//    var elementId = event.dataTransfer.getData("text");
//
//    if (elementId == "ObjectIcon") {
//
//        var object = new joint.shapes.html.Element({
//            position: {x: paperPoint.x - ICON_WIDTH / 2, y: paperPoint.y - ICON_HEIGHT / 2},
//            size: {width: ICON_WIDTH, height: ICON_HEIGHT},
//            span: "object"
//            //,
//            //label: 'I am HTML',
//            //select: 'one'
//        });
//
//        //var object = new joint.shapes.basic.Rect({
//        //    position: {x: 100, y: 30},
//        //    size: {width: ICON_WIDTH, height: ICON_HEIGHT},
//        //    attrs: {rect: {fill: 'white'}, text: {text: 'object', fill: 'black'}}
//        //});
//        graph.addCell(object);
//
//    } else if (elementId == "LinkIcon") {
//
//        var link = new joint.dia.Link({
//            source: {x: paperPoint.x + ICON_WIDTH / 2, y: paperPoint.y - ICON_HEIGHT / 2},
//            target: {x: paperPoint.x - ICON_WIDTH / 2, y: paperPoint.y + ICON_HEIGHT / 2}
//        });
//        graph.addCell(link);
//
//    }
//});

paper.on('blank:pointerclick', function(evt, x, y) {
    if (document.activeElement instanceof HTMLInputElement){
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

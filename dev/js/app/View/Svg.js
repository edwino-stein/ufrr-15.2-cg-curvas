App.define('View.Svg', {

    scale: 0,
    lastX: 0,
    lastY: 0,

    svg: '#svg',
    pointsLayer:null,
    edgesLayer: null,

    points: [
        {x: 100, y: 420},
        {x: 275, y: 150},
        {x: 525, y: 150},
        {x: 700, y: 420}
    ],

    pointTextAttr:{
        'font-size': 14,
        'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif',
        'text-anchor': 'middle',
        'fill': '#fff',
        'dominant-baseline': 'central',
        'text-align': 'center',
        'unselectable': 'on'
    },

    pointCircleAttr:{
        'r': 10,
        'fill': '#000'
    },

    edgeLineAttr:{
        'stroke': '#f00',
        'stroke-width': '1px'
    },

    rasterPointText: function(x, y, value){
        var text = this.svg.text(x, y, value);
        for(var i in this.pointTextAttr)
            text.attr(i, this.pointTextAttr[i]);

        return text;
    },

    rasterPointCircle: function(x, y){
        var circle = this.svg.circle(x, y, 1);
        for(var i in this.pointCircleAttr)
            circle.attr(i, this.pointCircleAttr[i]);

        return circle;
    },

    rasterPoint: function(x, y, index){

        var me = this,
            point = this.svg.g();

        point.add(me.rasterPointCircle(x, y));
        point.add(me.rasterPointText(x, y, index));

        point.drag(
            function(dx, dy, pageX, pageY, event){
                me.onDrag(this, dx, dy, event);
            },
            function() {
                me.onDragStart(this, arguments[2]);
            },
            function(e){
                me.onDragEnds(this, e);
            }
        );

        point.attr('data-point', index);
        point.addClass("point");

        return point;
    },

    rasterEdgeLine: function(p1, p2){

        var line = this.svg.line(
            p1.select('circle').attr('cx'),
            p1.select('circle').attr('cy'),
            p2.select('circle').attr('cx'),
            p2.select('circle').attr('cy')
        );

        for(var i in this.edgeLineAttr)
            line.attr(i, this.edgeLineAttr[i]);

        line.addClass('edge');
        line.attr('data-origin', p1.attr('data-point'));
        line.attr('data-target', p2.attr('data-point'));

        return line;
    },

    updateEdgePosition: function(point){

        var pointId = point.attr('data-point'),
            x = point.select('circle').attr('cx'),
            y = point.select('circle').attr('cy');

        $('#edgesLayer .edge[data-origin='+pointId+'], #edgesLayer .edge[data-target='+pointId+']').each(function(index, el){

            if($(el).attr('data-origin') == pointId){
                el.setAttribute('x1', x);
                el.setAttribute('y1', y);
            }
            else{
                el.setAttribute('x2', x);
                el.setAttribute('y2', y);
            }
        });
    },

    onDragStart: function(el, e){
        var circule = el.select('circle');
        this.lastX = parseFloat(circule.attr('cx'));
        this.lastY = parseFloat(circule.attr('cy'));
        el.addClass('dragging');
        this.svg.addClass('dragging');
    },

    onDrag: function(el, dx, dy, e){

        var viewBox = this.svg.node.viewBox.baseVal,
            scale = this.scale,
            circle = el.select('circle'),
            text = el.select('text'),
            x = this.lastX + dx * scale;
            y = this.lastY + dy * scale;


        if(x + 10 >= viewBox.width) x = viewBox.width - 10;
        if(x - 10 <= 0) x = 10;

        if(y + 10 >= viewBox.height) y = viewBox.height - 10;
        if(y - 10 <= 0) y = 10;

        circle.attr({cx: x, cy: y});
        text.attr({x: x, y: y});

        this.updateEdgePosition(el);
        this.notifyPointsChange();
    },

    onDragEnds: function(el, e){
        el.removeClass('dragging');
        this.svg.removeClass('dragging');
    },

    notifyPointsChange(){

        var points = [];
        for(var i in this.points){
            points.push(new this.util.Point(
                this.points[i].select('circle').attr('cx'),
                this.points[i].select('circle').attr('cy')
            ));
        }

        this._appRoot_.Base.fireEvent('onpointschange', this.svg.node, [points]);
    },

    addListener: function(eventName, handle){
        $(this.svg.node).on(eventName, handle);
    },

    calculateScale: function(svg){

        var viewBox = svg.viewBox.baseVal,
            scaleByHeight = viewBox.height/$(svg).height(),
            scaleByWidth = viewBox.width/$(svg).width();

        return scaleByHeight >= scaleByWidth ? scaleByHeight : scaleByWidth;
    },

    init: function(){

        this.svg = Snap(this.svg);
        this.scale = this.calculateScale(this.svg.node);

        this.edgesLayer = this.svg.g();
        this.edgesLayer.attr('id', 'edgesLayer');

        this.pointsLayer = this.svg.g();
        this.pointsLayer.attr('id', 'pointsLayer');

        for(var i in this.points){
            this.points[i] = this.rasterPoint(this.points[i].x, this.points[i].y, i);
            this.pointsLayer.add(this.points[i]);
        }

        for(var i = 1; i < this.points.length; i++){
            this.edgesLayer.add(this.rasterEdgeLine(this.points[i - 1], this.points[i]));
        }

        this.util = this._appRoot_.get("Util");
    }
});

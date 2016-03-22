App.define('Controller.Main', {

    svg: 'View.Svg',
    canvas: 'View.Canvas',
    algorithms: 'Controller.Algorithms',

    algorithm: 'parametric',
    color: null,
    $time: '#time',

    render: function(points){

        this.canvas.clearFrame(false);
        var time = 0;

        switch (this.algorithm) {
            case 'casteljau':
                time = this.algorithms.casteljau(points, this.color);
            break;

            case 'parametric':
            default:
                time = this.algorithms.parametric(points, this.color);
        }

        this.canvas.update();
        this.$time.find('.raster').html(time.toFixed(3));
    },

    ready: function(){
        var me = this,
            time = 0,
            timeout = null,
            lastPoints = null;

        $('#algorithm').val(me.algorithm).change(function(){
            me.algorithm = $(this).val();
            me.svg.notifyPointsChange();
        });

        me.svg.addListener('onpointschange', function(e, points){

            lastPoints = points;
            if(timeout !== null) return;

            timeout = setTimeout(function(){
                me.render(lastPoints);
                timeout = null;
            }, time);
        });

        this.color = new this.util.Color(0, 0 ,0);
        me.svg.notifyPointsChange();
    },

    init: function(){
        this.svg = this._appRoot_.get(this.svg);
        this.canvas = this._appRoot_.get(this.canvas);
        this.algorithms = this._appRoot_.get(this.algorithms);
        this.util = this._appRoot_.get('Util');
        this.$time = $(this.$time);
    }

});

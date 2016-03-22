App.define('Controller.Algorithms', {

    canvas: 'View.Canvas',

    parametric: function(points, color){

        var now = this.getTimeStamp(),
            increment = 0.0005,
            x, y, t;

        for(t = 0; t <= 1; t += increment){

            //Calcula o valor de x para o t atual
            x = Math.pow(1 - t, 3) * points[0].x;
            x += 3 * t * Math.pow(1 - t, 2) * points[1].x;
            x += 3 * Math.pow(t, 2) * (1 - t) * points[2].x;
            x += Math.pow(t, 3) * points[3].x;

            //Calcula o valor de y para o t atual
            y = Math.pow(1 - t, 3) * points[0].y;
            y += 3 * t * Math.pow(1 - t, 2) * points[1].y;
            y += 3 * Math.pow(t, 2) * (1 - t) * points[2].y;
            y += Math.pow(t, 3) * points[3].y;

            //Pinta o pixel encontrado para o t atual
            this.canvas.activePixel(this.toCanvasPoint(x, y), color, false);
        }

        return this.getTimeStamp() - now;
    },

    toCanvasPoint: function(x, y){
        return this.newPoint(Math.round(x), Math.round(y));
    },

    newPoint: function(x, y){
        return new this.util.Point(x, y);
    },

    getTimeStamp: function(){
      return performance.now();
    },

    init: function(){
        this.canvas = this._appRoot_.get(this.canvas);
        this.util = this._appRoot_.get('Util');
    }

});

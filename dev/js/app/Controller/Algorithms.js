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

    casteljau: function(points, color){
        var now = this.getTimeStamp();

        //chama recursivamente até 12 niveis de recursão
        this.casteljauRecursive(points, color, 12);

        return this.getTimeStamp() - now;
    },

    casteljauRecursive: function(points, color, deep){

        if(deep <= 0) return;
        var m = [

            // ponto medio 0
            {
                x: (points[0].x + points[1].x)/2,
                y: (points[0].y + points[1].y)/2
            },

            // ponto medio 1
            {
                x: (points[1].x + points[2].x)/2,
                y: (points[1].y + points[2].y)/2
            },

            // ponto medio 2
            {
                x: (points[2].x + points[3].x)/2,
                y: (points[2].y + points[3].y)/2
            }
        ];

        // ponto medio 3
        m.push({
            x: (m[0].x + m[1].x)/2,
            y: (m[0].y + m[1].y)/2
        });

        // ponto medio 4
        m.push({
            x: (m[1].x + m[2].x)/2,
            y: (m[1].y + m[2].y)/2
        });

        // ponto medio 5
        m.push({
            x: (m[3].x + m[4].x)/2,
            y: (m[3].y + m[4].y)/2
        });

        //Pinta o pixel
        this.canvas.activePixel(this.toCanvasPoint(m[5].x, m[5].y), color, false);

        //Chama recursivamente para cada metade da curva
        this.casteljauRecursive([points[0], m[0], m[3], m[5]], color, deep - 1);
        this.casteljauRecursive([m[5], m[4], m[2], points[3]], color, deep - 1);
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

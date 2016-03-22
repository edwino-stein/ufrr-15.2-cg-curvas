App.define('View.Canvas', {
    domObj: '#canvas',
    width: 800,
    height: 600,

    context: null,
    imageData: null,

    activePixel: function(point, color, autoUpdate){

        if(point.x < 0 || point.x >= this.width) return;
        if(point.y < 0 || point.y >= this.height) return;
        autoUpdate = typeof(autoUpdate) === 'undefined' || autoUpdate ? true : false;

        var pixel = (point.y * this.width + point.x) * 4;

        this.imageData.data[pixel]     = color.red;     //red
        this.imageData.data[pixel + 1] = color.green;   //green
        this.imageData.data[pixel + 2] = color.blue;    //blue
        this.imageData.data[pixel + 3] = 255;

        if(autoUpdate) this.update();
    },

    getPixelColor: function(point){

        if(point.x < 0 || point.x >= this.width) return;
        if(point.y < 0 || point.y >= this.height) return;

        var pixel = (point.y * this.width + point.x) * 4;
        return new this.util.Color(
            this.imageData.data[pixel],
            this.imageData.data[pixel + 1],
            this.imageData.data[pixel + 2]
        );
    },

    clearFrame: function(autoUpdate){
        autoUpdate = typeof(autoUpdate) === 'undefined' || autoUpdate ? true : false;
        this.context.clearRect(0, 0, this.width, this.height);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);

        for(var y = 0; y < this.height; y++){
            for(var x = 0; x < this.width; x++){
                var pixel = (y * this.width + x) * 4;

                this.imageData.data[pixel]     = 255;
                this.imageData.data[pixel + 1] = 255;
                this.imageData.data[pixel + 2] = 255;
                this.imageData.data[pixel + 3] = 255;
            }
        }

        if(autoUpdate) this.update();
    },

    update: function(){
        this.context.putImageData(this.imageData, 0, 0);
    },

    ready: function(){
        this.clearFrame(true);
    },

    init: function(){

        this.domObj = $(this.domObj)[0];
        this.context = this.domObj.getContext('2d');
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);

        this.util = this._appRoot_.get('Util');
    }
});

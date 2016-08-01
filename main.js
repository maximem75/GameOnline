//------------ Variables Globales ------------//		

var map = [
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,8,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]
];

var $perso;

var mapObject = {
	height : 64,
	width : 64,
	dHeight : 16,
	dWidth : 32,
	perso : {
		x : 0,
		y : 0,
		image : new Image(),
		path : "img/cowboy.png",
		height : 1280/10 ,
		width : 1792/14,
		direction : "down",
		idAction : 0		
	},
	init : function(){	
		for(var y = 0 ; y < map.length ; y++){
			for(var x = 0; x < map[y].length; x++){		
				if(map[y][x] == 8){
					mapObject.perso.x = x;
					mapObject.perso.y = y;
					map[y][x] = 9;
				}
						
				$("#mapContainerId").append("<div class='cell type_"+map[y][x]+"' id='cell_"+x+"_"+y+"' x='"+x+"' y='"+y+"' style='top:"+ mapObject.findTop(x,y) +"px; left:"+ mapObject.findLeft(x,y) +"px; z-index:"+mapObject.findZ(x,y,0)+";'/></div>");
				eventBody("cell_"+x+"_"+y);
			}
		}	
		
		$("#mapContainerId").append("<canvas id='perso' style='top:"+ mapObject.findTop(mapObject.perso.x,mapObject.perso.y) +"px; left:"+ mapObject.findLeft(mapObject.perso.x,mapObject.perso.y) +"px; z-index:"+9999999999999+"; width : "+mapObject.perso.width+"px; height : "+mapObject.perso.height+"px;'/></canvas>");
		$perso = $("#perso");
	},
	findTop : function(x,y){	
		switch(map[y][x]){				
			default:
				return (mapObject.dHeight*y) + (mapObject.dHeight*x);
			break;

		}
		
	},
	findLeft : function(x,y){
		return (mapObject.dWidth*y) - (mapObject.dWidth*x) + (map[0].length * mapObject.dWidth);
	},
	findZ : function(x,y,z){
		return (y*1000)+(x*10)+z;
	},
	checkAvailableCell : function(x,y){
		if(typeof(map[y]) != 'undefined'){
			if(typeof(map[y][x]) != 'undefined'){
				switch(map[y][x]){
					case 1:
						return false;
					break;

					default:
						return true;
					break;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	aStar : {
		complete: function(x,y,done,note,last){
			this.mapA['p'+x+'_'+y] = {
				x:x,
				y:y,
				done:done,
				note:note,
				last:last,
				distance:this.distance(x,y)
			}
		},
		findPath : function(dx,dy,fx,fy){
			this.dx = dx;
			this.dy = dy;
			this.fx = fx;
			this.fy = fy;
			this.end = false;
			this.mapA={};
			this.complete(dx, dy, false, 0, false);
			return this.watchCell(dx,dy,0);
		},
		watchCell : function(x,y,n){
			n++;
			this.mapA['p'+x+'_'+y].done = true;
			var tab = ['a','b','c','d'];
			while(tab.length!=0 && !this.end){
				var c = Math.floor(Math.random()*tab.length);
				switch(tab[c]){
					case 'a':
						this.info(x+1, y, x, y, n);
					break;
					case 'b':
						this.info(x-1,y,x,y,n);
					break;
					case 'c':
						this.info(x,y-1,x,y,n);
					break;
					case 'd':
						this.info(x,y+1,x,y,n);
					break;
				}

				tab.splice(c,1);
			}

			if(this.end){
				var m='p'+this.fx+'_'+this.fy;
				var tabCell = [];
				while(m!='p'+this.dx+'_'+this.dy){
					tabCell.push({x:this.mapA[m].x,y:this.mapA[m].y});
					m=this.mapA[m].last;
				}
				return tabCell;
			} else {
				var bestRange = 99999999999999;
				var bestP = '';
				for(m in this.mapA){
					if(!this.mapA[m].done){
						if(bestRange>this.mapA[m].distance){
							bestRange = this.mapA[m].distance;
							bestP = m;
						}
					}
				}

				if(bestP == ''){
					return 'impossible';
				} else {				
					return this.watchCell(this.mapA[bestP].x, this.mapA[bestP].y, n);
				}
			}
		},
		info:function(x,y,ox,oy,n){
			if(x == this.fx && y==this.fy){
				this.end = true;
			}

			if(mapObject.checkAvailableCell(x,y)){
				if(typeof(this.mapA['p'+x+'_'+y]) == 'undefined'){
					this.complete(x,y,false,n,'p'+ox+'_'+oy);
				} else {
					if(this.mapA['p'+x+'_'+y].note > n){
						this.mapA['p'+x+'_'+y].note = n;
						this.mapA['p'+x+'_'+y].last = 'p'+ox+'_'+oy; 
					}
				}		
			}
		},
		distance:function(x,y){
			return Math.sqrt(Math.pow(this.fx-x,2)+Math.pow(this.fy-y,2));
		}

	}
}

var context = $perso.getContext("2d")

//------------ Fonctions ------------//		
$(document).ready(function(){   
	mapObject.init();
});

function eventBody(id){
	$("#"+id).on("click", function(e){
		var mx = e.pageX;
		var my = e.pageY;
		var tx = Math.floor(mx/mapObject.width);
		var ty = Math.floor(my/mapObject.height);
		if(mapObject.checkAvailableCell(tx,ty)){
			console.log(mapObject.aStar.findPath(mapObject.perso.x, mapObject.perso.y, tx, ty));
			return mapObject.aStar.findPath(mapObject.perso.x, mapObject.perso.y, tx, ty);
		}
	});
}

function getElemFromGrid($cell){
	 return $("#cell_"+parseInt($cell.attr("x"))+"_"+parseInt($cell.attr("y")));
}

function getAnimation(){
	switch(mapObject.perso.direction){
		case "down":
			mapObject.perso.idAction += 1;
			var y = 9;
			var x = mapObject.perso.idAction;
			context.drawImage(mapObject.perso.path, x*64, y*64, 64, 64, )
		break;
		case "right":

		break;
		case "top":

		break;
		case "left":

		break;

	}
}
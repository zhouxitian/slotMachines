/**
 * luck 1.0.2
 * https://github.com/zhouxitian/slotMachines
 * author:zhouxitian@163.com
 */
//2015.11.4 添加直线和老虎机抽奖
(function(){
	appgame=window.appgame||{};
	var f={
		getID:function(elemId){return document.getElementById(elemId);},
		extend:function(target,source){
			for (var p in source){
				if(target.hasOwnProperty(p)){
					if(typeof source[p]==='object'){
						arguments.callee(target[p],source[p]);
					}else{
						target[p] = source[p];
					}
				}else{
					target[p] = source[p];
				}
			}
			return target;
		},
		removeClass:function(o,cn){var re = new RegExp("(\\s*|^)"+cn+"\\b","g");var sName = o.className;o.className = sName.replace(re,"")},
		addClass:function(o,cn){var re = new RegExp("(\\s*|^)"+cn+"\\b","g");o.className +=o.className?(re.test(o.className)?"":" "+ cn):cn},
		//获取实际的样式
		getStyles:function(obj,name){
			if(window.getComputedStyle){
				var getStyles;
				if ( obj.ownerDocument.defaultView.opener ) {
					var computed =obj.ownerDocument.defaultView.getComputedStyle( obj, null );
					getStyles= computed.getPropertyValue(name)||computed[ name];
				}else{
					var computed =window.getComputedStyle( obj, null);
					getStyles= computed.getPropertyValue(name)||computed[ name ];
				}
			}
			return getStyles;
		}
	}
	appgame.slotMachines=function(elemId,opt){
		var t=this;
		t.options={
			x:4,//横向的个数(九宫格)
			y:3,//竖向的个数(九宫格)
			lap:5,//圈数(实际会多跑1圈再跑到中奖项,老虎机不会)
			speed:50,//每转一格的时间(ms)(老虎机时为整个动画的时间,即:transition-duration)
			ease:true,//先慢后快，结束时变慢(老虎机时为速度效果的速度曲线,即:transition-timing-function)
			ratio:4,//变速时，速度的倍数(九宫格,直)
			type:2,//1 九宫格(元素样式会重置) 2 直 3 老虎机
			width:159,//单个奖品图片的宽度 (老虎机)
			height:265,//单个奖品图片的高度 (老虎机)
			effect:1,// 1 循环 2 来回(九宫格,直)
			prizeNum:5,//奖品个数(老虎机)
			callback:null//回调
		}
		t.slider=f.getID(elemId);
		t.children=t.slider.querySelectorAll("li");
		f.extend(t.options,opt);
		if(t.options.ease===true&&t.options.type==3){
			t.options.ease="ease";
		}
		t.init();
	};
	appgame.slotMachines.prototype={
		init:function(){
			var t=this;
			t.playing=false;
			t.effect="goon";
			var obj=t.children;
			if(t.options.type==1){
				var width=t.slider.offsetWidth/t.options.x,
					height=obj[0].offsetHeight;
				t.length=t.options.x*t.options.y-(t.options.x-2)*(t.options.y-2);
				var position =f.getStyles(t.slider,"position");
				if(!position||position=="static"){
					position="relative";
				}
				t.slider.style.cssText="height:"+t.options.y*height+"px;position:"+position;
				var start_btn=t.slider.querySelector(".luck_start_btn");
				start_btn.style.cssText="position:absolute;left:50%;top:50%;margin-top:-"+(t.options.y-2)*height/2+"px;margin-left:-"+(t.options.x-2)*width/2+"px;width:"+(t.options.x-2)*width+"px;height:"+(t.options.y-2)*height+"px;";
				for(var i=0;i<obj.length;i++){
					obj[i].index=i;
					if(i<=t.options.x-1){//上
						obj[i].style.cssText="width:"+width+"px;position:absolute;top:0;left:"+i*width+"px";
					}else if(i<t.options.x+t.options.y-1){//右
						obj[i].style.cssText="width:"+width+"px;position:absolute;top:"+(i-t.options.x+1)*height+"px;left:"+(t.options.x-1)*width+"px";
					}else if(i<t.options.x*2+t.options.y-2){//下
						obj[i].style.cssText="width:"+width+"px;position:absolute;top:"+(t.options.y-1)*height+"px;left:"+(t.options.x-2-(i-t.options.x-t.options.y+1))*width+"px";
					}else if(i<(t.options.x+t.options.y)*2-4){//左
						obj[i].style.cssText="width:"+width+"px;position:absolute;top:"+(t.options.y-2-(i-(t.options.x*2+t.options.y-2)))*height+"px;left:0";
					}else{
						obj[i].style.display="none";
					}
				}
			}else if(t.options.type==2){
				t.length=obj.length;
				for(var i=0;i<obj.length;i++){
					obj[i].index=i;
				}
			}else if(t.options.type==3){
				t.length=obj.length;
				var height=obj[0].clientWidth/t.options.width*t.options.height;
				t.slider.style.height=height+"px";		
				for(var i=0;i<obj.length;i++){
					obj[i].index=i;
					obj[i].style.cssText="transform:translateY(0px);-webkit-transform:translateY(0px);transition:transform 0ms ease 0s;-webkit-transition:-webkit-transform 0ms ease 0s;";
					if(obj[i].children.length<t.options.lap){
						for(var j=0;j<t.options.lap;j++){
							var clone=obj[i].querySelector("img").cloneNode();
							obj[i].appendChild(clone);
						}
					}						
				}	
			}
		},
		getMove:function(pos){
			var t=this;
			if(!t.playing){
				t.playing=true;
				var finish=false,obj=t.slider,lap=0,round=0,speed=t.options.speed,slow=true,slowstop=true;
				if(t.options.type==1||t.options.type==2){
					if(!obj.querySelector(".choose")){
						f.addClass(t.children[0],"choose");
					}
					if(t.options.ease){
						speed=t.options.speed*t.options.ratio;
					}
					if(!pos||pos>t.length){
						pos=1;
					}
					var timeout=setInterval(function(){
						t.start();
						round++;
						if(round==t.length){//计算圈数
							lap++;
							round=0;
						}
						if(t.options.ease&&round==Math.floor(t.length/2)&&slow){//变速结束，进入匀速
							clearInterval(timeout);
							speed=t.options.speed;
							slow=false;
							timeout=setInterval(arguments.callee,speed);
						}
						if(lap>t.options.lap){//圈跑完了
							if(t.options.ease&&slowstop){//圈跑完了，进入变速
								clearInterval(timeout);
								speed=t.options.speed*t.options.ratio;
								slowstop=false;
								timeout=setInterval(arguments.callee,speed);
							}
							if(t.index+1==pos&&finish){//结束后再转到中奖项
								clearInterval(timeout);
								t.playing=false;
								t.options.callback&&t.options.callback.call(t,pos);
							}
							finish=true;
						}
					},speed);
				}else if(t.options.type==3){
					if(typeof pos =="object"&&pos.length==t.length){
						var childrenheight=t.children[0].clientHeight;
						var imgHeight=t.children[0].childNodes[0].clientHeight;
						var height=imgHeight/t.options.prizeNum;
						for(var i=0;i<t.length;i++){
							(function(i){
								var translateY=childrenheight-imgHeight+pos[i]*height;
								t.children[i].style.cssText="transform:translateY(0px);-webkit-transform:translateY(0px);transition:transform 0ms ease 0s;-webkit-transition:-webkit-transform 0ms ease 0s;";
								setTimeout(function(){
									t.children[i].style.cssText="transform:translateY(-"+translateY+"px);-webkit-transform:translateY(-"+translateY+"px);transition:transform "+t.options.speed+"ms "+t.options.ease+" 0s;-webkit-transition:-webkit-transform "+t.options.speed+"ms "+t.options.ease+" 0s;";
									if(i==t.length-1){
										setTimeout(function(){
											t.playing=false;
											t.options.callback&&t.options.callback.call(t,pos);
										},t.options.speed+100);
									}
								},i*100);
							})(i);
						}
					}		
				}
			}
		},
		start:function(){
			var t=this;
			var choose=t.slider.querySelector(".choose");
			if(t.effect=="goon"){
				t.index=choose.index+1;
			}else{
				t.index=choose.index-1;
			}
			if(t.options.effect==1){
				if(t.index==t.length){
					t.index=0;
					t.effect="goon";
				}
			}else{
				if(t.index==t.length){
					t.index-=2;
					t.effect="back";
				}else if(t.index==0){
					t.effect="goon";
				}
			}
			f.removeClass(choose,"choose");
			f.addClass(t.children[t.index],"choose");
		}
	}
})();
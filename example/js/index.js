var luck=new appgame.slotMachines("luck",{//可以设置具体的参数，这里注释了，用默认的
	//x:4,//横向的个数,默认4
	//y:3,//竖向的个数,默认3
	//lap:5,//圈数,默认5(实际会多跑1圈再跑到中奖项,老虎机不会)
	//speed:50,//每转一格的时间(ms),默认50(老虎机时为整个动画的时间,即:transition-duration)
	//ease:true,//先慢后快，结束时变慢,默认true(老虎机时为速度效果的速度曲线,即:transition-timing-function)
	//ratio:4,//变速时，速度的倍数,默认4(九宫格,直)
	type:1,//1 圆(元素样式会重置) 2 直 3 老虎机,默认2
	//effect:1,// 1 循环 2 来回,默认1(九宫格,直)
	callback:function(prize){//结束后的回调
		console.log("luck中奖了"+prize)
	}
});
$(".start1").bind("click",function(){
	if(!luck.playing){//转盘当前没在跑,防止重复点击
		//luck.getMove(9);//固定奖
		var j=Math.round(Math.random()*(luck.length-1))+1;
		//console.log(j)//中奖下标1开始
		luck.getMove(j);//随机获奖
	}
});
var line=new appgame.slotMachines("line",{//可以设置具体的参数，这里注释了，用默认的
	//lap:5,//圈数,默认5(实际会多跑1圈再跑到中奖项,老虎机不会)
	//speed:50,//每转一格的时间(ms),默认50(老虎机时为整个动画的时间,即:transition-duration)
	//ease:true,//先慢后快，结束时变慢,默认true(老虎机时为速度效果的速度曲线,即:transition-timing-function)
	//ratio:4,//变速时，速度的倍数,默认4(九宫格,直)
	//type:2,//1 九宫格(元素样式会重置) 2 直 3 老虎机,默认2
	effect:2,// 1 循环 2 来回(九宫格,直),默认1
	callback:function(prize){//结束后的回调
		console.log("line中奖了"+prize)
	}
});
$(".start2").bind("click",function(){
	if(!line.playing){//转盘当前没在跑,防止重复点击
		//line.getMove(9);//固定奖
		var j=Math.round(Math.random()*(line.length-1))+1;
		//console.log(j)
		//console.log(j)//中奖下标1开始
		line.getMove(j);//随机获奖
	}
});
var tiger=new appgame.slotMachines("tiger",{//可以设置具体的参数，这里注释了，用默认的
	//lap:5,//圈数,默认5(实际会多跑1圈再跑到中奖项,老虎机不会)
	speed:2000,//每转一格的时间(ms),默认50(老虎机时为整个动画的时间,即:transition-duration)
	//ease:"ease",//先慢后快，结束时变慢,默认ease(老虎机时为速度效果的速度曲线,即:transition-timing-function)
	type:3,//1 九宫格(元素样式会重置) 2 直 3 老虎机,默认2
	width:159,//单个奖品图片的宽度 ,默认159(老虎机)
	height:265,//单个奖品图片的高度 ,默认265(老虎机)
	prizeNum:10,//奖品个数,默认5(老虎机)
	callback:function(prize){//结束后的回调
		console.log("tiger中奖了"+prize);
		var flag=true;
		for(var i=0;i<prize.length-1;i++){
			if(prize[i]!=prize[i+1]){
				flag=false;
			}
		}
		if(flag){
			console.log("中大奖了");
		}
	}
});
$(".start3").bind("click",function(){
	if(!tiger.playing){//转盘当前没在跑,防止重复点击
		var j=new Array();
		for(var i=0;i<tiger.length;i++){
			j.push(Math.round(Math.random()*(tiger.options.prizeNum-1)));
		}
		//console.log(j)//中奖下标0开始
		tiger.getMove(j);//(老虎机时要传入跟转动个数一样数量的数组);
	}
});
$(window).resize(function(){//自适应
	luck.init();
	tiger.init();
});
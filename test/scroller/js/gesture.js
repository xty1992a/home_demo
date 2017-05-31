(function(w){
	w.gesTure = function (node,callback){
			var flag = false;
			var startC = 0;
			var startD = 0;
			//gesturestart  手指触碰当前元素，屏幕上有两个或者两个以上的手指
			node.addEventListener('touchstart',function(ev){
				var touch = ev.touches;
				if(touch.length >= 2){
					flag = true;
					
					startC = getC(touch[0],touch[1]);
					startD = getDeg(touch[0],touch[1]);
					
					if(callback&&callback['start']){
						callback['start'].call(node);
					};
				};								
			});
			//gesturechange  手指触碰当前元素，屏幕上有两个或者两个以上的手指位置在发生移动
			node.addEventListener('touchmove',function(ev){
				var touch = ev.touches;
				if(touch.length >= 2){
					
					var nowC = getC(touch[0],touch[1]);
					ev.scale = nowC/startC;
					
					var nowD = getDeg(touch[0],touch[1]);
					//ev.rotation = startD - nowD;
					ev.rotation = nowD - startD;
					
					if(callback&&callback['change']){
						callback['change'].call(node,ev);
					};
				};								
			});
			//gestureend	在gesturestart后, 屏幕上只剩下两根以下（不包括两根）的手指
			node.addEventListener('touchend',function(ev){
				var touch = ev.touches;
					if(flag){
						if(touch.length < 2){
							if(callback&&callback['end']){
								callback['end'].call(node);
							};
						}
						flag = false;
					}
					
												
			});
			
			//求线段的距离
			function getC(p1,p2){
				var a = p1.clientX - p2.clientX;
				var b = p1.clientY - p2.clientY;
				
				var c = Math.sqrt(a*a + b*b);
				
				return c;
			};
			
			//求角度值
			function getDeg(p1,p2){
				var x = p1.clientX - p2.clientX;
				var y = p1.clientY - p2.clientY;
				
				var angle = Math.atan2(y,x);
				angle = angle*180/Math.PI;
				
				return angle;
				
			}
			
			
		}
	
	
	
})(window)

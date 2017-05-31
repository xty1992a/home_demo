(function stopDrop() {
  var lastY;//最后一次y坐标点
  document.body.addEventListener('touchstart', function(event) {
    lastY = event.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
  });
  document.body.addEventListener('touchmove', function(event) {
    var y = event.changedTouches[0].clientY;
    var st = this.scrollTop; //滚动条高度
      lastY = y;
    if (y > lastY && st <= 0) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
      console.log('in')
      event.preventDefault();
    }
  });
})()
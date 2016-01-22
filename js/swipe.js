//手机端图片播放
(function (global) {
    'use strict';
    function swipe(elt,options) {
        var self = this;
        self.slideCell =(typeof elt=="object" && elt) || $(elt) ;
        self.winw = document.documentElement.clientWidth > 640 ? self.slideCell.width() : document.documentElement.clientWidth;
        var settings = {
            delayTime: 300,
            autoplay: true,
            playTime:4000,
            isPage:false,
            sLoad:'_src'
        };
        self.settings = $.extend(settings, options);
        self.slideCellul = self.slideCell.children();
        self.slideCellli = self.slideCellul.children('li');

        self.len = self.slideCellli.length;
        self.delayTime = self.settings.delayTime;
        self.play = null;
        self.index = 0;
        self.slideCellul.width(self.winw * self.len);
        self.slideCellli.width(self.winw);
        self.controlNav();
        self._loadImg(0);
        if (self.settings.autoplay)clearInterval(self.play), self._autoPlay();
        self._Touch({
            TouchEl: self.slideCellul,
            moveCall: function (distX) {
                if (self.settings.autoplay)clearInterval(self.play)
                if ((self.index == 0 && distX > 0) || (self.index >= self.len - 1 && distX < 0 )) {
                    distX = distX * 0.4
                }
                self.translate(-self.index * self.winw + distX, 0);
            },
            endCall: function (distX) {
                if (self.settings.sLoad!=null && Math.abs(distX) > self.winw / 3) {
                    self._loadImg(distX>-0?-1:1);
                    distX > 0 ? self.index-- : self.index++;
                }

                self.swipePlay(true);
                if (self.settings.autoplay)clearInterval(self.play), self._autoPlay();
            }
        });
    }
    swipe.prototype = {
        _Touch: function (options) {
            var settings = {
                TouchEl: '',
                scrollY: 0,
                moveCall: null,
                endCall: null
            }
            var opt = $.extend(settings, options);
            var startX = 0,
                startY = 0,
                distX = 0,
                distY = 0,
                isMove = false,
                scrollY,
                isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
                hasTouch = 'ontouchstart' in window && !isTouchPad,
            //支持PC与手机手势
                touchStart = hasTouch ? 'touchstart' : 'mousedown',
                touchMove = hasTouch ? 'touchmove' : 'mousemove',
                touchEnd = hasTouch ? 'touchend' : 'mouseup';
            //触摸开始函数

            var tStart = function (e) {
                var touches=e.originalEvent.touches || e.touches;
                scrollY = opt.scrollY; //判断是垂直滚动还是水平滚动
                distX = 0;
                if(e.target.tagName=="IMG"){
                    e.preventDefault();
                }
                var point = hasTouch ? e.originalEvent.touches[0] || e.touches[0] : e;
                startX = point.pageX;
                startY = point.pageY;
                isMove = true;
                //添加“触摸移动”事件监听
                opt.TouchEl.on(touchMove, tMove);
                //添加“触摸结束”事件监听
                opt.TouchEl.on(touchEnd, tEnd);
                opt.TouchEl.on('mouseout', tEnd);
            }

            //触摸移动函数
            var tMove = function (e) {
                var touches=e.originalEvent.touches || e.touches;
                //当屏幕有多个touch或者页面被缩放过，就不执行move操作
                if (hasTouch) {
                    if (touches.length > 1 || e.scale && e.scale !== 1) return
                }
                ;
                var point = hasTouch ? touches[0] || touches[0] : e;
                distX = point.pageX - startX;
                distY = point.pageY - startY;
                if (scrollY === 0) {
                    scrollY = !!( scrollY || Math.abs(distX) < Math.abs(distY) );
                }
                if (!scrollY) {
                    if (isMove) {
                        e.preventDefault();
                        opt.moveCall && opt.moveCall(distX, distY);
                    }
                }
            }

            //触摸结束函数
            var tEnd = function (e) {
                if (!scrollY) {
                    if (isMove) {
                        e.preventDefault();
                        isMove = false;
                        opt.endCall && opt.endCall(distX, distY);
                    }
                }
                //删除“触摸移动”事件监听
                opt.TouchEl.off(touchMove, tMove);
                //删除“触摸结束”事件监听
                opt.TouchEl.off(touchEnd, tEnd);
            }
            //添加“触摸开始”事件监听
            opt.TouchEl.on(touchStart, tStart);
            //!hasTouch && opt.TouchEl.on('mouseout',this);
        },
        _loadImg:function(moving,li){
            var self = this;
            var slideli =  li || self.slideCellli;
            var curIndex = self.index + moving;
            var changeImg = function( ind ){
                var img = slideli.eq(ind).children("img");
                for ( var i=0; i<img.length ; i++ )
                {
                    if ( img[i].getAttribute(self.settings.sLoad) ){
                        img[i].setAttribute("src", img[i].getAttribute(self.settings.sLoad) );
                        img[i].removeAttribute( self.settings.sLoad );
                    }
                }
            }
            changeImg( curIndex );
        },
        swipePlay: function (isTouch) {
            var self = this;
            if (self.index >= self.len) {
                self.index = isTouch ? self.index - 1 : 0;
            } else if (self.index < 0) {
                self.index = isTouch ? 0 : self.len - 1;
            }
            self.translate(-self.index * self.winw,self.delayTime);
            if (self.settings.isPage)self.slideCell.find(".page_").text((self.index + 1) + "/" + self.len + "张");
        },
        //动画函数
        translate: function (dist,duration) {
            var self = this;
            if(self.settings.sLoad && typeof duration!=='boolean'){
                self._loadImg(0);
            }else{
                duration=0;
            }
            self.slideCellul.css({
                "transition": duration + "ms",
                "-webkit-transition":duration + "ms",
                "-webkit-transform": "translate3d(" + dist + "px, 0px,0px)"
            });
            self.slideCell.find(".swipenav span").removeClass("cur").eq(self.index).addClass("cur");
        },

        //导航
        controlNav: function () {
            var self = this;
            var html = self.settings.isPage ? "<span class='page_'>1/" + self.len + "张</span>" : '';
            html += "<div class='swipenav'>";
            for (var i = 0; i < self.len; i++) {
                var cur = i == 0 ? " class='cur'" : '';
                html += "<span" + cur + "></span>";
            }
            html += "</div>";
            self.slideCell.append(html);
        },
        //自动播放
        _autoPlay: function () {
            var self = this;
            self.play = setInterval(function () {
                self.index++
                if (self.index >= self.len)self.index = 0;
                self.swipePlay(true);
            }, self.settings.playTime);

        },
        _addImgFun:function(_src){
             var self= this;
             var html="<li class='EIMS_C_swipe_LI' style='width:"+self.winw+"px'><img src='"+_src+"' /></li>";
             self.len=self.len + 1;
             self.slideCellul.append(html);
             self.slideCellul.css({"transition:":"0ms","-webkit-transition":"0ms"}).width(self.winw * self.len);

        },
        //更新方法
        refresh:function(_src,callbark){
            var self = this;
            self._addImgFun(_src);
            $(".swipenav").remove();
            self.controlNav();
            clearInterval(self.play)
            self.settings.autoplay=false;
            callbark && callbark();
        }
    }
    if (typeof define === 'function'){
        define(function () {
            return swipe;
        });
    }else{
        global['swipe'] = global['swipe'] || swipe;
    }
})(this || window);


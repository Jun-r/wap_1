$(function(){
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad;
    var Eevet=hasTouch?"touchstart":"click";
    /**兼容全局高度**/
    (function(){
        var activeEl,classname;
        $(document).on('touchstart.selected mousedown.selected',"[data-avtive]",function(){
            classname = $(this).data('avtive');
            activeEl = $(this).addClass(classname);

        });
        $(document).on('touchmove.selected touchend.selected touchcancel.selected mousemove.selected mouseup.selected mousecancel.selected',function(){
            if(activeEl){
                activeEl.removeClass(classname);
                activeEl = null;
            }
        });
    })();
    /**图片播放js**/
    (function() {
        var opt = {
            autoplay: false,
            playTime: 2000
        }
        var banner = new swipe("#EIMS_C_swipe", opt);
        //更新方法
        $("#ea_l").on(Eevet, function () {
            var src = "/images/banner1.jpg";
            banner.refresh(src, function () {
                console.log("更新成功");
            })
        })
    })();
    /**侧边栏菜单**/
    (function() {
        var html=$("html");
        var asideBg="<div class='aside_bg'></div>";
        var HtmlActive=function(){
            var isHtmlActive=html.hasClass("aside_menu_active");
            if(isHtmlActive){
                html.removeClass("aside_menu_active");
                asideBg.remove();
                $('html,body').off('touchmove');
            }else{
                html.addClass("aside_menu_active").find("body").append(asideBg);
                $('html,body').on('touchmove',function(ev){
                    ev.preventDefault();
                    return false;
                });
            }
        }
        console.log(Eevet)
        $(".silde-menu").on(Eevet,function(){
            HtmlActive();
            return false;
        })
        $(document).on(Eevet,".aside_bg",function(){
            html.addClass("aside_menu_back");
           var timeOut=setTimeout(function(){
                html.removeClass("aside_menu_active aside_menu_back");
                $(".aside_bg").remove();
               $('html,body').off('touchmove');
            },450)
            return false;
        })
    })()
});
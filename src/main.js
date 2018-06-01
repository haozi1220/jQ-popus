/*
* @Author: 李杰
* @Date:   2018-03-19 10:40:24
* @Last Modified by:   李杰
* @Last Modified time: 2018-04-10 18:29:12
*/

// 两秒弹窗
;(function ($) {
    $.extend({
        'Popups': function (options) {
            if($('.pop_ups').length) { return; }
            var opts = $.extend({}, defaults, options);
            var html = '';
            if(opts.type === 'pop_ups') {
                html = $('<div class="pop_ups"><div class="pop_container"><p><span>' + opts.msgText + '</span></p></div></div>');
            }
            if(opts.type === 'confirm') {
                html = $('<div class="confirm_popups"><div><p><span>' + opts.msgText + '</span></p><div class="pop_btn_box"><a id="popups_confirm" href="javascript:;">确定</a></div></div></div><div class="confirm_mask"></div>');
            }
            if (opts.type === 'confirms') {
                html = $('<div class="confirm_popups"><div><p><span>' + opts.msgText + '</span></p><div class="pop_btn_box"><a id="popups_confirm" href="javascript:;">确定</a><a id="popups_cancel" href="javascript:;">取消</a></div></div></div><div class="confirm_mask"></div>');
            }
            if(opts.type === 'unserved') {
                html = $('<div class="pop_ups unServed"><div class="pop_container"><span></span><p>' + opts.msgText + '</p></div></div>');
            }
            if (opts.type === 'unbind') {
                html = $('<div class="confirm_popups"><div><p>' + opts.msgText + '</p><div class="pop_btn_box"><a id="popups_cancel" href="javascript:;">我知道了</a><a id="popups_confirm" href="javascript:;">我是服务专员</a></div></div></div><div class="confirm_mask"></div>');
            }
            $('body').append(html);
            html.css({'margin-left': -html.outerWidth() / 2, 'margin-top': -html.outerHeight() / 2});
            if(opts.type === 'pop_ups' || opts.type === 'unserved') {
                html.css({'margin-left': 0, 'margin-top': 0});
                setTimeout(function () {
                    html.addClass('hide');
                    html.remove();
                }, 2000);
            }
            $('#popups_confirm').click(function() {
                html.remove();
                if(opts.callBack) {
                    opts.callBack();
                }
            });
            $('#popups_cancel').click(function() {
                html.remove();
            });
        },
        'scrollTop': 0,
        'Modalshow': function (eles) {
            var ModalHelper = (function(bodyCls) {
                return {
                    afterOpen: function() {
                        $.scrollTop = $(window).scrollTop();
                        $('body').addClass(bodyCls);
                        $('body').attr('style', 'top: -' + $.scrollTop + 'px');
                    }
                };
            })('modal-open');
            $(eles).show();
            ModalHelper.afterOpen();
            $(eles).on('touchstart touchmove touchend', function(e) {
                e.stopPropagation();
            });
        },
        'Modalhide': function (eles) {
            var ModalHelper = (function(bodyCls) {
                return {
                    beforeClose: function() {
                        $('body').removeClass(bodyCls);
                        $(window).scrollTop($.scrollTop);
                    }
                };
            })('modal-open');
            $(eles).hide();
            ModalHelper.beforeClose();
        }
    });
    var defaults = {
        type: 'pop_ups'
    };
})(window.jQuery);
// banner实现下滑放大，上滑底部收起
$(function () {
    var dragDown = function () {
        var rem = $('html')[0].style.fontSize;
        rem = parseFloat(rem);
        var isTouchStart = false;
        var isScale = false;
        var direction = '';
        var startX = 0;
        var startY = 0;
        var banner = $('.banner');
        var banner_container = $('.banner .container');
        var bannerImg = $('.bannerImg');
        var banner_shrink = $('.banner_shrink');
        var flag = banner_shrink.length;
        var bannerHeight = $('.banner').height();
        var touchStart = function (e) {
            banner.removeClass('flash');
            banner_container.removeClass('flash');
            banner_shrink.removeClass('flash');
            bannerImg.removeClass('flash');
            if($(window).scrollTop() <= 0) {
                direction = 'down';
            }
            if(direction === 'down') {
                isTouchStart = isScale = true;
            }
            startX = e.changedTouches[0].pageX;
            startY = e.changedTouches[0].pageY;
        };
        var touchMove = function (e) {
            if(isTouchStart) {
                if($(window).scrollTop() <= 0) {
                    direction = 'down';
                }
                var dDis = Math.abs(e.touches[0].pageX - startX) - Math.abs(e.touches[0].pageY - startY);
                if(dDis > 0) return false;
                if(e.changedTouches[0].pageY - startY < 0) direction = 'up';
                if(e.changedTouches[0].pageY - startY > 0 && isScale && direction == 'down') {
                    e.preventDefault();
                    var scale = (1 + (e.changedTouches[0].pageY - startY) / (2 * bannerHeight)).toFixed(2);
                    if(scale >= 2) scale = 2;
                    bannerImg.attr('style', '-webkit-transform: scale(' + scale + '); transform: scale(' + scale + ')');
                    var H = bannerImg.height() * scale / rem;
                    banner.height(H + 'rem');
                    banner_container.height(H + 'rem');
                    banner_shrink.height(H + 'rem');
                }
            }
        };
        var touchEnd = function (e) {
            if(direction === 'down') {
                if(flag) {
                    banner.addClass('flash').height('11.30667rem');
                    banner_container.addClass('flash').height('11.30667rem');
                    banner_shrink.addClass('flash').height('11.30667rem');
                    bannerImg.addClass('flash').attr('style', '-webkit-transform: scale(1); transform: scale(1)');
                } else {
                    banner.addClass('flash').height('14.44267rem');
                    banner_container.addClass('flash').height('14.44267rem');
                    bannerImg.addClass('flash').attr('style', '-webkit-transform: scale(1); transform: scale(1)');
                }
            }
            if(direction === 'up') {
                banner.height('13.7rem');
            }
            window.removeEventListener('touchstart', function (e) { touchStart(e);}, { passive: false });
            window.removeEventListener('touchmove', function (e) { touchMove(e);}, { passive: false });
            window.removeEventListener('touchend', function (e) { touchEnd(e);}, { passive: false });
        };
        window.addEventListener('touchstart', function (e) { touchStart(e);}, { passive: false });
        window.addEventListener('touchmove', function (e) { touchMove(e);}, { passive: false });
        window.addEventListener('touchend', function (e) { touchEnd(e);}, { passive: false });
    };

    dragDown();

    // 邮箱填写展现下拉选择框提示，点击下拉框自动填写如邮箱
    var $email_input = $('#email_input');
    var $ul = $('#email_select');
    var $text = $('.input_text');
    $email_input.bind('input propertychange', function (e) {
        var $this = $(this);
        var text = $this.val();
        if(text.search(/@(.{2,})$/) > -1 || !text) {
            $ul.hide();
            return;
        }
        if(text) {
            text = text.replace(/@(.*)$/g, '');
            $ul.show();
        }
        $text.html(text);
    });
    $ul.on('click', 'li', function() {
        var $this = $(this);
        $('#email_input').val($this.find('span').eq(0).html() + '' + $this.find('span').eq(1).html());
        $ul.hide();
    });
    $('body').on('click', function() {
        $ul.hide();
    });
    // 产品切换信息选项卡
    var pro_tab_item = $('.pro_tab .tab_menu .item');
    pro_tab_item.on('click', function() {
        var tab_parent = $(this).parent().parent();
        tab_parent.find('.tab_menu .item').removeClass('active');
        $(this).addClass('active');
        var index = tab_parent.find('.tab_menu .item.active').index();
        tab_parent.find('.tab_content .content_box').hide();
        tab_parent.find('.tab_content .content_box').eq(index).show();
    });

    // 产品卡单折叠页
    $('.box_fold_switch').on('click', function() {
        var _on = $(this).find('.icon-xiala1');
        var _off = $(this).find('.icon-shouqi1');
        $(this).find('.svg_ctrl').toggleClass('able');
        if(_on.parent().hasClass('able')) {
            $(this).next('.box_fold_content').hide();
            $(this).css({'margin-bottom': ''});
        }
        if (_off.parent().hasClass('able')) {
            $(this).next('.box_fold_content').show();
            $(this).css({'margin-bottom': '3px'});
        }
    });
    // 服务专员点击显示隐藏
    $('.sa_title, .sa_title .sa_right').click(function () {
        if($(this).find('i.icon').hasClass('rotate')) {
            $(this).find('i.icon').removeClass('rotate');
            $('.sa_content').hide();
        }else {
            $(this).find('i.icon').addClass('rotate');
            var scrollTop = $(window).scrollTop() + $('.sa_content').height();
            $('.sa_content').show();
            $(window).scrollTop(scrollTop);
        }
    });

    // 立即购买 立即支付说明
    $('.immediate_payment .explain').click(function () {
        $(this).find('i.icon').toggleClass('rotate');
        $('.explain_pop, .mask').toggleClass('show');
        if($('.explain_pop, .mask').hasClass('show')) {
            $('html, body').css('overflow', 'hidden');
            $('body').bind('touchmove', function (ev) { ev.preventDefault(); });
        }else {
            $('html, body').css('overflow', 'auto');
            $('body').unbind('touchmove');
        }
    });

    $('.mask').click(function () {
        $('.explain_pop, .mask').removeClass('show');
        $('.immediate_payment .explain').find('i.icon').removeClass('rotate');
        $('html, body').css('overflow', 'auto');
        $('body').unbind('touchmove');
    });

    // 产品列表_团险_保险条款 点击切换
    $('.git_item_title').each(function (index) {
        $(this).click(function () {
            if ($(this).find('i.icon').hasClass('rotate')) {
                $(this).find('i.icon').removeClass('rotate');
                $(this).next().hide();
            }else {
                $(this).find('i.icon').addClass('rotate').parent().parent().siblings().find('.git_item_title i.icon').removeClass('rotate');
                $(this).next().show().prev().parent().siblings().find('.git_termcontent').hide();
            }
        });
    });

    // 点击二维码 弹窗
    $('#pops').click(function (e) {
        $.Modalshow('.QRcode_pop, .QRcode_mask');
    });

    // 点击遮罩弹窗消失
    $('.QRcode_mask').click(function (e) {
        $.Modalhide('.QRcode_pop, .QRcode_mask');
    });

    // 点击问号。弹出详情弹窗
    $('#show_detail_pop').click(function (event) {
        $.Modalshow('.details_pop, .detail_mask');
    });
    // 点击遮罩或“我知道了”按钮弹窗消失
    $('.detail_mask, .block_btn').click(function (e) {
        $.Modalhide('.details_pop, .detail_mask');
    });
    // 改变select的文字颜色
    $('select').each(function () {
        var $this = $(this);
        var options = $(this).find('option');
        var item = options[0];
        if($(this).val() === $(item).text()) {
            $(this).css('color', '#666');
        }
        $(this).change(function () {
            if($(this).val() === $(item).text()) {
                $(this).css('color', '#666');
            } else {
                $(this).css('color', '#333');
                $.each(options, function(i, item) {
                    if($(item).html().length > 12 && $this.val() == $(item).attr('value')) {
                        $(this).css('direction', 'ltr');
                    } else {
                        $(this).css('direction', 'rtl');
                    }
                });
            }
        });
    });
});

// 首页底部tab切换
$(function() {
    var This = $('.home_tab .menu_tab a.tab_item');
    var flag_Arr = [true, true, true];
    This.each(function (index) {
        $(this).on('touchstart', function(ev) {
            ev.stopPropagation();
            $(this).addClass('active').parent().siblings().find('a').removeClass('active');
            $.each(This, function(index, item) {
                $(item).next().hide();
            });
            if (flag_Arr[index]) {
                $(this).next().show();
            } else {
                $(this).next().hide();
            }
            for(var i = 0; i < 3; i++) {
                if(i == index) {
                    flag_Arr[i] = !flag_Arr[i];
                } else {
                    flag_Arr[i] = true;
                }
            }
        });
    });
    // 菜单冒泡阻止
    $('.menu_box').on('touchstart', function (e) {
        e.stopPropagation();
    });

    // 点击其他地方 菜单消失
    $('body').children().on('touchstart', function () {
        $('.menu_box').hide();
        flag_Arr = [true, true, true];
    });
});

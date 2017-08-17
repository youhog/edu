/**
 * Created by Nancy on 2017/5/8.
 */

//根据屏幕大小动态显示视图布局


    // setCookie("loginSuc",true);
    // setCookie("followSuc",true);
    // delCookie("loginSuc");

    //首先判断是否登录



var cancelBtn = document.querySelector(".cancel");
var attentionBtn = document.querySelector(".attention");


setFollowView();

function setFollowView() {
//判断是否登录
    if (isLogin()) {
        //是否关注
        if (isFollowSuc()) {
            cancelBtn.style.display = "block";
            attentionBtn.style.display = "none";


        } else {
            cancelBtn.style.display = "none";
            attentionBtn.style.display = "block";
        }

    } else {
        cancelBtn.style.display = "none";
        attentionBtn.style.display = "block";
    }
}


/**
 * 是否登录
 * @returns {boolean}
 */
function isLogin() {
    var cookie = document.cookie;
    return cookie.indexOf("loginSuc") >= 0;
}


/**
 * 是否关注
 * @returns {boolean}
 */
function isFollowSuc() {
    var cookie = document.cookie;
    return cookie.indexOf("followSuc") >= 0;
}

var login_form = document.querySelector(".bg-l");
var closeBtn = document.querySelector(".bg-l>div>i");

var loginBtn = document.querySelector("#loginBtn");


var cancel_att=document.querySelector("#cancel_att");

//取消关注
addEvent(cancel_att, 'click', function () {

    delCookie("followSuc",true);
    setFollowView();

}, false);



//设置关注监听：打开登陆
addEvent(attentionBtn, 'click', function () {

    if (!isLogin()) {
        //没有登陆
        login_form.style.display = "block";

    }else{
        setCookie("followSuc",true);
    }

    setFollowView();
}, false);

//关闭登陆
addEvent(closeBtn, 'click', function () {
    setFollowView();
    login_form.style.display = "none";

}, false);


var urlLogin = "http://study.163.com/webDev/login.htm";
// var userName = "studyOnline";
// var password = "study.163.com";
var userName = document.querySelector("#userName");
var password =document.querySelector("#password");
//开始登陆
addEvent(loginBtn, 'click', function () {

    var data_login = "?userName=" + md5(userName.value) + "&password=" + md5(password.value);

      ajaxGet(urlLogin, data_login, function (result) {

        result = result.trim();
        if (result == "1") {

            setCookie("loginSuc",true);
            setCookie("followSuc",true);
            setFollowView();
            login_form.style.display = "none";

        } else {
            alert("登陆失败！");
        }


    });


}, false);


function ajaxGet(url, data, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url + data, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (callback) {
                callback(xhr.responseText);
            }

        }

    };

}


/**
 * 设置cookie
 * @param name
 * @param value
 */
function setCookie(name, value) {
    // var Days = 30;
    // var exp = new Date();
    // exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    //document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    document.cookie = name + "=" + escape(value) + ";";
}
/**
 * 删除cookie
 * @param name
 */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/*
 读取单个cookies
 */
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    else {
        return null;
    }
}


//获取cookie并转成JSON
function getcookie() {
    var cookie = {};
    var all = document.cookie;
    if (all == '') {
        return cookie;
    }
    var list = all.split(';');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}

//getElementsByClassName 兼容



//事件兼容
function addEvent(ele, type, listener, useCapture) {
    if (document.addEventListener) {
        ele.addEventListener(type, listener, useCapture);
    } else {
        ele.attachEvent('on' + type, listener);
    }
}


//判断小黄条是否关闭
var hint = document.querySelector('.bghint');
var closehint = hint.querySelector('span');

function hintoc() {
    if (document.cookie.indexOf("yellohint")>=0) {
        hint.style.display = 'none';
    } else {
        hint.style.display = 'block';
    }
}

//关闭小黄条
var clickdis = function (event) {
    event = event || window.event;
    hint.style.display = 'none';
    document.cookie = "yellohint=1;";
}
addEvent(closehint, 'click', clickdis, false);


//轮播图
var interval;//定时器
var next;//后一张
var list;//获得图片列表
var buttons;//获得小圆点列表
var index; //当前值
window.onload = function () {
    //获得父容器
    var container = document.getElementById('container');
    //获得图片列表
    list = document.getElementById('list').getElementsByTagName('li');
    //获得小圆点
    buttons = document.getElementById('buttons').getElementsByTagName('i');
    //当前值
    index = 0;
    //后一张
    next = 1;

    start();
    startHot(); //hot列表更新
    hintoc();//小黄条的隐藏
    //不需要带括号，带括号接收的是一个值
    container.onmouseout = start;
    container.onmouseover = end;
}
//自动轮播开始
function start() {
    interval = setInterval(go, 5000);
}
//自动轮播中止
function end() {
    clearInterval(interval);
}
//动画效果
function go() {
    var num = 0.1;//增值
    var time = 1;//执行次数
    if (next >= 3) {
        next = next % 3;
    }
    //循环一次之后将第一张放到最上面
    list[next].style.zIndex = 1;
    list[index].style.zIndex = 0;

    var timernext = setInterval(function () {
        if (time > 10) {
            clearInterval(timernext);
            list[index].style.left = '100%';
            buttons[index].className = '';
            index = next;
            buttons[index].className = 'on';
            next++;
        } else {
            list[next].style.left = (100 - time * num * 100) + '%';
            list[next].style.opacity = time * num;
            list[index].style.opacity = 1 - time * num;
            time++;
        }
    }, 50);
}


//页面构建

var epage = document.getElementById('checkdetail');
var apsize;
var pwidth;
var wsize;



//使用appendChild构建
var nowHtml=function (number) {
    if (!epage.currentStyle) {
        pwidth = window.getComputedStyle(epage)["width"];
    } else {
        pwidth = epage.clientWidth;
    }
    pwidth = parseInt(pwidth);
    wsize = Math.floor((pwidth / 242));
    apsize = wsize * 5;//每页的数据个数
    var ali = epage.innerHTML;//获取一个数据的html
    for (var i = number; i < apsize; i++) {
        var li=document.createElement('li');
        epage.appendChild(li);
        var img=document.createElement('img');
        img.style.width="223px";
        img.style.height="125px";
        li.appendChild(img);
        var div=document.createElement('div');
        div.className="detsmal";
        li.appendChild(div);
        var p=document.createElement('p');
        p.innerText="生活中不乏有很多美好的画面，何不用画笔记录下来呢？那么久跟几分钟网一起来记录美好画面吧！"
        div.appendChild(p);
        var span=document.createElement('span');
        span.innerText="音频帮";
        div.appendChild(span);
        var br1=document.createElement('br');
        div.appendChild(br1);
        var i1=document.createElement('i');
        i1.innerText="510";
        div.appendChild(i1);
        var br2=document.createElement('br');
        div.appendChild(br2);
        var strong=document.createElement('strong');
        strong.innerText="￥800.00";
        div.appendChild(strong);
        //第二层
        var div2=document.createElement('div');
        div2.className="detbig";
        li.appendChild(div2);
        var img2=document.createElement('img');
        img2.style.width="223px";
        img2.style.height="125px";
        div2.appendChild(img2);

        var h3=document.createElement('h3');
        h3.innerText="手绘画系列课程";
        div2.appendChild(h3);


        var p1=document.createElement('p');
        p1.className="people";

        div2.appendChild(p1);
        var i2=document.createElement('i');
        i2.innerText="&nbsp;57";
        p1.appendChild(i2);
        var span3=document.createElement('span');
        span3.innerText="人在学";
        p1.appendChild(span3);



        var p2=document.createElement('p');
        p2.className="author";
        p2.innerText="发布者：";
        div2.appendChild(p2);
        var span1=document.createElement('span');
        span1.innerText="几分钟网";
        p2.appendChild(span1);

        var p3=document.createElement('p');
        p3.className="sort";
        p3.innerText="分类：";
        div2.appendChild(p3);
        var span2=document.createElement('span');
        span2.innerText="手绘设计";
        p3.appendChild(span2);

        var p4=document.createElement('p');
        p4.className="content";
        p4.innerText="生活中不乏有很多" +
            "美好的画面，何不用画笔记录下来呢？那么就跟"+
            "几分钟网一起来记录美好画面吧！"
        div2.appendChild(p4);

    }

}
nowHtml(0);
//清空课程并重建
var reHtml=function () {
    var reapage=document.getElementById('checkdetail');
    var reli=reapage.childNodes;
    console.log(reli.length);
    for (var i=reli.length-1;i>=0;i--){
        reapage.removeChild(reli[i]);
    }
    nowHtml(0);
    getDet("http://study.163.com/webDev/couresByCategory.htm", {
        pageNo: page,
        psize: apsize,
        type: typeNow
    }, getDetail);
}

addEvent(window,'resize',reHtml,false);
addEvent(window,'load',reHtml,false);


//页面选择
var selectpage = document.getElementById("page");
var selectapage = selectpage.querySelectorAll("li");
var selectlpage = selectpage.querySelector(".left");
var selectrpage = selectpage.querySelector(".right");


//点击页码进行选择
var selectp = function (event) {
    event = event || window.event;
    for (var i = 0; i < selectapage.length; i++) {
        selectapage[i].className = '';
    }
    var thisele = event.target;
    thisele.className = 'checka';
    page = thisele.innerText;
    var allpage=Math.floor(50/apsize);
    page = page % allpage;
    if(page==0){page=allpage;}
    getDet("http://study.163.com/webDev/couresByCategory.htm", {pageNo: page, psize: apsize, type: typeNow}, getDetail);
}
for (var i = 0; i < selectapage.length; i++) {
    addEvent(selectapage[i], 'click', selectp, false);
}
//点击左右翻页
var selectrl = function (event) {
    event = event || window.event;
    for (var i = 0; i < selectapage.length; i++) {
        if (selectapage[i].className == 'checka') {
            selectapage[i].className = '';
            page = i +1;
        }
    }
    var thisele = event.target;
    if (thisele.className == 'right') {
        page = (page +1);
        if (page == 9) {
            page = 1;
        }


    } else {
        page = (page - 1);
        if (page == 0) {
            page = 8;
        }

    }
    selectapage[page - 1].className = 'checka';
    var allpage=Math.floor(50/apsize);
    page =  page % allpage;
    if(page==0){page=3;}
    getDet("http://study.163.com/webDev/couresByCategory.htm", {pageNo: page, psize: apsize, type: typeNow}, getDetail);

}
addEvent(selectrpage, 'click', selectrl, false);
addEvent(selectlpage, 'click', selectrl, false);


//获取课程列表
function getDet(url, options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                var arrText = JSON.parse(xhr.responseText);
                callback(arrText);
            }
        }
    }
    var data = url + '?' + serialize(options);
    xhr.open('GET', data);
    xhr.send();
}


function serialize(op) {
    if (!op) return '';
    var pairs = [];
    for (var name in op) {
        if (!op.hasOwnProperty(name))continue;
        if (typeof op[name] === 'function')continue;
        var value = op[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}


function getDetail(x) {
    //给每个课程添加数据
    var proul = document.getElementById('checkdetail').querySelectorAll('li');
    for (var i = 0; i < proul.length; i++) {
        var bigphoto = proul[i].querySelectorAll('img');
        var learn = proul[i].querySelector('.detsmal i');
        var price = proul[i].querySelector('.detsmal strong');
        var namesmal = proul[i].querySelector('.detsmal span');
        var description = proul[i].querySelector('.detsmal p');
        var classname = proul[i].querySelector('.detbig h3');
        var peoplebig = proul[i].querySelector('.detbig .people i');
        var authorbig = proul[i].querySelector('.detbig .author span');
        var sortbig = proul[i].querySelector('.detbig .sort span');
        var content = proul[i].querySelector('.detbig .content');
        // bigphoto[0].setAttribute('src', x.list[i].bigPhotoUrl);
        // bigphoto[1].setAttribute('src', x.list[i].bigPhotoUrl);
        bigphoto[0].src=x.list[i].bigPhotoUrl;
        bigphoto[1].src=x.list[i].bigPhotoUrl;
        learn.childNodes[0].nodeValue = x.list[i].learnerCount;
        peoplebig.childNodes[0].nodeValue = x.list[i].learnerCount;
        description.childNodes[0].nodeValue = x.list[i].description ;
        content.childNodes[0].nodeValue =x.list[i].description;
        classname.childNodes[0].nodeValue= x.list[i].name;
        namesmal.childNodes[0].nodeValue= x.list[i].name;
        authorbig.childNodes[0].nodeValue= x.list[i].provider;
        sortbig.childNodes[0].nodeValue= x.list[i].categoryName;

        if (x.list[i].price == 0) {
            price.childNodes[0].nodeValue = "免费课程";
        } else {
            price.childNodes[0].nodeValue = "￥" + x.list[i].price;
        }

    }
}

// 获得当前页码
var pagelist = document.getElementById('page').getElementsByTagName('li');
var page;
var typeNow = "10";
apsize = apsize.toString();
for (var i = 0; i < pagelist.length; i++) {
    if (pagelist[i].className == 'checka') {
        var allpage=Math.floor(50/apsize);
        i = i + 1;
        page = i % allpage;
        console.log(page);
    }
}
getDet("http://study.163.com/webDev/couresByCategory.htm", {pageNo: page, psize: apsize, type: typeNow}, getDetail);



//右侧最热排行
var hotnum = 0;
function getHot(url, callback, num) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                var arrText = JSON.parse(xhr.responseText);
                callback(arrText, num);
            }
        }
    }

    xhr.open('GET', url);
    xhr.send();
}

function hot(x, n) {
    var boxul = document.getElementById('hot').getElementsByTagName('li');
    for (var childli = 0; childli < boxul.length; childli++) {
        //设置课程小图片
        var img = boxul[childli].querySelector('img');
        img.setAttribute('src', x[childli + n].smallPhotoUrl);

        //设置在学人数
        var peoplenum = boxul[childli].querySelector('div>i');
        //兼容浏览器获取节点文本
        peoplenum.childNodes[0].nodeValue = x[childli + n].learnerCount;

        //设置课程名
        var classname = boxul[childli].querySelector('div>p');
        //兼容浏览器获取节点文本
        classname.childNodes[0].nodeValue = x[childli + n].name;
    }
}

//实现每5s更新一次
var intervalHot;
function startHot() {
    intervalHot = setInterval(hotchange, 5000);
}

function hotchange() {
    if (hotnum > 10) {
        hotnum = 0;
    }

    hotnum = hotnum % 10;
    getHot("http://study.163.com/webDev/hotcouresByCategory.htm", hot, hotnum);
    hotnum++;
}


/*交互*/

//tab切换
var tab1 = document.getElementById('10');
var tab2 = document.getElementById('20');
var clicktab = function (event) {
    event = event || window.event;
    var clearele = document.getElementById('kind').getElementsByTagName('li');
    clearele[0].className = '';
    clearele[1].className = '';
    var elem = event.target;
    elem.className = 'checktab';
    if (elem.id == '10') {
        typeNow = "10";
        getDet("http://study.163.com/webDev/couresByCategory.htm", {
            pageNo: '1',
            psize: apsize,
            type: typeNow
        }, getDetail);
    } else {
        typeNow = "20";
        getDet("http://study.163.com/webDev/couresByCategory.htm", {
            pageNo: '1',
            psize: apsize,
            type: typeNow
        }, getDetail);
    }
    for (var i = 0; i < pagelist.length; i++) {
        if (pagelist[i].className == 'checka') {
            pagelist[i].className = '';
        }
    }
    pagelist[0].className = "checka";
}
addEvent(tab1, 'click', clicktab, false);
addEvent(tab2, 'click', clicktab, false);


//视频大图
var bgb = document.querySelector('.bg-b');
var body = document.getElementsByName('body');
var organ = document.querySelector('.organ');
var clickvideoo = organ.querySelector('div');
var clickvideoc = bgb.querySelector('i');
var playvideo = bgb.querySelector('video');
var clickclose = function (event) {
    event = event || window.event;
    bgb.style.display = 'none';
    playvideo.currentTime = 0;
}
var clickopen = function (event) {
    event = event || window.event;
    bgb.style.display = 'block';
}
addEvent(clickvideoo, 'click', clickopen, false);
addEvent(clickvideoc, 'click', clickclose, false);



//悬停搜索图标变色
var search = document.querySelectorAll('.search');
var searchi = document.getElementById('search');
var searchF = function (event) {
    event = event || window.event;
    searchi.style.backgroundPosition = "0 -105px";
}
var searcho = function (event) {
    event = event || window.event;
    searchi.style.backgroundPosition = "0 -79px";
}
for (var i = 0; i < search.length; i++) {
    search[i].onmouseover = searchF;
    search[i].onmouseout = searcho;
}



















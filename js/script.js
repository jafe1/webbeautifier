var DateDiff = {
  inDays: function(d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();
    return parseInt((t2-t1)/(24*3600*1000));
  },
  inWeeks: function(d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();
    return parseInt((t2-t1)/(24*3600*1000*7));
  },
  inMonths: function(d1, d2) {
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();
    return (d2M+12*d2Y)-(d1M+12*d1Y);
  },
  inYears: function(d1, d2) {
    return d2.getFullYear()-d1.getFullYear();
  }
}

function formatDate(date){
return [('0'+(date.getMonth()+1)).slice(-2), ('0'+date.getDate()).slice(-2), date.getFullYear()].join('/');
}

(function($){
if(!(window.localStorage.getItem("englishLeague"))){
$.get("js/pl.json", function(ar){
window.localStorage.setItem("englishLeague", JSON.stringify(ar));
window.location.reload();
//console.log(JSON.stringify(window.localStorage.getItem("englishLeague"), null, 2));
});
}

$(".btns .imso_mh__score").eq(0).click(function(){
$("body").removeClass("preload");
$("body").removeClass("preloads");
$("body").addClass("updates");
});

$(".btns .imso_mh__score").eq(1).click(function(){
$("body").removeClass("updates");
$("body").removeClass("preload");
$("body").addClass("preloads");
});

$(".preloades, #updates").click(function(e){
if(($(e.target).parent(0).attr("class").indexOf("EIlDfe")) > -1){
$("body").removeClass("preload");
$("body").removeClass("preloads");
$("body").removeClass("updates");
}
});


})(jQuery);

(function($){

if(window.localStorage.getItem("englishLeague")){
window.englishLeague = JSON.parse(window.localStorage.getItem("englishLeague"));
window.standing = window.englishLeague["standing"];
window.club = window.englishLeague["club"];
window.fixture = window.englishLeague["fixture"];
window.tmp = [];
window.temp = [];


$.each(standing, function(a,b){
club[a]["id"] = b.id;
club[a]["name"] = b.name;

var c = b.name;
var last = new Array(38);
var mp = 0;
var draw = 0;
var won = 0;
var lose = 0;
var GF = 0;
var GA = 0;
var i = 0;

$.each(fixture, function(x,y){
last[i] = "not";
$.each(y, function(u,v){
if(v.home && v.away){
if(v.hs && v.as){

if((v.home == c) || (v.away == c)){
mp = mp + 1;
if(parseInt(v.hs) == parseInt(v.as)){
draw = draw + 1;
last[i] = "draw";
}
}

if(v.home == c){
GF = GF + parseInt(v.hs);
GA = GA + parseInt(v.as);
if(parseInt(v.hs) > parseInt(v.as)){
won = won + 1;
last[i] = "won";
}
if(parseInt(v.hs) < parseInt(v.as)){
lose = lose + 1;
last[i] = "lose";
}
}
if(v.away == c){
GF = GF + parseInt(v.as);
GA = GA + parseInt(v.hs);
if(parseInt(v.as) > parseInt(v.hs)){
won = won + 1;
last[i] = "won";
}
if(parseInt(v.as) < parseInt(v.hs)){
lose = lose + 1;
last[i] = "lose";
}
}

}
}
});
i++;
});

club[a]["mp"] = mp;
club[a]["last"] = last;

standing[a]["MP"] = mp;
standing[a]["W"] = won;
standing[a]["D"] = draw;
standing[a]["L"] = lose;
standing[a]["GF"] = GF;
standing[a]["GA"] = GA;
standing[a]["GD"] = parseInt(GF) - parseInt(GA);
standing[a]["GF"] = GF;
standing[a]["Pts"] = parseInt(parseInt(won) * 3) + parseInt(draw);
standing[a]["last"] = last;

});

setTimeout(function(){
var arr = standing.sort(firstBy(function (v1,v2){return v1.Pts-v2.Pts;},-1).thenBy(function (v1,v2){return v1.GD - v2.GD},-1).thenBy(function (v1,v2){return v1.GF-v2.GF},-1).thenBy(function (v1,v2){return v2.GA - v1.GA},-1).thenBy(function (v1,v2){return v1.W-v2.W},-1).thenBy(function (v1,v2){return v1.D-v2.D},-1).thenBy(function (v1,v2){return v2.L - v1.L},-1).thenBy(function (v1,v2){return v2.MP - v1.MP},-1).thenBy("name", "asc").thenBy("id"));
var ar = club.sort(firstBy("name", "asc"));
window.club = ar;
$.each(ar, function(a,b){
tmp.push(b.name);
});
englishLeague.club = ar;

$.each(arr, function(a,b){
arr[a]["rank"] = a+1;
});
window.standing = arr;
$.each(arr, function(a,b){
temp.push(b.name);
});
englishLeague.standing = arr;

window.localStorage.setItem("englishLeague", JSON.stringify(englishLeague));

//$("html").html('<textarea id="txt" style="width:350px;height:400px">' + JSON.stringify(club, null, 2) + '</textarea>');

}, 500);

//$("html").html('<textarea id="txt" style="width:350px;height:400px">' + JSON.stringify(englishLeague, null, 2) + '</textarea>');

$("body").removeClass("preload");

}
})(jQuery);


$(document).ready(function(){
//console.log($(".imso_mh__content").css("height"))

var ob = window.fixture;
//var l = window.club;
var l = club.sort(firstBy("name", "asc"));

var f = '<select><option value="">Club</option>';
$.each(l, function(d,e){
f = f + '<option value="' + e.name + '">' + e.name + '</option>';
});
f = f + '</select>';
$("#select").append(f);

var pph = 0;
var wwh = 0;
var ddh = 0;
var llh = 0;
var ggfh = 0;
var ggah = 0;

document.querySelector("#select select").addEventListener("change", function(){
$("#updates .match").remove("");
var val = this.value;
var idx = this.selectedIndex - 1;
pph = 0;
wwh = 0;
ddh = 0;
llh = 0;
ggfh = 0;
ggah = 0;

$.each(ob, function(a,b){
var x = parseInt(a.replace("matchday", ""));

$.each(b, function(c,d){
var y = parseInt(c.replace("game", ""));

if((d.home == val) || (d.away == val)){
//console.info(c);
var dd = new Date(d.date);
var ddd = "";
if(d.hs && d.as){
pph = pph + 1;
if((d.home == val) && (parseInt(d.hs) > parseInt(d.as))){
wwh = wwh + 1;
}
else if((d.away == val) && (parseInt(d.hs) < parseInt(d.as))){
wwh = wwh + 1;
}
if((d.home == val) && (parseInt(d.hs) < parseInt(d.as))){
llh = llh + 1;
}
else if((d.away == val) && (parseInt(d.hs) > parseInt(d.as))){
llh = llh + 1;
}
if((d.home == val) && (parseInt(d.hs) == parseInt(d.as))){
ddh = ddh + 1;
}
if(d.home == val){
ggfh = ggfh + parseInt(d.hs);
ggah = ggah + parseInt(d.as);
}
else if(d.away == val){
ggfh = ggfh + parseInt(d.as);
ggah = ggah + parseInt(d.hs);
}

}
if(d.date){
ddd = (dd.getMonth()+1) + '/' + dd.getDate() + '/' + dd.getFullYear();
}
else{
ddd = "";
}

$("#update").append(drawMatch(d.home,d.hs,ddd,d.as,d.away,x,y));
}
});
});

setTimeout(function(){
$("#updates .detail.b .c").eq(0).html(l[idx]["mp"]);
$("#updates .detail.b .a").eq(0).html(l[idx]["name"]);
$("#updates .detail.b .c").eq(1).html(itemCounter(l[idx]["last"], "won"));
$("#updates .detail.b .c").eq(2).html(itemCounter(l[idx]["last"], "draw"));
$("#updates .detail.b .c").eq(3).html(itemCounter(l[idx]["last"], "lose"));

$("#updates .detail.b .c").eq(4).html((itemCounter(l[idx]["last"], "won") * 3) + itemCounter(l[idx]["last"], "draw"));
$("#updates .detail.b .c").eq(5).html(ggfh);
$("#updates .detail.b .c").eq(6).html(ggah);
$("#updates .detail.b .c").eq(7).html(ggfh - ggah);

$(".match").each(function(){
var $t = $(this);

var $k = ($t.find(".btn.sv")).get(0);
var m = $t.data("md");
var g = $t.data("game");
var xx = parseInt(m.replace("matchday", ""));


$k.addEventListener("click", function(){
var hs = $.trim($t.find(".btn.sc").eq(0).html());
var as = $.trim($t.find(".btn.sc").eq(1).html());
ob[m][g]["hs"] = hs;
ob[m][g]["as"] = as;

var zh = tmp.indexOf(ob[m][g]["home"]);
var za = tmp.indexOf(ob[m][g]["away"]);
var zhh = club[zh]["last"][xx-1];
var zaa = club[za]["last"][xx-1];

if(parseInt(hs) > parseInt(as)){
zhh = "won";
zaa = "lose";
}
else if(parseInt(hs) < parseInt(as)){
zhh = "lose";
zaa = "won";
}
else if(parseInt(hs) == parseInt(as)){
zhh = "draw";
zaa = "draw";
}

englishLeague.club[zh]["last"][xx-1] = zhh;
englishLeague.club[za]["last"][xx-1] = zaa;
englishLeague[((standing[temp.indexOf(ob[m][g]["home"])])["last"])[xx-1]] = zhh;
englishLeague[((standing[temp.indexOf(ob[m][g]["away"])])["last"])[xx-1]] = zaa;
englishLeague.fixture = ob;

window.localStorage.setItem("englishLeague", JSON.stringify(englishLeague));
window.location.reload();
});
});
}, 1000);

});


function itemCounter(value, index){
return value.filter((x) => x == index).length;
};


function drawMatch(home,hs,date,as,away,x,y){
return '<div class="match" data-md="matchday' + x + '" data-game="game' + y + '"><div class="btn nm">' + home + '</div><div class="btn sc" contenteditable>' + hs + '</div><div class="btn dt">' + date + '</div><div class="btn sc" contenteditable>' + as + '</div><div class="btn nm">' + away + '</div><div class="btn gm">' + x + '</div><div class="btn gm">' + y + '</div><div class="btn sv">Save_'+x+'_'+y+'</div></div>';
}

});


$(document).ready(function(){
var byClub = new Object;
var obj = [];
var key = window.standing;
var interval;
var w = null;
var d = null;
var l = null;
var c = null;
var p = null;
var s = null;
var q = 1;
var xy = [];
var clk = 0;


if(window.standing){
drawMe(key);
}
else{
$.get("js/pl.json", function(ar){
drawMe(ar);
//$("html").html('<textarea id="txt" style="width:350px;height:400px">' + JSON.stringify(obj, null, 2) + '</textarea>');
});
}

function drawMe(ar){
var arr = ar.sort(firstBy(function (v1,v2){return v1.Pts-v2.Pts;},-1).thenBy(function (v1,v2){return v1.GD - v2.GD},-1).thenBy(function (v1,v2){return v1.GF-v2.GF},-1).thenBy(function (v1,v2){return v2.GA - v1.GA},-1).thenBy(function (v1,v2){return v1.W-v2.W},-1).thenBy(function (v1,v2){return v1.D-v2.D},-1).thenBy(function (v1,v2){return v2.L - v1.L},-1).thenBy(function (v1,v2){return v2.MP - v1.MP},-1).thenBy("name", "asc").thenBy("id"));

var ars = [];
var max = 0;
$.each(arr, function(x,y){
ars.push(parseInt(y["MP"]));
max = Math.max(...ars);
});

$.each(arr, function(x,y){
$("tbody").eq(0).append(drawName(y["id"], x+1, y["name"], y["MP"], y["W"], y["D"], y["L"], y["Pts"], y["GF"], y["GA"], y["GD"], drawLast(y["last"],max), liveEqual(0,0,true)));

document.getElementById(y['id']).addEventListener("click", function(){
var x = $('#'+y["id"]).index("tbody tr");
//$("tbody tr").removeClass("blink");
this.classList.add("blink");
this.classList.add("live");
if(q==1){
xy[0]=x;
$("#CID_238072081 span").html($.trim($('#'+y["id"]).find(".ellipsisize.hsKSJe").html()));
}
if(q==2){
xy[1]=x;
$("#CID_238072083 span").html($.trim($('#'+y["id"]).find(".ellipsisize.hsKSJe").html()));
}

if(q>2){
$("tbody tr").removeClass("blink");
$("tbody tr").removeClass("live");
this.classList.add("blink");
this.classList.add("live");
q=1;
}
q++;
//setLive(xy[0], xy[1]);

byClub["home"] = new String;
byClub["home"] = $.trim($('#'+y["id"]).find(".ellipsisize.hsKSJe").html());

$(".imso-shw .imso_btl__mh-logo").eq(0).attr("src", $("tbody tr").eq(xy[0]).find("img").attr("src"));
$(".imso-shw .imso_btl__mh-logo").eq(1).attr("src", $("tbody tr").eq(xy[1]).find("img").attr("src"));

$(".top .imso_mh__score").eq(0).html($("tbody tr").eq(xy[0]).find(".ellipsisize").text());
$(".top .imso_mh__score").eq(3).html($("tbody tr").eq(xy[1]).find(".ellipsisize").text());

//jafer
console.log(byClub);
});

document.getElementById(y['id']).addEventListener("dblclick", function(){
//document.querySelectorAll("tbody tr").classList.remove("blink");

var $gf = $('#'+y["id"]).find("td").eq(8);
var $ga = $('#'+y["id"]).find("td").eq(9);

$(".detail.b .a").html($.trim($('#'+y["id"]).find(".ellipsisize.hsKSJe").html()));

$(".detail.b .b input").eq(5).val($.trim($('#'+y["id"]).find("td").eq(8).html()));
$(".detail.b .b input").eq(6).val($.trim($('#'+y["id"]).find("td").eq(9).html()));
for(var j = 1; j < 4; j++){
$(".detail.b .b input").eq(j).val($.trim($('#'+y["id"]).find("td").eq(j+3).html()));
}

s = parseInt($.trim($('#'+y["id"]).find("td").eq(10).html()));
p = parseInt($.trim($('#'+y["id"]).find("td").eq(7).html()));
c = parseInt($.trim($('#'+y["id"]).find("td").eq(3).html()));
w = parseInt($.trim($('#'+y["id"]).find("td").eq(4).html()));
d = parseInt($.trim($('#'+y["id"]).find("td").eq(5).html()));
l = parseInt($.trim($('#'+y["id"]).find("td").eq(6).html()));

if(!(c == (w+d+l))){
$(".detail.b .b input").eq(0).css("color", "red");
}
if(!(p == ((w*3)+d))){
$(".detail.b .b input").eq(4).css("color", "red");
}
if(!(s == (parseInt($.trim($gf.html())) - parseInt($.trim($ga.html()))))){
$(".detail.b .b input").eq(7).css("color", "red");
}

for(var j = 0; j < 7; j++){
$('#'+y["id"]).find("td").eq(j+3).html("");
}

$(".rates #submit").attr("data-id", y["id"]);

$("body").addClass("preload");

interval = setInterval(function(){
$(".detail.b .b input").eq(7).val($(".detail.b .b input").eq(5).val() - $(".detail.b .b input").eq(6).val());
w = parseInt($(".detail.b .b input").eq(1).val());
d = parseInt($(".detail.b .b input").eq(2).val());
l = parseInt($(".detail.b .b input").eq(3).val());
$(".detail.b .b input").eq(0).val(w + d + l);
$(".detail.b .b input").eq(4).val((w*3)+d);
}, 100);

});

});

//setLive(2,6);

$("td.fbf28d.wxNiFd.B1pJhb.e9fBA.uOF0oe.AXYSPc.lWlL8e").eq(19).addClass("last");
$("td.tcwpB.fbf28d.B1pJhb.e9fBA.uOF0oe.fI7lFd.n1i1Xc.xL0E7c").eq(19).addClass("last");
$("tr.imso-loa.imso-hov").eq(19).find("td.xkW0Cc.snctkc").addClass("last");
}


//$(".TzHB6b.Ww4FFb.vt6azd.DlUvEb.UBoxCb").remove();
//remoAtt();
//chkImg();
//$("html").html('<textarea id="txt" style="width:350px;height:400px">' + $('.Jzru1c').html() + '</textarea>');


$("div.gDo0uc.tgaaSb div.iU5t0d").each(function(){
//var s = $.trim($(this).text());
//if(!($(this).find("img").length)){
//$(this).find("div").remove();
//$(this).text(s);
//}
});

//$("html").html('<textarea id="txt" style="width:350px;height:400px">' + $.trim($('tbody').html()) + '</textarea>');

$(".Rqwdve.RQCbNe.uOF0oe").eq(19).css("display", "flex!important");

//console.log($(".Rqwdve.RQCbNe.uOF0oe").eq(19).css("display"));

//console.log($(".Rqwdve.RQCbNe.uOF0oe").length);


function drawName(id, rank, name, MP, W, D, L, Pts, GF, GA, GD, last, live){
return '<tr id="' + id + '" class="imso-loa imso-hov"><td class="nwxKge snctkc e9fBA CuWfJb xL0E7c" aria-hidden="true"></td><td class="fbf28d wxNiFd B1pJhb e9fBA uOF0oe AXYSPc lWlL8e"><div class="gDo0uc tgaaSb G017Fd"><div class="iU5t0d">' + rank + '</div></div><div class="tgaaSb G017Fd" aria-hidden="true"><span class="iU5t0d b8Oacc fz3Rib"><img class="imso_btl__mh-logo" height="24px" src="imgs/' + id + '_48x48.png" width="24px"></span></div><div class="tgaaSb G017Fd" style="width:12px"></div></td><td class="tcwpB fbf28d B1pJhb e9fBA uOF0oe fI7lFd n1i1Xc xL0E7c"><div class="e6E1Yd bhlgmf snctkc"><div class="imso-hide-overflow C1gYkd"><span class="ellipsisize hsKSJe">' + name + '</span><br></div>' + live + '</div></td><td class="xkW0Cc snctkc e9fBA xL0E7c" contenteditable>' + MP + '</td><td class="xkW0Cc snctkc e9fBA xL0E7c">' + W + '</td><td class="xkW0Cc snctkc e9fBA xL0E7c">' + D + '</td><td class="xkW0Cc snctkc e9fBA xL0E7c">' + L + '</td><td class="xkW0Cc snctkc e9fBA K7J2Cb xL0E7c">' + Pts + '</td><td class="xkW0Cc snctkc e9fBA xL0E7c" contenteditable>' + GF + '</td><td class="xkW0Cc snctkc e9fBA xL0E7c">' + GA + '</td><td class="xkW0Cc snctkc e9fBA xL0E7c">' + GD + '</td><td class="gwqH4e xkW0Cc snctkc e9fBA xL0E7c lastf" role="cell"><div class="t0t45c II8W2d"><div class="mzZLbb" aria-hidden="true">' + last + '</div></div></td><td class="w2Mymf e9fBA" aria-hidden="true"></td></tr>';
}

function drawLast(ar,r){
var l = "";
l = l + '<div class="XqaACe BPu3kf"><img src="imgs/' + ar[r-5] + '.png" class="nB9CIe"></div>';
l = l + '<div class="XqaACe BPu3kf"><img src="imgs/' + ar[r-4] + '.png" class="nB9CIe"></div>';
l = l + '<div class="XqaACe BPu3kf"><img src="imgs/' + ar[r-3] + '.png" class="nB9CIe"></div>';
l = l + '<div class="XqaACe BPu3kf"><img src="imgs/' + ar[r-2] + '.png" class="nB9CIe"></div>';
l = l + '<div class="XqaACe BPu3kf"><img src="imgs/' + ar[r-1] + '.png" class="nB9CIe"></div>';
//for (var i = 0; i < 5; i++){
//l = l + '<div class="XqaACe BPu3kf"><img src="imgs/' + ar[r-1] + '.png" class="nB9CIe"></div>';
//}
return l;
}

function liveEqual(a, b, l){
if (l == true){
return '<div class="GXDoWd Ycf7w OGs04e de0OAd">' + a + '-' + b + '</div>';
}
else{
return "";
}
}

function liveG(a, b, l){
if (l == true){
return '<div class="GXDoWd Ycf7w OGs04e pDfgoe">' + a + '-' + b + '</div>';
}
else{
return "";
}
}

function liveR(a, b, l){
if (l == true){
return '<div class="GXDoWd Ycf7w OGs04e igiVPc">' + a + '-' + b + '</div>';
}
else{
return "";
}
}

function setLive(a, b){
setTimeout(function(){
//$("tbody tr").eq(a).addClass("blink");
//$("tbody tr").eq(b).addClass("blink");
//$("tbody tr").eq(a).addClass("live");
//$("tbody tr").eq(b).addClass("live");

//$("tbody tr").eq(b).addClass("green");

$(".imso-shw .imso_btl__mh-logo").eq(0).attr("src", $("tbody tr").eq(a).find("img").attr("src"));
$(".imso-shw .imso_btl__mh-logo").eq(1).attr("src", $("tbody tr").eq(b).find("img").attr("src"));
//$(".top .imso_mh__score").eq(0).html("Jafer");
//$(".top .imso_mh__score").eq(3).html("Fikadu");

//$(".scores .imso_btl__mh-logo").eq(0).attr("src", $("tbody tr").eq(a).find("img").attr("src"));
//$(".scores .imso_btl__mh-logo").eq(1).attr("src", $("tbody tr").eq(b).find("img").attr("src"));


$("tr.live .GXDoWd.Ycf7w.OGs04e").eq(0).html($(".imso_mh__score").eq(1).html() + '-' + $(".imso_mh__score").eq(2).html());
$("tr.live .GXDoWd.Ycf7w.OGs04e").eq(1).html($(".imso_mh__score").eq(2).html() + '-' + $(".imso_mh__score").eq(1).html());

if($.trim($(".imso_mh__score").eq(1).html()) > $.trim($(".imso_mh__score").eq(2).html())){
$("tbody tr").eq(a).addClass("green");
$("tbody tr").eq(b).addClass("red");
}
else if($.trim($(".imso_mh__score").eq(0).html()) < $.trim($(".imso_mh__score").eq(1).html())){
$("tbody tr").eq(a).addClass("red");
$("tbody tr").eq(b).addClass("green");
}

}, 300);
}


function getMaxOfArray(numArray){
return Math.max.apply(null, numArray);
}


$(".imso_mh__score").blur(function(){
if(!($.trim($(this).html()).replace("<br>", "") == "")){
$("tr.live .GXDoWd.Ycf7w.OGs04e").eq(0).html($(".imso_mh__score").eq(1).html() + '-' + $(".imso_mh__score").eq(2).html());
$("tr.live .GXDoWd.Ycf7w.OGs04e").eq(1).html($(".imso_mh__score").eq(2).html() + '-' + $(".imso_mh__score").eq(1).html());
}
});

$(".rates #submit").click(function(){
var id = $(this).attr("data-id");
for(var j = 0; j < 8; j++){
$('#'+id).find("td").eq(j+3).html($(".detail.b .b input").eq(j).val());
$(".detail.b .b input").eq(j).val("");
}
$(".detail.b .a").html("");
$(this).removeAttr("data-id");
clearInterval(interval);

$("#store").css("display", "inline-block");
$(this).css("display", "none");
$(".detail").css("display", "none");
//$("body").removeClass("preload");
w = null;
d = null;
l = null;
c = null;
p = null;
s = null;
$(".detail.b .b input").eq(0).css("color", "white");
$(".detail.b .b input").eq(4).css("color", "white");
$(".detail.b .b input").eq(7).css("color", "white");
});

$(".rates #store").click(function(){
$("body").removeClass("preload");
$("#submit").css("display", "inline-block");
$(this).css("display", "none");
$(".detail").css("display", "flex");

var s = 1;
$("tbody tr").each(function(){
var o = new Object;
o["id"] = new String;
o["rank"] = new Number;
o["name"] = new String;
o["MP"] = new Number;
o["W"] = new Number;
o["D"] = new Number;
o["L"] = new Number;
o["Pts"] = new Number;
o["GF"] = new Number;
o["GA"] = new Number;
o["GD"] = new Number;
o["last"] = new Array;
o["id"] = $(this).attr("id");
o["rank"] = s;
s++;
o["name"] = $.trim($(this).find(".ellipsisize.hsKSJe").html());
o["MP"] = $.trim($(this).find("td").eq(3).html());
o["W"] = $.trim($(this).find("td").eq(4).html());
o["D"] = $.trim($(this).find("td").eq(5).html());
o["L"] = $.trim($(this).find("td").eq(6).html());
o["Pts"] = $.trim($(this).find("td").eq(7).html());
o["GF"] = $.trim($(this).find("td").eq(8).html());
o["GA"] = $.trim($(this).find("td").eq(9).html());
o["GD"] = $.trim($(this).find("td").eq(10).html());

var $td = $(this).find("td.lastf").find("img");
$td.each(function(a,b){
var $im = $(b);
var s1 = $im.attr("src");
var s2 = s1.split("/");
var s3 = s2.pop();
var s4 = s3.replace(".png", "");
(o["last"]).push(s4);
//console.log(b);
});
obj.push(o);
});

englishLeague.standing = obj;
window.localStorage.setItem("englishLeague", JSON.stringify(englishLeague));
window.location.reload();
});


});


$(document).ready(function(){
//$("#CID_238072084").html(new Date());
var u = new Object;
var k = 0;
var fix = {};
var d = "matchday_" + $.trim($("#CID_238072082").html());
var hh = "";
var aa = "";
var hhs = "";
var aas = "";
var clsh = "a home";
var clsa = "a away";
var clsd = "a date";
var oh = [];
var oo = new Array(2);
oo[0] = new Array(38);
oo[1] = new Array(38);
var nv = 0;

var l = window.club;

var f = '<select><option value=""></option>';
$.each(l, function(d,e){
f = f + '<option value="' + e.name + '">' + e.name + '</option>';
});
f = f + '</select>';

function setMon(){
var mon = '<select><option value=""></option>';
for(var i = 1; i < 13; i++){
mon = mon + '<option value="' + i + '">' + i + '</option>';
}
mon = mon + '</select>';
return mon;
}
function setDy(){
var dy = '<select><option value=""></option>';
for(var i = 1; i < 32; i++){
dy = dy + '<option value="' + i + '">' + i + '</option>';
}
dy = dy + '</select>';
return dy;
}

if(window.fixture){
fix = window.fixture;
u = fix;
if(fix[d]){
k = (Object.keys(fix[d])).length + 1;
$("#CID_238072086").html(k);
}
}

var i = 0;
$.each(fix, function(m, n){
oo[0][i] = new Array(10);
oo[1][i] = new Array(10);

i = i + 1;
var j = 0;
var str = '<div id="matchday-' + i + '" class="matchday">';
//u["matchday" + i] = new Object;
str = str + '<div id="md-' + i + '" class="detail c" style="display:flex;margin-top:0px;border-top-width:0px"><div class="a" style="text-align:center;padding-left:30px;color:rgb(51,51,51);background-color:#9aa0a6;line-height:20px;font-weight:500;height:20px;width:100%">Matchday ' + i + '</div></div><div id="md_' + i + '" class="detail c" style="display:flex;margin-top:-21px;border-top-width:0px;justify-content:space-between;background-color:#9aa0a6"><div class="a" style="text-align:center;padding-left:0px;color:rgb(51,51,51);background-color:#9aa0a6;line-height:20px;font-weight:500;height:20px;display:block;width:124px">Home</div><div class="a" style="text-align:center;padding-left:0px;color:rgb(51,51,51);background-color:#9aa0a6;line-height:20px;font-weight:500;height:20px;display:block;width:62px">Date</div><div class="a" style="text-align:center;padding-left:0px;color:rgb(51,51,51);background-color:#9aa0a6;line-height:20px;font-weight:500;height:20px;display:block;width:124px">Away</div></div><div id="mdd_' + i + '" class="detail c" style="display:flex;margin-top:-21px;border-top-width:0px;flex-wrap:wrap;justify-content:space-between">';

//console.info(formatDate(new Date(fix["matchday6"]["game6"]["date"])));

$.each(fix[m], function(x,y){
var dd = new Date(y["date"]);
var ddd = '8/19/2023';

if(y["date"]){
//ddd = (dd.getMonth()+1) + '/' + dd.getDate() + '/' + dd.getFullYear();
ddd = formatDate(new Date(dd));
}
else{
var ddd = '5/19/2024';
ddd = formatDate(new Date(ddd));
}

var date2 = new Date();

var Difference_In_Time = date2.getTime() - dd.getTime();
var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
var dddd = Math.round(Difference_In_Days);

//var dddd = new Date() - dd;
//var ddddd = (dddd <= 0);

if(dddd > -3 && dddd < 3){
if(oh.length < 1){
//oh[0] = i;
oh.push(i-1);
}
}
j = j + 1;

//u["matchday" + i]["game" + j] = new Object;
//u["matchday" + i]["game" + j]["home"] = new String;
//u["matchday" + i]["game" + j]["away"] = new String;
//u["matchday" + i]["game" + j]["hs"] = new String;
//u["matchday" + i]["game" + j]["as"] = new String;
//u["matchday" + i]["game" + j]["date"] = new String;

if(fix["matchday" + i]["game" + j]["home"]){
if(!((oo[0][i-1]).includes(fix["matchday" + i]["game" + j]["home"]))){
if(!((oo[1][i-1]).includes(fix["matchday" + i]["game" + j]["home"]))){
hh = fix["matchday" + i]["game" + j]["home"] + f;
if(dddd == 1){
clsh = "a home dnone now";
}
else {
clsh = " a home dnone";
}
oo[0][i-1][j-1] = fix["matchday" + i]["game" + j]["home"];
}
}
else{
hh = f;
if(dddd == 1){
clsh = "a home now";
}
else {
clsh = " a home";
}
}
}
else{
hh = f;
if(dddd == 1){
clsh = "a home now";
}
else {
clsh = " a home";
}
}
if(fix["matchday" + i]["game" + j]["away"]){
if(!((oo[1][i-1]).includes(fix["matchday" + i]["game" + j]["away"]))){
if(!((oo[0][i-1]).includes(fix["matchday" + i]["game" + j]["away"]))){
aa = fix["matchday" + i]["game" + j]["away"] + f;
if(dddd == 1){
clsa = "a away dnone now";
}
else {
clsa = " a away dnone";
}
oo[1][i-1][j-1] = fix["matchday" + i]["game" + j]["away"];
}
}
else{
aa = f;
if(dddd == 1){
clsa = "a away now";
}
else {
clsa = " a away";
}
}
}
else{
aa = f;
if(dddd == 1){
clsa = "a away now";
}
else {
clsa = " a away";
}
}

if(fix["matchday" + i]["game" + j]["hs"]){
hhs = fix["matchday" + i]["game" + j]["hs"];
}
else{
hhs = "";
}
if(fix["matchday" + i]["game" + j]["as"]){
aas = fix["matchday" + i]["game" + j]["as"];
}
else{
aas = "";
}


if(dddd == 1){
clsd = "a date now";
}
else{
clsd = "a date";
}

if(dddd == 1){
if((fix["matchday" + i]["game" + j]["home"]) && (fix["matchday" + i]["game" + j]["away"])){

var blink = searchClub(club, oo[0][i-1][j-1], oo[1][i-1][j-1]);
//$("#" + blink[0]).addClass("blink");
$("#" + blink[0]).addClass("live");
//$("#" + blink[1]).addClass("blink");
$("#" + blink[1]).addClass("live");

if((fix["matchday" + i]["game" + j]["hs"]) && (fix["matchday" + i]["game" + j]["as"])){
$("#" + blink[0]).find(".GXDoWd.Ycf7w.OGs04e.de0OAd").html(hhs + "-" + aas);
$("#" + blink[1]).find(".GXDoWd.Ycf7w.OGs04e.de0OAd").html(aas + "-" + hhs);
if(Number(hhs) > Number(aas)){
$("#" + blink[0]).addClass("green");
$("#" + blink[1]).addClass("red");
}
else if(Number(hhs) < Number(aas)){
$("#" + blink[0]).addClass("red");
$("#" + blink[1]).addClass("green");
}
}
else{
$("#" + blink[0]).find(".GXDoWd.Ycf7w.OGs04e.de0OAd").html("_-_");
$("#" + blink[1]).find(".GXDoWd.Ycf7w.OGs04e.de0OAd").html("_-_");
}
}
}

str = str + '<div id="game-' + i + '-' + j + '-h" class="' + clsh + '" style="text-align:right;display:block;padding-left:0px;padding-right:10px" data-md="'+i+'" data-game="'+j+'">' + hh + '</div><div id="game-' + i + '-' + j + '-hs" class="a" style="width:30px;padding:0px;text-align:center;display:block" contenteditable>'+hhs+'</div><div id="game-' + i + '-' + j + '-d" class="' + clsd + '" style="width:62px;padding:0px;text-align:center;display:block">' + ddd + '</div><div id="game-' + i + '-' + j + '-as" class="a" style="width:30px;padding:0px;text-align:center;display:block" contenteditable>'+aas+'</div><div id="game-' + i + '-' + j + '-a" class="' + clsa + '" style="text-align:left;display:block" data-md="'+i+'" data-game="'+j+'">' + aa + '</div>';
//j++;
});
str = str + '<div class="detail c" style="display:block;margin-top:0px;border-top-width:0px;margin-bottom:0px"><div data-id="' + i + '" class="a red btn-save" style="text-align:center;padding-left:0px;color:rgb(51,51,51);background-color:#9aa0a6;line-height:20px;font-weight:500;height:20px;width:100%;display:block">Save</div></div>'
str = str + '</div>';
str = str + '</div>';
$("#preloades").append(str);
//i++;
});

//document.getElementById("md-" + oh[0]).style.display = "flex";
//document.getElementById("md_" + oh[0]).style.display = "flex";
//document.getElementById("mdd_" + oh[0]).style.display = "flex";

nv = oh[0];
transMatch(nv);


$(".preloades button").eq(0).click(function(){
if(nv > 0){
nv = nv - 1;
}
transMatch(nv);
});

$(".preloades button").eq(2).click(function(){
if(nv < 37){
nv = nv + 1;
}
transMatch(nv);
});

setTimeout(function(){
$(".a.home").each(function(){
var k = '#' + $(this).attr("id");
var i = $(this).data("md") - 1;
var j = $(this).data("game") - 1;
document.querySelector(k+' select').addEventListener("change", function(){
var x = this.value;
if(!(oo[0][i].includes(x))){
if(!(oo[1][i].includes(x))){
oo[0][i][j] = x;
this.style.display = "none";
document.querySelector(k).innerHTML = x;
$(k + ' select').remove();
}
}
});
});
$(".a.away").each(function(){
var z = '#' + $(this).attr("id");
var i = $(this).data("md") - 1;
var j = $(this).data("game") - 1;
document.querySelector(z+' select').addEventListener("change", function(){
var y = this.value;
if(!(oo[1][i].includes(y))){
if(!(oo[0][i].includes(y))){
oo[1][i][j] = y;
this.style.display = "none";
document.querySelector(z).innerHTML = y;
$(z + ' select').remove();
}
}
});
});
$(".a.red").each(function(){
var z = '#game-' + $(this).attr("data-id") + "-";
//var u = new Object;
//u["matchday" + $(this).attr("data-id")] = new Object;
var el = $(this).get(0);
el.addEventListener("click", function(){
for(var t = 1; t < 11; t++){
z = '#game-' + $(this).attr("data-id") + "-" + t + "-";

$(z + "h select").remove();
$(z + "a select").remove();

u["matchday" + $(this).attr("data-id")]["game" + t]["home"] = $.trim($(z + "h").html());
u["matchday" + $(this).attr("data-id")]["game" + t]["away"] = $.trim($(z + "a").html());

u["matchday" + $(this).attr("data-id")]["game" + t]["hs"] = $.trim($(z + "hs").html());
u["matchday" + $(this).attr("data-id")]["game" + t]["as"] = $.trim($(z + "as").html());
u["matchday" + $(this).attr("data-id")]["game" + t]["date"] = new Date($.trim($(z + "d").html()));
}
//u["matchday12"]["game10"]["away"] = "Newcastle";
//console.info(JSON.stringify(u, null, 2));


englishLeague.fixture = u;
window.localStorage.setItem("englishLeague", JSON.stringify(englishLeague));
window.englishLeague = JSON.parse(window.localStorage.getItem("englishLeague"));
window.standing = englishLeague["standing"];
window.club = englishLeague["club"];
window.fixture = englishLeague["fixture"];

this.classList.remove("red");
}, false);
});

}, 1000);

function transMatch(s){
$("#week1").html("MW " + (s+1));
var fd = new Date(fixture["matchday" + (s+1)]["game1"]["date"]);
var ld = new Date(fixture["matchday" + (s+1)]["game10"]["date"]);
var mm = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
$("#week2").html(fd.getDate() + " " + mm[fd.getMonth()] + " - " + ld.getDate() + " " + mm[ld.getMonth()]);

$(".matchday").css("transform", "translateY(-" + (s*400) + "px)");
$(".preloades button").eq(1).html(s+1);
if(s == 0){
$(".preloades button").eq(0).attr("disabled", "");
}
if(s > 0){
$(".preloades button").eq(0).removeAttr("disabled");
}
if(s == 37){
$(".preloades button").eq(2).attr("disabled", "");
}
if(s < 37){
$(".preloades button").eq(2).removeAttr("disabled");
}

}

$(".preloader").click(function(){
$("body").removeClass("preload");
});

$("#CID_238072085").click(function(){
var o = new Object;
var z = "game" + $.trim($("#CID_238072086").html());
o[d] = new Object;
o[d][z] = new Object;

if(window.fixture){
if(fix[d]){
o[d] = fix[d];
}
else{
fix[d] = new Object;
}
if(fix[d]){
if(fix[d][z]){
o[d][z] = fix[d][z];
}
else{
fix[d][z] = new Object;
}
}
}
//else {
//fix[d] = new Object;
//fix[d][z] = new Object;
//}


var s = new Object;
s["home"] = new String;
s["away"] = new String;
s["date"] = new String;

//s["date"] = $.trim($("#CID_238072084").html());
s["date"] = new Date($.trim($("#CID_238072084").html()));
s["home"] = $.trim($("#CID_238072081 span").html());
s["away"] = $.trim($("#CID_238072083 span").html());


o[d][z] = s;
fix[d][z] = o[d][z];

//window.localStorage.setItem("fix", JSON.stringify(fix, null, 2));

$("body").removeClass("preload");
setTimeout(function(){
window.location.reload();
}, 500);
});

//$("#CID_238072083 span").html($.trim($('#'+y["id"]).find(".ellipsisize.hsKSJe").html()));
function searchClub(arr, clbh, clba){
var id = new Array(2);
$.each(arr, function(x,y){
if(y["name"] == clbh){
id[0] = y["id"];
}
if(y["name"] == clba){
id[1] = y["id"];
}
});
return id;
}

});


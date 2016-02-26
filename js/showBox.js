var Showbox={};  
//是否为ie浏览器  
Showbox.IsIE=!!document.all;  
//ie浏览器版本  
Showbox.IEVersion=(function(){if(!Showbox.IsIE)return -1;try{return parseFloat(/msie ([\d\.]+)/i.exec(navigator.userAgent)[1]);}catch(e){return -1;}})();  
//按id获取对象  
Showbox.$=function(Id,isFrame){var o;if("string"==typeof(Id))o= document.getElementById(Id);else if("object"==typeof(Id))o= Id;else return null;return isFrame?(Showbox.IsIE?frames[Id]:o.contentWindow):o;}  
//按标签名称获取对象  
//页面的高和宽******************************  
Showbox.isStrict=document.compatMode == "CSS1Compat";  
Showbox.BodyScale={x:0,y:0,tx:0,ty:0};//（x，y）：当前的浏览器容器大小  （tx，ty）：总的页面滚动宽度和高度 
Showbox.getClientHeight=function(){/*if(Showbox.IsIE)*/return Showbox.isStrict ? document.documentElement.clientHeight :document.body.clientHeight;/*else return self.innerHeight;*/}  
Showbox.getScrollHeight=function(){var h=!Showbox.isStrict?document.body.scrollHeight:document.documentElement.scrollHeight;return Math.max(h,this.getClientHeight());}  
Showbox.getHeight=function(full){return full?this.getScrollHeight():this.getClientHeight();}  
Showbox.getClientWidth=function(){/*if(Showbox.IsIE)*/return Showbox.isStrict?document.documentElement.clientWidth:document.body.clientWidth;/*else return self.innerWidth;*/}  
Showbox.getScrollWidth=function(){var w=!Showbox.isStrict?document.body.scrollWidth:document.documentElement.scrollWidth;return Math.max(w,this.getClientWidth());}  
Showbox.getWidth=function(full){return full?this.getScrollWidth():this.getClientWidth();}  
Showbox.initBodyScale=function(){Showbox.BodyScale.x=Showbox.getWidth(false);Showbox.BodyScale.y=Showbox.getHeight(false);Showbox.BodyScale.tx=Showbox.getWidth(true);Showbox.BodyScale.ty=Showbox.getHeight(true);} 
//页面的高和宽******************************  
Showbox.Msg={  
    INFO:'info',  
    ERROR:'error',  
    WARNING:'warning',  
    IsInit:false,  
    timer:null,  
    dvTitle:null,  
    dvCT:null,  
    dvBottom:null,  
    dvBtns:null,  
    lightBox:null,  
    dvMsgBox:null,  
    defaultWidth:'300',  
    moveProcessbar:function(){  
      var o=Showbox.$('dvProcessbar'),w=o.style.width;  
      if(w=='')w=20;  
      else{  
        w=parseInt(w)+20;  
        if(w>100)w=0;  
      }  
      o.style.width=w+'%';  
    },  
    InitMsg:function(cfg){  
      //ie下不按照添加事件的循序来执行，所以要注意在调用alert等方法时要检测是否已经初始化IsInit=true       
      var ifStr='<iframe src="javascript:false" mce_src="javascript:false" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:100%; z-index:-1;'  
          +'filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>',  
      html='<div class="top" id="dvMsgTop"><div class="contain"><h2 class="title" id="dvMsgTitle"></h2></div></div>'+  
        '<div class="body"><div class="contain"><div class="ct" id="dvMsgCT"></div></div></div>'+  
        '<div class="bottom" id="dvMsgBottom"><div class="contain"><div class="callbtn" id="dvMsgBtns"></div></div></div>';  
      this.dvMsgBox=document.createElement("div");  
      this.dvMsgBox.id="dvMsgBox";  
      this.dvMsgBox.innerHTML+=html;        
      document.body.appendChild(this.dvMsgBox);  
      this.lightBox=document.createElement("div");  
      this.lightBox.id="ShowBoxlightBox";  
      document.body.appendChild(this.lightBox);  
      if(Showbox.IsIE&&Showbox.IEVersion<7){//加iframe层修正ie6下无法遮盖住select的问题  
        this.lightBox.innerHTML+=ifStr;  
        this.dvMsgBox.innerHTML+=ifStr;  
      }  
      this.dvBottom=Showbox.$('dvMsgBottom');  
      this.dvBtns=Showbox.$('dvMsgBtns');  
      this.dvCT=Showbox.$('dvMsgCT');  
      this.dvTitle=Showbox.$('dvMsgTitle');  
      if(cfg.title){
        var closebtn = document.createElement("img");
        closebtn.src = "image/cancel-icon.png";
        closebtn.alt = "X";
        closebtn.className = 'close';
        closebtn.onclick=function(){  
            Showbox.Msg.hide();   
          }  
        Showbox.$('dvMsgTop').appendChild(closebtn);
      }else{
        Showbox.$("dvMsgTop").style.display = "none";
      }
      this.IsInit=true;  
    },  
    checkDOMLast:function(){//此方法非常关键，要不无法显示弹出窗口。两个对象dvMsgBox和lightBox必须处在body的最后两个节点内  
      if(document.body.lastChild!=this.lightBox){  
        document.body.appendChild(this.dvMsgBox);  
        document.body.appendChild(this.lightBox);  
      }  
    }, 
    createDiv:function(w){  
        var div=document.createElement("div");    
        div.style.width = w + "%";  
        div.style.display = "inline-block";
        return div;  
    },
    createBtn:function(cfg,p,v,cname,fn){  
        if (Object.prototype.toString.call(p)!=='[object Array]') {
            var temparray = new Array(p);
            p = temparray;
        }
   
        var btn=document.createElement("input");  
        btn.type="button";  
        btn.className=cname;  
        btn.value=v;  
        if(cfg.alert){
            btn.style.width='100%';
        }
        btn.onclick=function(){  
          Showbox.Msg.hide();  
          if(fn)fn.apply(this,p);  
        }  
        return btn;  
    },  
    alert:function(param){  
      this.show({buttons:{yes:param.text},msg:param.content,title:param.title,alert:true,width:param.width});  
    },  
    confirm:function(param){  
      //fn为回调函数，参数和show方法的一致  
      this.show({buttons:{yes:param.msg_yes,no:param.msg_no},msg:param.msg,title:param.title,fn:param.fn,width:param.width});  
    },  
    prompt:function(labelWord,defaultValue,txtId,fn){  
      if(!labelWord)labelWord='请输入：';  
      if(!defaultValue)defaultValue="";  
      if(!txtId)txtId="msg_txtInput";  
      this.show({title:'输入提示',msg:labelWord+'<input class="msg_txtInput" type="text" id="'+txtId+'" value="'+defaultValue+'"/>',buttons:{yes:'确认',no:'取消'},fn:fn});  
    },  
    wait:function(msg,title){  
      if(!msg)msg='正在处理..';  
      this.show({title:title,msg:msg,wait:true});  
    },
    operate:function(msg,title,buttons,width){
        this.show({buttons:buttons,msg:msg,title:title,width:width,operate:true});
    }, 
    show:function(cfg){  
      //cfg:{title:'',msg:'',wait:true,icon:'默认为信息',buttons:{yes:'',no:''},fn:function(btn){回调函数,btn为点击的按钮，可以为yes，no},width:显示层的宽}  
      //如果是等待则wait后面的配置不需要了。。   
      if(!cfg)throw("没有指定配置文件！");  
      //添加窗体大小改变监听  
      if(Showbox.IsIE)window.attachEvent("onresize",this.onResize);  
      else  window.addEventListener("resize",this.onResize,false);  
        
      if(!this.IsInit)this.InitMsg(cfg);//初始化dom对象  
      else this.checkDOMLast();//检查是否在最后  
        
      //检查是否要指定宽，默认为300  
      if(cfg.width)this.defaultWidth=cfg.width;
      if(this.defaultWidth.substr(-1) == '%'){
        this.dvMsgBox.style.width=this.defaultWidth;  
      }else{
        this.dvMsgBox.style.width=this.defaultWidth+'px';  
      }
      //可以直接使用show方法停止为进度条的窗口  
      if(this.timer){clearInterval(this.timer);this.timer=null;}        
      this.dvTitle.innerHTML='';  
      if(cfg.title)this.dvTitle.innerHTML=cfg.title;  
      this.dvCT.innerHTML='';  
      this.dvBtns.innerHTML='';
      if(cfg.wait){  
        if(cfg.msg)this.dvCT.innerHTML=cfg.msg;  
        this.dvCT.innerHTML+='<div class="pro"><div class="bg" id="dvProcessbar"></div></div>';  
        this.dvBtns.innerHTML='';  
        this.dvBottom.style.height='10px';  
        this.timer=setInterval(function(){Showbox.Msg.moveProcessbar();},1000);  
      }
      else if (cfg.operate) {
        if(!cfg.buttons||cfg.buttons.length<1){  
          cfg.buttons=[{val:'确定'}];  
        }
        if (typeof cfg.buttons == "number"||typeof cfg.buttons == "string") {
            cfg.buttons=[{val:cfg.buttons}]; 
        };
        if(cfg.icon)this.dvCT.innerHTML='<div class="icon '+cfg.icon+'"></div>';  
        if(cfg.msg)this.dvCT.innerHTML+=cfg.msg+'<div class="clear"></div>';  
        this.dvBottom.style.height='55px'; 

        var btndivwidth = (100/cfg.buttons.length).toFixed(3).substring(0,5);

        for(var i=0;i<cfg.buttons.length;i++){
            if (cfg.buttons[i].type == false) {
                cfg.buttons[i].class = 'showboxbtnNo';
            }else{
                cfg.buttons[i].class = 'showboxbtnYes';
            }
            var div=this.createDiv(btndivwidth);
            div.appendChild(this.createBtn(cfg,cfg.buttons[i].args,cfg.buttons[i].val,cfg.buttons[i].class,cfg.buttons[i].fn));
            this.dvBtns.appendChild(div); 
        }
      }
      else if (cfg.alert) {
        if (!cfg.buttons||!cfg.buttons.yes) {
            cfg.buttons={yes:'确定'};
        }
        if(cfg.msg)this.dvCT.innerHTML+=cfg.msg+'<div class="clear"></div>';  
        this.dvBottom.style.height='55px';
        var div=this.createDiv(100);
        div.appendChild(this.createBtn(cfg,'yes',cfg.buttons.yes,'showboxbtnYes',cfg.fn));  
        this.dvBtns.appendChild(div);    
      }
      else{  
        if(!cfg.buttons||(!cfg.buttons.yes&&!cfg.buttons.no)){  
          cfg.buttons={yes:'确定',no:'取消'};  
        }  
        if (!cfg.buttons.yes) {
            cfg.buttons.yes = '确定';
        }
        if (!cfg.buttons.no) {
            cfg.buttons.no = '取消';
        }
        if(cfg.icon)this.dvCT.innerHTML='<div class="icon '+cfg.icon+'"></div>';  
        if(cfg.msg)this.dvCT.innerHTML+=cfg.msg+'<div class="clear"></div>';  
        this.dvBottom.style.height='55px';  
        //this.dvBottom.style.m='45px'
        //this.dvBtns.innerHTML='<div class="height"></div>';  
        var div=this.createDiv(50);
        div.appendChild(this.createBtn(cfg,'no',cfg.buttons.no,'showboxbtnNo'));
        this.dvBtns.appendChild(div);   
        var div=this.createDiv(50);
        div.appendChild(this.createBtn(cfg,'yes',cfg.buttons.yes,'showboxbtnYes',cfg.fn));  
        this.dvBtns.appendChild(div);
      }  
      Showbox.initBodyScale();  
      this.dvMsgBox.style.display='block';  
      this.lightBox.style.display='block';  
      this.onResize(false);  
    },  
    hide:function(){  
      this.dvMsgBox.style.display='none';  
      this.lightBox.style.display='none';  
      this.dvBtns.innerHTML = '';
      if(this.timer){clearInterval(this.timer);this.timer=null;}  
      if(Showbox.IsIE)window.detachEvent('onresize',this.onResize);  
      else window.removeEventListener('resize',this.onResize,false);  
    },  
    onResize:function(isResize){  
       if(isResize)Showbox.initBodyScale();  
       Showbox.Msg.lightBox.style.width=Showbox.BodyScale.tx+'px';  
       Showbox.Msg.lightBox.style.height=Showbox.BodyScale.ty+'px';  
       Showbox.Msg.dvMsgBox.style.top=32+'%';  
       Showbox.Msg.dvMsgBox.style.left=Math.floor((Showbox.BodyScale.x-Showbox.Msg.dvMsgBox.offsetWidth)/2)+'px';  
       Showbox.Msg.dvMsgBox.style.position='fixed';  
    }  
}
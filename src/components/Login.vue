<template>
  <div id="a" v-bind:style="{height:heig+'px',width:wid+'%'}" >
  <div id="d" style="touch-action: none;"  >
    <div id="head" v-bind:style="{height:headheight+'px',width:wid+'%'}">
      <div >
        <h1  style="line-height:headheight+'px;'">石油医院双转系统</h1>
      </div>
    </div>
    <div id="body" v-bind:style="{height:bodyheight+'px',width:80+'%'}">
    <flexbox orient="vertical" >
      <flexbox-item>
        <group class="grou">
          <x-input
            title="用户名："
            placeholder="请输入姓名"
            v-model.trim="userName"
             :show-clear="false"
             @on-click-clear-icon="qingchu"
             placeholder-align="left"
             class="inputs">
          </x-input>
        </group>
      </flexbox-item>
      <flexbox-item>
        <group>
          <x-input
            title="密 码："
            placeholder="请输入密码"
            v-model.trim="password"
            :show-clear="false"
            placeholder-align="left">
          </x-input>
        </group>
      </flexbox-item>
      <flexbox-item>
        <group >
          <x-input
            title="验证码："
            placeholder="请输入验证码"
            :show-clear="false"
            v-model="picLyanzhengma" >
              <x-button
                slot="right"
                type="primary"
                @click.native="createCode()"
                name="checkCode" >
                {{checkCode}}
              </x-button>
          </x-input>
        </group>
      </flexbox-item>
      <flexbox-item>
        <div style="padding:5px;text-align: right;">
          <span style="color:red;">{{tishi}}</span>
          <check-icon
            v-model="checked"
            @click.native="checkeds()"
            >
            记住密码
          </check-icon>
        </div>
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click.native="submint()">登录</x-button>
      </flexbox-item>
    </flexbox>
    </div>
    <div id="end">
    <flexbox orient="vertical" >
      <h5 >成都健之乡科技有限公司 <br>联系电话：028-86139738</h5>
    </flexbox>
    </div>
  </div>
</div>
</template>

<script>
import { Flexbox, FlexboxItem, XInput, Group, CheckIcon, XButton } from 'vux';
import * as api from '../api/api';
import qs from 'qs';

export default {
  data () {
    return {
      userName: '',
      password: '',
      checked: true,//记住密码
      picLyanzhengma:"",//用户输入的验证码
      checkCode:"",//生成的验证码
      code:"",
      tishi:"",
      guoqi:"",//Cookie过期
      wid:100,//屏幕宽度

      heig:'',//屏幕高度
      headheight:'',//头部高度
      bodyheight:''//主体高度

　　　　
    }
  },
  components: {
    Flexbox,
    FlexboxItem,
    XInput,
    Group,
    CheckIcon,
    XButton
  },
  created () {
    this.createCode();//验证码

    var  h = document.documentElement.clientHeight || document.body.clientHeight;
    this.heig = h;
    this.headheight = h*0.3;
    this.bodyheight = h*0.6;
    if(typeof(Storage)!=="undefined"){
      this.getstorage();
    } else {
    // 不支持 web 存储。
        this.getCookie();
      }
    },
  methods: {
    checkeds(){//记住密码
    this.checked = !this.checked;
    console.log("记住密码："+this.checked);
    },
    qingchu(){
    },
    // 图片验证码
    createCode(){
      //先清空验证码的输入
      this.code = "";
      this.checkCode = "";
      this.picLyanzhengma = "";
      //验证码的长度
      var codeLength = 3;
      //随机数
      // var random = new Array(0,1,2,3,4,5,6,7,8,9);
      for(var i = 0; i < codeLength; i++) {
          //取得随机数的索引（0~35）
          var index = Math.floor(Math.random()*10);
          //根据索引取得随机数加到code上
          this.code += index;
            }
            //把code值赋给验证码
            this.checkCode = this.code;
          },
    getCookie () {//获取Cookie
      let cookie = document.cookie.split(';');
      let user = null;
      let pwd = null;
      let tim = null;
      for (var i = 0; i < cookie.length; i++) {
        var arr = cookie[i].split('=');
        for (var j = 0; j < arr.length; j++) {
          if (arr[j]=="userName") {
            user = arr[j+1];
            break;
          }
          if (arr[j].indexOf("passWord") > -1) {
            pwd = arr[j + 1];
            break;
          }
          if (arr[j].indexOf("expdate") > -1) {
            tim = arr[j + 1];
            break;
          }
        }
      }
      var age = new Date().getTime(); // 初始化时间
      var a = tim;
      this.guoqi = a;
      //已经保存过Cookie并且没有超过30天则自动登录
      if (user !== null && pwd !== null && a>age) {
        this.userName = user;
        this.password = pwd;
        this.checked = true;//记住密码
        this.picLyanzhengma = this.checkCode;//修改验证码
        this.submint();//执行登录
      }
    },
    setCookies(){
      var expdate = new Date(); // 初始化时间
      expdate.setTime(expdate.getTime()+30 * 24 * 60 * 60 * 1000); // 时间单位毫秒
      document.cookie = 'userName=' + this.userName + ';path=/';
      document.cookie = 'passWord=' + this.password + ';path=/';
      if(this.guoqi>expdate.getTime()){//存在过期时间
        document.cookie = 'expdate=' + this.guoqi + ';path=/';
      } else {
        document.cookie = 'expdate=' + expdate.getTime() + ';path=/';
      }
    },
    setstorage(){//本地储存
      var expdate = new Date(); // 初始化时间
      expdate.setTime(expdate.getTime()+30 * 24 * 60 * 60 * 1000); // 时间单位毫秒
      localStorage.user=this.userName;
      localStorage.password=this.password;
      if(this.guoqi>expdate.getTime()){
        localStorage.age=this.guoqi;
      }else {
        localStorage.age=expdate.getTime();
      }
    },
    getstorage(){
      var tim = new Date().getTime();//当前时间
      var user = localStorage.getItem("user");
      var pass = localStorage.getItem("password");
      var ti = localStorage.getItem("age");//过期时间
      if(user!=null && pass!=null && ti>tim){
        this.userName = user;
        this.password = pass;
        this.guoqi = ti;
        this.checked = true;//记住密码
        this.picLyanzhengma = this.checkCode;//修改验证码
        this.submint();//执行登录
      }
    },
    submint () {//执行登录
      if (this.picLyanzhengma==this.checkCode) {//效验输入验证码是否正确
        if (this.checked) {
          if(typeof(Storage)!=="undefined"){
            this.setstorage();
            console.log("保存storage");
          }else{
              this.setCookies();
              console.log("保存cookie");
          }
        }
        let params = {
          username: this.userName,
          userpassword: this.password,
          isRemember: false
        };
        api.login(params).then(res => {

          if (res === 200) {
            localStorage.setItem('sfzh', JSON.stringify(params));
            this.$router.push('/Listbox')
          } else {
            this.tishi = "请检查用户名或密码是否正确！"
            alert("登录失败！");
          }
        });
      } else {
        this.tishi="验证码输入错误！"
      }
    }
  }
}

</script>

<style scoped>
#a{
   background-color:#ACCDD6;

}
#head{
  font-family: '宋体';
  align:center;
  margin: auto;
  text-align:center;
  margin-left:auto;
  margin-right:auto;
  justify-content: center; /*子元素水平居中*/
  align-items: center; /*子元素垂直居中*/
  display: -webkit-flex;
}

#body{
  margin: auto;
}

.weui-input{
  font-size: 20px;
}
[class^="weui-icon-"]:before, [class*=" weui-icon-"]:before {
    display: inline-block;
    margin-left: .2em;
    margin-right: .2em;
    color: green;
}
</style>

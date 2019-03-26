
import { XInput } from 'vux'

export default {
  components: {
    XInput
  }
}

<template>
   <div id="longin">
    <div id="head">
      <h1>{{title}}</h1>
    </div>
    <div id="body">
        <p>
          <input ref="username" type="text" placeholder="请输入用户名" class="input" v-model="username"></input>
        </p>
        <p>
          <input ref="userpassword" type="password" placeholder="请输入密码" class="input" v-model="userpassword"></input>
        </p>
        <p class = 'captcha'>
          <input type="text" placeholder="请输入验证码" class="input" v-model="picLyanzhengma" size="10">
          <input type="button"  @click="createCode"  class="verification" v-model="checkCode"/>
        </p>
        <p>
          <input type="checkbox" v-model="isRemember" @click="ShowCheckbox"/>记住密码
          <span>{{tishi}}</span>
        </p>
        <p><button class="denglu" @click="denglu">登录</button></p>
    </div>
    <div id="end">
      成都健之乡科技有限公司 <br>联系电话：028-86139738
    </div>
  </div>
</template>
<script>
import {Group,Cell}from 'vux'
import * as api from '../api/api.js'
// import qs from 'qs'
export default{
  components:{
    Group,
    Cell
  },
  data(){
    return{
      title: '石油医院双转系统',
      picLyanzhengma:"",//用户输入的验证码
      checkCode:"",//生成的验证码
      code:"",
      username:"",//用户名
      userpassword:"",//密码
      isRemember:false,
      tishi:""//错误信息提示
    }
  },

  methods:{

    // 图片验证码
        createCode(){
                     //先清空验证码的输入
                     this.code = "";
                     this.checkCode = "";
                     this.picLyanzhengma = "";
                     //验证码的长度
                        var codeLength = 4;
                        //随机数
              var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
              for(var i = 0; i < codeLength; i++) {
                            //取得随机数的索引（0~35）
                                var index = Math.floor(Math.random()*36);
                                //根据索引取得随机数加到code上
                  this.code += random[index];
                        }
                        //把code值赋给验证码
              this.checkCode = this.code;
          },
          ShowCheckbox(){
            this.isRemember=!this.isRemember;
          console.log(this.isRemember);
        },
        denglu(){
          let params = {
            username: this.username,
            userpassword: this.userpassword,
            isRemember: false
          };
          api.login(params).then(result =>{
            console.log(result);
          })
         },
         created(){
           //触发点击事件则再次生成验证码
           this.createCode();
         }
  }
}

</script>
<style>
#longin {
  width: 375px;
  height: 667px;
  text-align: center;
  background-color: #82B4A9;
}
#head{
  /* padding-top: 100px;
  padding-bottom: 50px; */
  margin: 0 auto;
  color: white;
  font-family: '宋体';
  height: 200px;
  weight:100%
}
#head h1{
  line-height: 200px;
}
#body{
  height: 400px;
  weight:100%;
}
#end{
  height: 20px;
  weight:100%;
  color: white;
  font-size: 12px;
}
#canvas{
        cursor:pointer;
    }
.denglu{
  width: 300px;
  font-family: 'Exo 2', sans-serif;/*字体*/
  border: 1px solid #fff;/*边框*/
  color: #fff;/*颜色*/
  outline: none;/*轮廓*/
  border-radius: 12px;/*圆角*/
  letter-spacing: 1px;/*间距*/
  font-size: 17px;/*字体大小*/
  font-weight: normal;/*字体殂谢*/
  background-color:#5EB95E;/*背景颜色*/
  padding: 5px 0 5px 10px;/*内边距*/
  margin-left: 0px;/*左外边距*/
  height: 40px;
  margin-top: 20px;
  border: 1px solid #e6e6e6;/*边框*/
}
.input{
    font-family: 'Exo 2', sans-serif;
    border: 1px solid #fff;
    color: #fff;
    outline: none;
    border-radius: 12px;
    letter-spacing: 1px;
    font-size: 17px;
    font-weight: normal;
    background-color: rgba(82, 56, 76, 0.15);
    padding: 5px 0 5px 10px;
    /* margin-left: 20px; */
    height: 20px;
    margin-top: 20px;
    border: 1px solid #e6e6e6;
}
.verification{
    border-radius: 12px;
    width:76px;
    letter-spacing:5px;
    margin-left: 10px;
    height: 40px;
    /* transform: translate(-15px,0); */
}
/* .captcha{
    height: 50px;
    text-align: justify;
} */

</style>

<template>
  <div id="beijin" v-bind:style="{height:heig+'%',width:wid+'px'}">
    <divider><h3>{{yljgmc}}</h3></divider>
    <div id="body">
      <button-tab>
        <button-tab-item @on-item-click="listbox()" >患者列表</button-tab-item><!--跳转到信息列表页面-->
        <button-tab-item style="background-color: rgb(4, 190, 2); color: #FFF;">+上转患者</button-tab-item><!--跳转到上转患者页面-->
      </button-tab>
    <div id="bords">
      <group gutter="0px">
        <div style="border:1px solid #d9d9d9">
          <flexbox  >
              <flexbox-item :span="2"><div ><span style="color:red">*</span>姓名:</div></flexbox-item>
              <flexbox-item><div ><x-input v-model="xm" placeholder="请输入姓名" is-type="china-name" :show-clear="false" text-align="right"></x-input></div></flexbox-item>
          </flexbox>
      </div>

      <div style="border:1px solid #d9d9d9">
        <flexbox >
            <flexbox-item :span="3.5"><div ><span style="color:red">*</span>身份证号:</div></flexbox-item>
            <flexbox-item><div ><x-input :show-clear="false" text-align="right" placeholder="如末尾是X,请输入大写X" v-model.trim="sfzh" :is-type="checkIdcard"></x-input></div></flexbox-item>
        </flexbox>
      </div>

      <div style="border:1px solid #d9d9d9">
        <flexbox>
            <flexbox-item :span="2"><div ><span style="color:red">*</span>性别:</div></flexbox-item>
            <flexbox-item><div ><checker text-align="right" v-model="xb" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected">
            <checker-item value="1">男</checker-item>
            <checker-item value="2">女</checker-item>
            <checker-item value="3">其他</checker-item>
            </checker></div></flexbox-item>
        </flexbox>
      </div>

      <div style="border:1px solid #d9d9d9">
        <flexbox >
            <flexbox-item :span="4"><div ><span style="color:red">*</span>联系电话:</div></flexbox-item>
            <flexbox-item><div ><x-input text-align="right" :show-clear="false" placeholder="请输入手机号码" mask="999 9999 9999" v-model="phone" :max="13"  is-type="china-mobile"></x-input></div></flexbox-item>
        </flexbox>
      </div>
      <div style="border:1px solid #d9d9d9">
        <flexbox >
            <flexbox-item :span="4"><div ><span style="color:red">*</span>诊断名称:</div></flexbox-item>
            <flexbox-item><div ><x-input text-align="right" :show-clear="false" placeholder="请输入诊断名称" v-model="zdmc" :max="20" is-type="text"></x-input></div></flexbox-item>
        </flexbox>
      </div>
      <div style="border:1px solid #d9d9d9">
        <flexbox>
            <flexbox-item :span="3"><div ><span style="color:red">*</span>上转科室:</div></flexbox-item>
            <flexbox-item :span="1" style="display: none"><div ><x-input></x-input></div></flexbox-item>
            <flexbox-item><div ><popup-radio :options="lis" v-model="szksmcdm"></popup-radio></div></flexbox-item>
        </flexbox>
      </div>

      <div id="bord">
        <x-textarea title="备注:" placeholder="可以输入备注信息..." :max="500" :height="160" v-model="bz" ></x-textarea>
      </div>
       <alert v-model="alertshow"  @on-show="onShow" @on-hide="onHide">{{tishi}}</alert>
      </group>
      <div>
      <confirm v-model="xingbietishi"
      @on-cancel="quxiao"
      @on-confirm="queren"
      @on-show="onShow"
      @on-hide="onHide">
        <p style="text-align:center;">查询到该患者性别为:{{sexs ==0 ? "女" : "男"}},与身份证显示性别不统一，是否更改该患者性别并提交？</p>
      </confirm>
    </div>
    </div>
      <flexbox-item>
        <x-button type="primary"  @click.native="submin()">保存并提交</x-button>
      </flexbox-item>
    </div>

  </div>
</template>

<script>
import {
  XTextarea,Flexbox, Datetime,Checker, Group,ButtonTab,FlexboxItem,PopupRadio,Alert,Confirm,
   ButtonTabItem,XButton,Divider,XTable,LoadMore,XInput,CheckerItem,TransferDom,XSwitch
 } from 'vux'
 import * as api from '../api/api';
export default {

  components: {
    XTextarea,
    Flexbox,
    Alert,
    XSwitch,
    Confirm,
    PopupRadio,
    FlexboxItem,
    Datetime,
    Checker,
    Group,
    ButtonTab,
    ButtonTabItem,
    XButton,
    Divider,
    XTable,
    LoadMore,
    XInput,
    CheckerItem,
  },
  data () {
    return {
  //------------>基础数据
      yljgmc:'',//医疗机构名称
      yljgdm:'',//医疗机构代码
      ysname:'',//医生姓名
      sfz: '',//登录医生身份证号码
  //------------------------》表单  患者
      xm:'',//患者姓名
      xb:'',//性别
      sfzh:'',//身份证号
      phone:'',//手机
      zdmc:'',//诊断名称
      szksmcdm:'请选择',//上转科室名称
      bz:'',//备注
      lis: [],//上传科室名称数据
      //--------------------------------》
      wid:'',//窗口数据
      heig:100,
      date:'',//身份证时间验证用
      alertshow:false,//是否显示错误提示
      shifou:false,//30天内能否上传
      tishi:'',//弹窗提示错误信息
      tijiao:false,//提交开关
      xingbietishi:false,//性别与身份证不符时的提示
      shenfentongguo:false,//身份验证通过开关
      sex:'',//性别判断
      sexs:"男",
      picFocusStatus :true,
      chenggong:false,
      tijiaochenggong:false//提交成功
    }
  },
     

  created(){

    var sf = localStorage.getItem("sfzh");
    if (sf==null) {
        this.$router.push('/')
    }
    this.getdata();//获取基础数据
    //获取手机屏幕尺寸
    var  w = document.documentElement.clientWidth || document.body.clientWidth;
    this.wid = w;
    let params = {

    };
    api.getKesqy(params).then(res => {//初始化上传科室列表
      for(var i=0;i<res.length;i++){
        this.lis.push(res[i].TEXT+"-"+res[i].PY);
      }
     });

  },

  methods: {
    change (value) {

    },
    onHide () {

   },
   onShow () {

   },
   quxiao(){//取消提交

   },
   onFocus (val, $event) {

   },
   queren(){//确认提交

     if(this.sexs === 0){//身份证为0女
       this.xb = 2;//性别为女
     }else if (this.sexs === 1) {//身份证为男
       this.xb = 1;
     }
     this.baocun();
   },
    getdata(){//请求基础数据
      //发送请求
      api.getBaseData().then(res => {
        this.yljgmc = res.yljgmc;
        this.yljgdm = res.yljgdm;
        this.ysname = res.name;
        this.sfz = res.sfz;
      });
    },
    listbox(){//跳转到列表页面
        this.$router.push('/Listbox')
    },
    checkIdcard(value){//身份证格式验证
      var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;      //二代身份证验证，一代身份证已经不能使用
      var areas = {//区域代码
        11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
        41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
        65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};      


      this.gettime();//获得当前时间
      if(reg.test(value)){//输入格式效验
        if (!areas[value.substr(0,2)]) {//户籍地效验
          return {valid:false,msg:"暂未查到该身份证所在户籍地！"}
        } else if (value.substr(6,8)>this.date) {//出生日期效验
          return {valid:false,msg:"暂未查到该身份信息，请检查输入信息或电脑时间！"}
        } else if (true) {//权位效验
          var code = value.split('');
          //∑(ai×Wi)(mod 11)
          //加权因子
          var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
          //校验位
          var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
          var sum = 0;
          var ai = 0;
          var wi = 0;
          for (var i = 0; i < 17; i++)
          {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
          }
          var last = parity[sum % 11];
          if(parity[sum % 11] != code[17]){
            //
            return {valid:false,msg:"身份信息效验错误！"};
          }else {//效验通过
            //获取接口数据
            this.shenfentongguo = true;
              return {valid:true};
          }
        }
        //  return {valid:true}       
       }  else {              
        return {valid:false,msg:"省份证格式错误"} // 验证错误 返回valid:false;   
            }     
     },
    gettime(){//获取当前时间，并进行格式化
      //定义时间
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.date = year + '' + month + '' + strDate;
    },
    submin(){//提交
      if(this.xm.length === 0){
        this.tishi = "还未输入患者姓名！";
        this.alertshow = true;
      } else if (this.xb.length === 0) {
        this.tishi = "请选择患者性别！";
        this.alertshow = true;
      } else if (this.sfzh.length === 0) {
        this.tishi = "还未输入患者身份证号码！";
        this.alertshow = true;
      } else if (this.phone.length != 13) {
        this.tishi = "请检查患者联系方式，输入患者手机号！";
        this.alertshow = true;
      } else if (this.zdmc.length === 0) {
        this.tishi = "还未输入诊断名称！";
        this.alertshow = true;
      } else if (this.szksmcdm.length === 0 ) {
        this.tishi = "请选择上转科室！";
        this.alertshow = true;
      }else if (!this.shenfentongguo) {
        this.tishi = "请检查患者身份证号！";
        this.alertshow = true;
      } else {
        //判断要上转的患者30天内是否从本院上转过
        let params = {
            hzsfzhm : this.sfzh,
  	        scyljgdm : this.yljgdm
        };
        api.findHaveHuanz(params).then(res =>{
          if (res === 1) {
            this.tishi = "该患者30天内已经上转，不能重复上转！"
            this.alertshow = true;
          }else {
            this.tijiao = true;//条件通过可以提交
            this.xinbie();
          }
        });

      }
    },
    xinbie(){//判断身份证性别是否与选择性别一致
      if(this.xb === 1){//1男 2女
        this.sex = 1; //如果选择的的性别是男，身份证的应该为男1

      }else if (this.xb === 2) { //如果选择的是女，身份证应该是 0
        this.sex = 0;
      }else {
        this.sex = 3;
      }
      if (this.sfzh.substr(17,1)%2 != this.sex) { //说明身份证查询结果和选择的性别不一致
        if(this.sfzh.substr(17,1)%2 === 0){ //身份证查询到的性别为女
          this.sexs = 0; //将性别修改为女
        }else {
          this.sexs = 1; //将性别修改为男
        }
        this.xingbietishi = true;//性别不一致开启提示
      }else {
        this.baocun();//性别一致，提交数据
      }
    },
    baocun(){//提交保存数据

      if (this.tijiao && this.shenfentongguo ) {

        // 提交数据准备
        // 拆分科室名称和科室代码
        var ks = this.szksmcdm.split('-');
        var szksmc = ks[0];//科室名称
        var szksdm = ks[1];//科室代码
        var phons = this.phone.split(' ');
        var phon = phons[0]+phons[1]+phons[2];//转换后的电话号码

          let params = {
              hzname : this.xm,           	//		姓名
              hzxb : this.xb,		              	//性别
              hzsfzhm : this.sfzh,		        //身份证号码
              hzlxdh : phon,		          //	联系电话
              scyygh : this.sfz,		    //上传医生身份证号码
              scyyxm : this.ysname,	  	  //上转医生姓名
              scyljgdm : this.yljgdm,	  //医疗机构代码
              scyljgmc : this.yljgmc,		//医疗机构名称
              hzzdmc : this.zdmc,			        //诊断名称
              scksdm : szksdm,		      //上转科室代码
              scksmc : szksmc,		  //上转科室名称
              bz : this.bz
          };
            api.addpatient(params).then(res =>{
              console.log("提交成功后的数据："+res);
              this.tishi = "数据已成功提交请返回列表查看";
              this.alertshow = true;
            });

        }else {
          this.tishi = "数据提交失败！"
          this.alertshow = true;
        }
    }
  }
}
</script>
<style>
.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 15px;
  margin: 5px;
}
.demo1-item-selected {
  border: 1px solid green;
}
#body{
  width: 90%;
  height: 100%;
  margin: auto;
}
#bord{
  border: 1px solid #d9d9d9;
}
#bords{
   margin-top: 15px;
   margin-bottom: 15px;
}
.weui-cells {
  margin-top: 0;
background-color: #FFFFFF;
line-height: 0;
font-size: 17px;
overflow: ;
position: ;
}
#beijin{

}
</style>

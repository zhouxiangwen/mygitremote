<template>
  <div v-bind:style="{height:heig+'%',width:wid+'px'}">
    <divider><h3>{{yljgmc}}</h3></divider>
    <div id="body">
      <button-tab >
          <button-tab-item style="background-color: rgb(4, 190, 2); color: #FFF;">患者列表</button-tab-item><!--跳转到信息列表页面-->
          <button-tab-item @on-item-click="shanzhuan()">+上转患者</button-tab-item><!--跳转到上转患者页面-->
      </button-tab>
      <div class="date">
        <group >
            <datetime
                v-model="riqiMin"
                 @on-change="change"
                 @on-confirm="onConfirm"
                 title="开始时间"
                 label-width="100px" >
            </datetime>
        </group>
        <group  id="date" >
            <datetime  v-model="riqiMax"  @on-change="change" @on-confirm="onConfirm" title="结束时间"></datetime>
        </group>
        <x-button type="primary" @click.native="query()" orient="vertical">搜索</x-button>
      </div>
      <br>
      <div id="tab" style="text-align: left;">
        <x-table orient="vertical"  :key="index" v-for="(row,index) in rowss" :full-bordered="true" style="line-height:25px; margin-bottom:20px;">
           <tr>
             <td><div id="le">&nbsp;&nbsp;姓名：{{row.HZNAME}}</div></td>
             <td><div id="le">&nbsp;&nbsp;性别：{{row.HZXB==1 ? "男" : row.HZXB==2 ? "女" : "其他"}}</div></td>
           </tr>
           <tr>
             <td colspan="2"><div id="le">&nbsp;&nbsp;身份证号：{{row.HZSFZHM.substr(0,12)}}******</div></td>
           </tr>
           <tr>
             <td colspan="2"><div id="le">&nbsp;&nbsp;电话号码：{{row.HZLXDH}}</div></td>
           </tr>
           <tr>
             <td colspan="2"><div id="le">&nbsp;&nbsp;上转时间：{{row.SZSJ}}</div></td>
           </tr>
           <tr>
             <td colspan="2"><div id="le">&nbsp;&nbsp;上转科室：{{row.SCKSMC}}</div></td>

           </tr>
           <tr>
             <td colspan="2"><div id="le">&nbsp;&nbsp;诊断名称：{{row.HZZDMC}}</div></td>
           </tr>
           <tr>
             <td colspan="2"><div id="le">&nbsp;&nbsp;就诊时间：暂无相关信息！</div></td>
           </tr>
           <tr>
             <td><div id="le">&nbsp;&nbsp;是否到院：暂无信息！</div></td>
             <td><div id="le">&nbsp;&nbsp;是否转出：暂无信息！</div></td>
           </tr>
           <tr>
             <td colspan="2"><div id="le">&nbsp;&nbsp;详情：暂无相关信息！</div></td>
           </tr>
           <tr>
              <td  colspan="2"><div id="le">&nbsp;&nbsp;备注：{{row.BZ}}</div></td>
           </tr>
       </x-table>
      </div>
      <br>
       <h6 v-show="chaxun" >暂未查询到相关数据...</h6>
    </div>
  </div>
</template>

<script>
import { Datetime, Group,ButtonTab, ButtonTabItem,XButton,Divider,XTable,LoadMore } from 'vux';
import * as api from '../api/api';

export default {
  components: {
    Datetime,
    Group,
    ButtonTab,
    ButtonTabItem,
    XButton,
    Divider,
    XTable,
    LoadMore
  },
  data () {
    return {
      riqiMin: '2019-03-01',
      riqiMax: '2019-03-30',
      riqixianzai:'',
      sfdy:'',//是否到院
      sfzc:'',//是否转出
      bz:'',//备注
      xq:'',//详情
      isshow:true,//是否显示数据
      chaxun:false,//提示
      //-------------------------->
      createtime: '',//创建时间
      deletetime: '',//删除时间
      id: '',//暂时用户ID
      juesebh: "14",//角色代码
      juesename: '',//角色名称
      kesmc: '',//科室名称
      lxdh: '',//联系电话
      name: '',//姓名
      page: '',
      rowss: [],//数据返回行
      sfqy: '',
      sfz: '',//身份证号码
      username: '',//用户账户
      userpassword: '',//用户密码
      yljgdm: '',//医疗机构代码
      yljgmc: '',//医疗机构名称
      ysgh: '',
      yskesdm: '',
      wid:'',
      heig:100,
      r:''
    }
  },
  created(){//mounted
    this.gettime();//获得当前时间
    //获取窗口尺寸动态赋值；
    var  w = document.documentElement.clientWidth || document.body.clientWidth;
    this.wid = w;
    this.getdata();//请求基本数据

    this.query();//查询数据
    var sf = localStorage.getItem("sfzh");
    if (sf==null) {
        this.$router.push('/Login')
    }
  },
  methods: {
     change (value) {

    },
    onConfirm (val) {

    },
    getdata(){//请求基础数据
      //发送请求
      api.getBaseData().then(res => {
        this.name = res.name;
        this.yljgmc = res.yljgmc;
        this.yljgdm = res.yljgdm;
      });
    },
    gettime(){//获取当前时间，并进行格式化

      let date = new Date();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.riqiMax = date.getFullYear() + "-" + (month <= 9 ? ("0" + month) : month) + "-" + (day <= 9 ? ("0" + day) : day);

      let dateStart = new Date();
      dateStart.setMonth(dateStart.getMonth() - 1);
      let monthStart = dateStart.getMonth() + 1;
      let dayStart = dateStart.getDate();
      this.riqiMin = dateStart.getFullYear() + "-" + (monthStart <= 9 ? ("0" + monthStart) : monthStart) + "-" + (dayStart <= 9 ? ("0" + dayStart) : dayStart);
    },
    shanzhuan() {
        this.$router.push('/Shangzhuan')
    },
    query(){//执行查询

      // if (this.riqiMax > this.riqixianzai) {
      //   this.riqiMax = this.riqixianzai;
      // }
      // if (this.riqiMin > this.riqixianzai) {
      //   this.riqiMin = this.riqixianzai;
      // }
      let params = {
        riqiMin:this.riqiMin,
        riqiMax: this.riqiMax,
        yljgdm: this.yljgdm,
        ksdm:'',
        ysgh: '',
        juesebh: this.juesebh,
        page: 1,
        rows: 10
      };

      api.getHzxxByYsgh(params).then(res =>{
        this.rowss = res.rows;
        res.rows.length === 0 ? this.chaxun = true : this.chaxun = false;
      });
    }
  }
}
</script>
<style >

.vux-table td {
  text-align: left;
  height: auto;
}
#le{
  float: left;
  font-size: 14px;
  margin: 0px;
  padding: 0px;
  touch-action: none;
}

#body{
  width: 90%;
  height: 100%;
  margin: auto;
  touch-action: none;
}

</style>

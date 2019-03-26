import axios from 'axios';
import qs from 'qs';

let base = 'api'

// axios.defaults.withCredentials = true;

// loginUrl http://10.255.0.204:8081/login/login?username=tbl0275&userpassword=123456&isRemember=false

export const login = params => {
  return axios.post(`/api/login/login`, qs.stringify(params)).then(res => res.data);
}; // 获取登录用户信息

export const getBaseData = params => {
  return axios.post(`/api/login/getInfo`, qs.stringify(params)).then(res => res.data);
}; // 获取列表数据

export const getHzxxByYsgh = params => {
  return axios.post(`/api/shangzyljgys/getHzxxByYsgh`,qs.stringify(params)).then(res => res.data);
}; //获取上转患者人员信息


export const getKesqy = params => {
  return axios.get(`/api/shangzyljgys/getKesqy`,qs.stringify(params)).then(res => res.data);
}; //获取上转患者页面中上转科室信息

export const findHaveHuanz = params => {
  return axios.post(`/api/shangzyljgys/findHaveHuanz`,qs.stringify(params)).then(res => res.data);
}; //判断要上转的患者30天内是否从本院上转过

export const addpatient = params => {
  return axios.post(`/api/shangzyljgys/addHzxx`,qs.stringify(params)).then(res => res.data);
}; //添加上转患者

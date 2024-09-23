// pages/detail-video/detail-video.js
import {getMVUrl,getMVInfo,getMVRelated} from "../../services/video"
Page({
  data:{
    id:0,
    MVUrl:'',
    mvInfo:{},
    mvRelated:[],
    danmuList:[
      {text:"哈哈哈，针不戳",color:"#ff0000",time:3},
      {text:"一般般说实话,不如GDS",color:"#ffff00",time:4},
      {text:"们人家了语无",color:"#ffffff",time:5}
    ]
  },
  onLoad(options){
    const id = options.id
    this.setData({id})
    this.fetchMVUrl()
    this.fetchMVInfo() 
    this.fetchMVRelated()
  },
  async fetchMVUrl(){
    const res = await getMVUrl(this.data.id)
    this.setData({MVUrl:res.data.url})
  },
  async fetchMVInfo(){
    const res = await getMVInfo(this.data.id)
    this.setData({mvInfo:res.data})
  },
  async fetchMVRelated(){
    const res = await getMVRelated(this.data.id)
    this.setData({mvRelated:res.data})
  }
})
// pages/detail-menu/detail-menu.js
import {getSongMenuList, getSongMenuTag} from "../../services/music"
Page({
  data: {
    songMenus:[]
  },
  onLoad() {
    this.fetchAllMenuList()
  },
  //网络请求函数封装
  async fetchAllMenuList(){
    // 1.获取tags
    const res = await getSongMenuTag()
    const tags = res.tags
    // 2.根据tags获取对应的歌单
    const allPromise = []
    for(const tag of tags){
      const promise = getSongMenuList(tag.name)
      allPromise.push(promise)
    }
    // 3.获取到全部的数据后，setState
    Promise.all(allPromise).then(res=>{
      this.setData({songMenus:res})
    })
  }
})

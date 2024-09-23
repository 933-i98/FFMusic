// components/arear-header/area-header.js
Component({
  properties: {
    title:{
      type:String,
      value:"默认标题"
    },
    hasmore:{
      type:Boolean,
      value:true
    }
  },
  methods:{
    onMoreTap(){
      this.triggerEvent("moreclick")
    }
  }
})
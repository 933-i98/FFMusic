import { getMusicBanner, getSongMenuList } from "../../services/music.js";
import recommendStore from "../../store/recommendStore.js";
import rankingStore from "../../store/rankingStore.js";
import playerStore from "../../store/playerStore.js"

const app = getApp();

Page({
  data: {
    searchValue: "",
    banners: [],
    bannerHeight: 130,
    recommendSongs: [],
    hotMenuList: [],
    recMenuList: [],
    screenWidth: app.globalData.screenWidth || 412, 
    // 设置默认宽度为412，可以根据实际需要调整
    isRankingData: true,
    rankingInfos:{},

    //当前正在播放的歌曲信息
    currentSong:{},
    isPlaying: false
  },

  onLoad() {
    this.fetchMusicBanner();
    this.fetchSongMenuList();

    // 订阅event-store
    recommendStore.onState("recommendSongs", this.handleRecommendSongs);
    rankingStore.onState("newRanking", this.handleNewRanking);
    rankingStore.onState("originRanking", this.handleOriginRanking);
    rankingStore.onState("upRanking", this.handleUpRanking);
    playerStore.onStates(["currentSong", "isPlaying"], this.handlePlayInfos)
    // 发起action
    recommendStore.dispatch("fetchRecommendSongsAction");
    rankingStore.dispatch("fetchRankingDataAction");

    // 设置屏幕尺寸
    if (app.globalData.screenWidth) {
      this.setData({ screenWidth: app.globalData.screenWidth });
    }
  },

  onUnload() {
    //其实写不写都一样，因为这个页面会一直开着，不会出现onUnload
    recommendStore.offState("recommendSongs", this.handleRecommendSongs);
    rankingStore.offState("newRanking", this.handleNewRanking);
    rankingStore.offState("originRanking", this.handleOriginRanking);
    rankingStore.offState("upRanking", this.handleUpRanking);
    playerStore.offStates(["currentSong", "isPlaying"], this.handlePlayInfos)

  },

  // 网络请求封装
  async fetchMusicBanner() {
    const res = await getMusicBanner();
    this.setData({ banners: res.banners });
  },

  async fetchSongMenuList() {
    try {
      const [hotRes, recRes] = await Promise.all([
        getSongMenuList(),
        getSongMenuList("华语"),
      ]);
      this.setData({
        hotMenuList: hotRes.playlists,
        recMenuList: recRes.playlists,
      });
    } catch (error) {
      console.error("Failed to fetch song menu list", error);
    }
  },

  // 界面的监听方法
  onSearchClick() {
    wx.navigateTo({ url: '/pages/detail-search/detail-search' });
  },

  onBannerImageLoad(event) {
    const query = wx.createSelectorQuery();
    query.select('.banner-image').fields({ size: true }, rect => {
      if (rect) {
        this.setData({ bannerHeight: rect.height });
      } else {
        console.error("Failed to get banner image size");
      }
    }).exec();
  },

  onRecommendMoreclick() {
    wx.navigateTo({ url: '/pages/detail-song/detail-song?type=recommend' });
  },
  onSongItemTap(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList",this.data.recommendSongs)
    playerStore.setState("playSongIndex",index)
  },
  onPlayOrPauseBtnTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },

  onPlayBarAlbumTap() {
    wx.navigateTo({
      url: '/pages/music-player/music-player',
    })
  },

  // ========================从store中获取数据==============================
  handleRecommendSongs(value) {
    if(!value.tracks) return 
    this.setData({ recommendSongs: value.tracks.slice(0, 6) });
  },
  handleNewRanking(value) {
    const newRankingInfos={...this.data.rankingInfos,newRanking:value}
    this.setData({rankingInfos:newRankingInfos})
  },
  handleOriginRanking(value) {
    const newRankingInfos={...this.data.rankingInfos,originRanking:value}
    this.setData({rankingInfos:newRankingInfos})
  },
  handleUpRanking(value) {
    const newRankingInfos={...this.data.rankingInfos,upRanking:value}
    this.setData({rankingInfos:newRankingInfos})
  },
  handlePlayInfos({ currentSong, isPlaying }) {
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
  },
});

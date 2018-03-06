var util = require('../../utils/util.js')
var inputinfo = ""
var app = getApp()
var vm = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoucang: [],//收藏壁画
    edit_bihua: [],//修改收藏壁画的名称
    isNall: true,    //是否为空
    data: [],
    showAlert: false,//显示弹窗
    toast: "",//toast
    id: '',//收藏id
    //toast默认不显示  
    isShowFailToast: false
  },
  click_qxsc: function (e) {//取消弹出框
    console.log("asdf" + JSON.stringify(e))
    wx.showModal({
      title: '取消收藏',
      content: '忍心抛弃吗>_<',
      success: function (sm) {
        if (sm.confirm) {
          //点击确定 调用删除方法
          var param = {
            id: e.target.dataset.id
          }
          util.cancelCollBihua(param, function (res) {
            //console.log("cancelCollBihua : " + JSON.stringify(res)) 
            wx.showToast({
              title: '取消收藏成功',
            })
            //刷新页面
            vm.getfavorbihua()
          })

        } else if (sm.cancel) {
          console.log('点击了取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    vm = this;
    vm.getfavorbihua(); //获取收藏的壁画 
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
  },

  //获取收藏图
  getfavorbihua: function () {
    util.getListByUserId({}, function (res) {
      console.log("getListByUserId : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        var data = res.data.ret//定义显示隐藏用到的data
        vm.setData({
          shoucang: res.data.ret
        })
        if (data.length == 0) {//如果收藏页面数据是空
          vm.setData({
            no_view_hidden: ""//so显示 未收藏的提示页面
          })
          console.log("未收藏的提示页面")
        } else {//如果有数据
          var data = res.data.ret//定义data循环判断出修改的名字有/无
          for (var i = 0; i < data.length; i++) {
            if (data[i].set_name != null) {//如果有修改的值，显示修改的值
              vm.setData({
                no_view_hidden: "hidden",//隐藏未收藏的提示页面
                no_view_hiddenEdit: "",//显示 单个被修改的值 不能显示所有修改的值 修改一个名字 其余的都显示了 set_name 就是null
                no_view_hiddenName: "hidden"//隐藏 原有的值
              })
            } else {//如果没有，显示原来的名字
              vm.setData({
                no_view_hidden: "hidden",//隐藏 未收藏提示的页面
                no_view_hiddenEdit: "hidden",//隐藏 修改的值                
                no_view_hiddenName: ""//显示 原有的值
              })
            }
          }
        }
      } else {//没有收藏过
        vm.setData({
          no_view_hidden: ""//显示 未收藏的提示页面
        })
      }
    }, function () {
      console.log("错误回调")
    })
  },
  //编辑壁画重命名 
  setBihuaName: function () {
    var param = {
      id: vm.data.id,
      set_name: vm.data.toast//获取修改的名称 传进去
    }
    util.setBihuaName(param, function (res) {
      console.log("setBihuaName : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        vm.setData({
          edit_bihua: res.data.ret
        })
        vm.getfavorbihua()//修改后立刻获取更新
        vm.hiddonToast()//关闭弹窗
      } else {
        //输入为空时
        vm.hiddonToast()
        vm.clickBtn()//自定义显示的toast
      }
    }, function () {
      console.log("错误回调")
    })
  },


  //显示弹窗
  showToast: function (e) {
    console.log("111" + JSON.stringify(e))
    vm.setData({
      id: e.target.dataset.id,
      showAlert: true
    })
  },

  //隐藏弹窗
  hiddonToast: function () {
    vm.setData({ showAlert: false })
  },

  //获取修改文字
  getInput: function (e) {
    console.log("word" + JSON.stringify(e.detail.value))
    var value = e.detail.value
    vm.setData({
      toast: value//设置进去
    })
  },


  showFailToast: function () {
    var _this = this;
    // toast时间  
    _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
    // 显示toast  
    _this.setData({
      isShowFailToast: true,
    });
    // 定时器关闭  
    setTimeout(function () {
      _this.setData({
        isShowFailToast: false
      });
    }, _this.data.count);
  },
  /* 点击按钮 */
  clickBtn: function () {
    console.log("你点击了按钮")
    //设置toast时间，toast内容  
    this.setData({
      count: 2000,
      toastText: '输入为空默认不修改哦'
    });
    this.showFailToast();
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    vm.getfavorbihua();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
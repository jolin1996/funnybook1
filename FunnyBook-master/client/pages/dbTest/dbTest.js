// pages/dbTest/dbTes.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var qcloudconfig = require('../../config');
var util = require('../../util/util')
var name = "无"
var gender = "男"
var age = 0
Page({
    /**
    * 页面的初始数据
    */
    data: {
        name: "空",
        gender: "空",
        age: 0
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        var that = this;
    },
    dataUpload: function (event) {
        var that = this;
        var name = event.detail.value.nameInput;
        var age = event.detail.value.ageInput;
        var table = 'users';
        var data = {
            name: name,
            age: age,
            gender: 1
        }
        var obj = {
            table: table,
            data: data
        };
        qcloud.request({
            url: qcloudconfig.service.dbInsertUrl,
            method: "POST",
            data: obj,
            login: false,
            success(result) {
                console.log(result.data.data);
                if (result.data.data.code == 0)
                    util.showSuccess('请求成功');
                else
                    util.showModel('数据库操作失败', result.data.data.message);
            },
            fail(error) {
                util.showModel('请求失败', error);
            },
        });
    },
    dataSearch: function (event) {
        var that = this;
        var openID = event.detail.value.id;
        var table = 'users';
        var data = {
            openID: openID
        }
        var obj = {
            table: table,
            data: data
        };
        qcloud.request({
            url: qcloudconfig.service.dbFindUrl,
            method: "POST",
            data: obj,
            login: false,
            success(result) {
                console.log(result.data.data);
                if (result.data.data.code == 3)
                    util.showSuccess('请求成功');
                else
                    util.showModel('数据库操作失败', result.data.data.message);
            },
            fail(error) {
                util.showModel('请求失败', error);
            },
        });
    },
    /**
    * 生命周期函数--监听页面显示
    */
    onShow: function () {
    }
}) 
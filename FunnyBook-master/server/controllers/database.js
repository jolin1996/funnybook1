const { mysql } = require('../qcloud.js');
const tableName = 'test';
const keyField = 'bookname';
const valueField = 'number';
async function updateRecord(ctx) {
    var obj = ctx.request.body;
    console.log(obj)
    await mysql(obj.tableName)
        .where(JSON.parse(obj.query))
        .update(JSON.parse(obj.updateValue))
        .then(async function (res) {
            // 插入记录
            ctx.response.body = res
        })
}
async function deleteRecord(ctx) {
    var obj = ctx.request.body;
    console.log(obj);
    await mysql(obj.tableName)
        .where(JSON.parse(obj.query))
        .delete()
        .then(async function (res) {
            // 插入记录
            ctx.response.body = res;
        })
}
async function selectRecord(ctx) {
    var obj = ctx.query;
    console.log(obj);
    var res = await mysql(obj.tableName).select().where(JSON.parse(obj.query)).then(async function (res) {
        // 查询得知已有该键
        console.log(res)
        ctx.response.body = res;
        ctx.state.data = {
            code: 1,
            message: "key already exists",
        }
    });
}
// async function insertRecord(ctx) {
//     var obj = ctx.request.body;
//     console.log(obj)
//     // 查询是否键重复
//     await mysql(obj.tableName)
//         .select()
//         .where(JSON.parse(`{"${keyField}":"${obj.key}"}`))
//         .then(async function(res) {
//             // 插入记录
//             if(!res.length) {
//                 await mysql(obj.tableName)
//                     .insert(JSON.parse(`{"${keyField}":"${obj.key}","${valueField}":"${obj.value}"}`))
//                     .then(function(res) {
//                         ctx.response.body=res;
//                         ctx.state.data = {
//                             code: 0,
//                             message: "ok",
//                         };
//                     });
//             }
//             // 查询得知已有该键
//             else {
//                 ctx.state.data = {
//                     code: 1,
//                     message: "key already exists",
//                 }
//             }
//         })
// }
async function insertRecord(ctx) {
    var obj = ctx.request.body;
    console.log(obj)
    // 查询是否键重复
    // 插入记录
    await mysql(obj.tableName)
        .insert(JSON.parse(obj.insertValue))
        .then(function (res) {
            ctx.response.body = res;
            ctx.state.data = {
                code: 0,
                message: "ok",
            };
        });
    // 查询得知已有该键
}
module.exports = {
    insertRecord,
    deleteRecord,
    updateRecord,
    selectRecord,
}; 
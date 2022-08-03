const { FriendChainMod } = require('../config/mongoDbServer');
const moment = require('moment');
const { Response, ApiResponse } = require('../middleware/response');

exports.blogFriendService = {
    addFriendChain:async (req, res) => {
        const { avatar, side, title, describe } = req.body;
        try {
            let insert = await FriendChainMod.create({
                chain_avatar: avatar,
                chain_describe: describe,
                chain_side: side,
                chain_title: title,
                create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            });
            ApiResponse(new Response(200, '友链添加成功', insert, null, res));
        } catch (error) {
            ApiResponse(new Response(500,'友链添加失败' + error, null, null, res));
        }
    },
    getFriendChain: async (req, res) => {
        let { pages, limits, /* search, query */ } = req.query;
        pages = parseInt(pages);
        limits = parseInt(limits);
        try {
            const total = await FriendChainMod.estimatedDocumentCount();
            const data = await FriendChainMod.find().skip((pages - 1) * limits).limit(limits);
            
            ApiResponse(new Response(200, '友链查找成功', data, { count: total }, res));
        } catch (error) {
            ApiResponse(new Response(500, '友链查找失败' + error, null, null, res));
        }
    },
    updateFriendChain: async(req, res) => { 
        const { avatar, side, title, describe, id } = req.body;
        try {
            let update = await FriendChainMod.updateOne({
                chain_avatar: avatar,
                chain_describe: describe,
                chain_side: side,
                chain_title: title,
                update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            }).where("_id").equals(id);
            ApiResponse(new Response(200, '友链修改成功', update, null, res));
        } catch (error) {
            ApiResponse(new Response(500, '友链修改失败' + error, null, null, res));
        }
    },
    deleteFriendChain: async (req, res) => {
        const { id } = req.query;
        try {
            let del = await FriendChainMod.deleteOne().where("_id").equals(id);
            ApiResponse(new Response(200, '友链删除成功', del, null, res));
        } catch (error) {
            ApiResponse(new Response(500, '友链删除失败' + error, null, null, res));
        }
    }
};
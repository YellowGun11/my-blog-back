const moogoose = require('../db')
const Schema = moogoose.Schema

const ArticleSchema = Schema({
    url: String,
    title: String,
    des: String,
    tag: String,
    content: String,
    status: {
        type: Number,
        require: true,
        default: 0,
    },
    readNum:{
        type: Number,
        require: true,
        default: 0,
    }
    
},{timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}});

const Article = moogoose.model('article', ArticleSchema) 

class Mongodb {
    constructor(){}
    // 保存
    save(obj){
        const m = new Article(obj)
        return new Promise((resolve,reject)=>{
            m.save((err,res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
                console.log(res)
            })
        })
    }
}

module.exports=new Mongodb();
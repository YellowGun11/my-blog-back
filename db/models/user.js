const moogoose = require('../db')
const Schema = moogoose.Schema

const UserSchema = Schema({
    username: String,
    password: String
});

const User = moogoose.model('article', UserSchema) 

class Mongodb {
    constructor(){}

    findName(){
        return new Promise((resolve,reject)=>{
            User.find({},(err,res)=>{
                console.log(res)
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        })
    }
    // 查询
    query(obj){
        return new Promise((resolve,reject)=>{
            User.find(obj,(err,res)=>{
                console.log('err')
                console.log(err)
                console.log('res')
                console.log(res)
                if(err){
                    console.log(err)
                    resolve([])
                }
                resolve(res)
            })
        })
    }
    // 保存
    save(obj){
        const m = new User(obj)
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
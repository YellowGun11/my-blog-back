// 引入MongoDB模块
const MongoDB = require('mongodb');
// 引入MongoDB连接模块
const MongoClient = MongoDB.MongoClient;
// 引入MongoDB ObjectID模块
const ObjectID = MongoDB.ObjectID;
// 引入配置文件
const Config = require('./config');

class Db {
  // 单例模式，解决多次实例化时候每次创建连接对象不共享的问题，实现共享连接数据库装填
  static getInstance(){
    if(!Db.instance){
      Db.instance = new Db();
    }
    return Db.instance;
  }

  constructor(){
    // 属性 存放db对象
    this.dbClient = "";
    // 实例化的时候就连接数据库，增加连接数据库速度
    this.connect();
  }

  // 连接数据库
  connect(){
    return new Promise((resolve, reject)=>{
      // 解决数据库多次连接的问题，要不然每次操作数据库都会进行一次连接数据库的操作，比较慢
      if(!this.dbClient){
        // 第一次的时候连接数据库
        MongoClient.connect(Config.dbUrl,(err,client)=>{
          if(err){
            reject(err)
          }else{
            // 将连接数据库的状态赋值给属性，保持长连接状态
            this.dbClient = client.db(Config.dbName);
            resolve(this.dbClient)
          }
        })
      }else{
        // 第二次之后直接返回dbClient
        resolve(this.dbClient)
      }
    })
  }

  /**
   * 查询数据库
   * 使用方法： let result = await DB.find('user',{});
   * @param {String} collectionName 集合名称、数据表名
   * @param {Object} json 查询的条件
   */
  find(collectionName, json, paging, data){
    return new Promise((resolve,reject)=>{
      this.connect().then((db)=>{
        // 操作db库里的某一个表，返回符合条件的内容，json查找的条件
        let result;
        if(paging){
          const {beginIndex=0,limit=10} = data;
          result = db.collection(collectionName).find(json).skip(beginIndex).limit(limit);
        }else{
          result = db.collection(collectionName).find(json);
        }
        result.toArray(function(err,docs){
          if(err){
            reject(err)
            return
          }
          db.collection(collectionName).find().count((err,res)=>{
            if(err){
              reject(err)
              return
            }else{
              resolve({data:docs,total:res})
            }
          })
        })
      })
    })
  }

  /**
   * 更新数据库
   * 使用方法： let result = await DB.update('user',{'username':'lisi'},{'username':'李四'});
   * @param {String} collectionName 集合名称、数据表名
   * @param {Object} json1 需要更新数据的条件
   * @param {Object} json2 新数据的内容
   */
   update(collectionName, json1, json2) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        // 操作db库里的某一个表，更新一条数据，json1查找的内容，json2更新的新内容，回调函数
        db.collection(collectionName).updateOne(
          json1,
          {
            $set: json2,
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
    });
  }

  /**
   * 插入数据库
   * 使用方法： let result = await DB.insert('user',{'username':'赵六666','age':30,'sex':'女','status':'2'});
   * @param {String} collectionName 集合名称、数据表名
   * @param {Object} json 插入的新数据
   */
  insert(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        // 操作db库里的某一个表，插入一条数据，json插入的新内容，回调函数
        db.collection(collectionName).insertOne(json, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  /**
   * 批量插入数据库
   * 使用方法： let result = await DB.insert('user',[{'username':'赵六666','age':30,'sex':'女','status':'2'},{'username':'赵六666','age':30,'sex':'女','status':'2'},{'username':'赵六666','age':30,'sex':'女','status':'2'}...]);
   * @param {String} collectionName 集合名称、数据表名
   * @param {Array} json 批量插入的新数据
   */
  insertMany(collectionName, arr) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        // 操作db库里的某一个表，批量插入一组数据，arr批量插入的新内容，回调函数
        db.collection(collectionName).insertMany(arr, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  /**
   * 删除数据
   * 使用方法： let result = await DB.remove('user',{'username':'李四'});
   * @param {String} collectionName 集合名称、数据表名
   * @param {Object} json 删除数据的条件
   */
  remove(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).removeOne(json, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  /**
   * 通过id查询数据时候需要用到此方法，MongoDB里面查询_id ，把字符串转换成对象
   * MongoDB数据库里的_id是自动生成的，通过dind方法查询结果可以看到形式如： {"_id": ObjectId("5aad299bc166236421c99d229")},直接传入5aad299bc166236421c99d229，是查询不到结果的，所以需要包装一下
   * 使用方法： let result = await DB.find('user',{'_id': DB.getObjectID(xxxxx)});
   * @param {String} id 要查询的id
   */
  getObjectID(id) {
    return new ObjectID(id);
  }
}

module.exports = Db.getInstance();
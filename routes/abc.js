var express = require('express');
var router=express.Router();
var Sequelize = require('sequelize');
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var rc = redis.createClient(6379, '127.0.0.1');
var sequelize = new Sequelize('hurryup', 'root', 'saranya123',{
	host:"127.0.0.1",
	port:3306,
	dialect:"mariadb"
})
 
 
//creating/defining a table with tablename table1 and giving it into a variable User
var User = sequelize.define('table1', {
  "title": Sequelize.STRING,
 "director" :Sequelize.STRING,
  "genre": Sequelize.STRING
},{timestamps:false});




//inserting data into table1 dynamically using User.create method
router.post('/u',function(req,res,next){

 User.create({"id":req.body.id,"title":req.body.title,"director":req.body.director,"genre":req.body.genre}).  
    then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});

//creating a table with tablename table2 and giving it into a variable Post
var Post = sequelize.define('table2', {
  "title": Sequelize.STRING,
 "review" :Sequelize.STRING,
  "hero": Sequelize.STRING
  
},{timestamps:false});


//inserting data into table2 dynamically using Post.create method
router.post('/p',function(req,res,next){

 Post.create({"id":req.body.id,"title":req.body.title,"review":req.body.review,"hero":req.body.hero}).  
    then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});


//to create foreignKey for the two tables to retrieve data
//User.hasMany(Post, {foreignKey: 'id'})
Post.belongsTo(User, {foreignKey: 'id'})




//to retrieve data from two tables using sequelizer method
router.get('/:title',function(req,res,next){
	console.log("hi")
	Post.findAll({
		where:{
			title: req.params.title
		},
		include:[User]
	}).then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});

//to retrieve data using sequelizer in terms of queries
router.get('/select',function(req,res,next){
sequelize.query('SELECT * from table1s where id=1',
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }
).then(projects => {
  console.log(projects)
  res.send(projects);
})
	
});

// using rediscache with queries to retrieve data
//queries:SELECT * FROM table1s LEFT JOIN table2s ON table1s.title = table2s.title
//SELECT * FROM table1s CROSS JOIN table2s
//(SELECT * FROM table1s where id=1)UNION(SELECT * FROM table1s where id=1)
//SELECT * FROM table2s RIGHT JOIN table1s ON table1s.title = table2s.title
var cacheObj = cacher(sequelize, rc).ttl(30);
cacheObj.query('SELECT * FROM table1s where id=1')
  .then(function(row) {
    console.log(row); // Array of raw objects 
  });


// using redis-cache methods to find data from two tables
//the below method works as left join query as shown ===>SELECT 'table2'.'id','table2'.'title','table2'.'review','table2'.'hero','table1'.'id',AS 'table1.id',
//'table1'.'title',AS 'table1.title','table1'.'director',AS 'table1.director','table1'.'genre',AS 'table1.genre' FROM 'table2' AS 'table2'
//LEFT OUTER JOIN 'table1s' AS 'table1' ON 'table2'.'id' = 'table1'.'id' WHERE 'table2'.'title' = 'movie2' GROUP BY 'hero' ORDER BY 'table2'.'review' ASC;
router.get('/:title',function(req,res,next){
	console.log("hi")
	var cacheObj = cacher(sequelize,rc)
	.model('table2')
	.ttl(1000);
	
	cacheObj.findAll({
		where:{
			title: req.params.title
	},include:[User]
	}).then(function(jane){
		res.json(jane);
	}, function(error){
		res.send(error);
	});
});

module.exports = sequelize;
module.exports = User;
module.exports=Post;
module.exports = router;

//This works as Inner Join query
//Post.findAll({ include: [{model: User, required: true}]})




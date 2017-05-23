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
 
 

var User = sequelize.define('table1', {
  "title": Sequelize.STRING,
 "director" :Sequelize.STRING,
  "genre": Sequelize.STRING
},{timestamps:false});



/*var cacheObj = cacher(sequelize, rc).ttl(30);
cacheObj.query('SELECT * FROM table1s where id=1')
  .then(function(row) {
    console.log(row); // Array of raw objects 
  });*/


router.post('/u',function(req,res,next){

 User.create({"id":req.body.id,"title":req.body.title,"director":req.body.director,"genre":req.body.genre}).  
    then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});

var Post = sequelize.define('table2', {
  "title": Sequelize.STRING,
 "review" :Sequelize.STRING,
  "hero": Sequelize.STRING
  
},{timestamps:false});

router.post('/p',function(req,res,next){

 Post.create({"id":req.body.id,"title":req.body.title,"review":req.body.review,"hero":req.body.hero}).  
    then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});

//User.hasMany(Post, {foreignKey: 'id'})
Post.belongsTo(User, {foreignKey: 'id'})





router.get('/:title',function(req,res,next){
	console.log("hi")
	Post.findAll({
		where:{
			title: req.params.title
		},
		include:[User],order: [
            ['review', 'ASC']
           
        ],group: ['hero']
	}).then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});

router.get('/select',function(req,res,next){
sequelize.query('SELECT * from table1s where id=1',
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }
).then(projects => {
  console.log(projects)
  res.send(projects);
})
	
});


/*router.get('/:title',function(req,res,next){
	console.log("hi")
Sequelize.Union({
  model: Post,
  attributes: ['id','title','review','hero'],
  where: {title: req.params.title}
}, {
  model: User,
  attributes: ['id','title','director','genre'],
  where: {title: req.params.title}
}).then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});*/

/*router.get('/:title',function(req,res,next){
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
});*/

module.exports = sequelize;
module.exports = User;
module.exports=Post;
module.exports = router;

//Contractor.findAll({ include: [{model: Project, required: true}]})

/*exports.getStaticCompanies = function () {
    return Company.findAll({
        where: {
            id: [46128, 2865, 49569,  1488,   45600,   61991,  1418,  61919,   53326,   61680]
        }, 
        // Add order conditions here....
        order: [
            ['id', 'DESC'],
            ['name', 'ASC'],
        ],
        attributes: ['id', 'logo_version', 'logo_content_type', 'name', 'updated_at']
    });
};*/

router.delete('/:id',function(req,res,next){
	console.log("hi")
	Post.destroy({
		where:{
			id: req.params.id
		},include:[User]
	}).then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error); 
    });  
});
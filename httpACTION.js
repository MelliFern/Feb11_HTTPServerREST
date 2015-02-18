'use strict';

var http = require('http');
var fs = require ('fs');
var filepath = '../files/file_';


var action = exports = module.exports = {};
action.POST=function (req,res){
	var input = ''; 
	req.on('data',function(data){ input += data.toString('utf-8');}); 
	req.on('end',function(){
		var parsed = JSON.parse(input);
		// open file Async 
		var id = parsed.id; 
		if (id){
			var filename = filepath + id +'.json';
			chkFileExists(res,filename,200,'Over writing file', null, null); 

			fs.exists(filename,  function(exists){
				if (exists) createResponse(res,200,'\n Over writing file \n');									
			});
			fs.writeFile(filename,JSON.stringify(parsed),function(err){
				if(err) throw " POST - error while creating file  -> " +err; 
				else createResponse(res,200,'\n written json data to file\n');					
				}); 

		} else createResponse(res,200,'\n Invalid ID\nPlease add id to input JSON');
	}); //req.on end
} //POST end

action.PUT=function(req,res){

	var input =''; 
	req.on('data',function(data){ input += data.toString('utf-8');}); 
	req.on('end',function(){
		var parsed = JSON.parse(input);
		var id = parsed.id;  // get id from input; 
	if (id){
		var filename = filepath + id +'.json';
		chkFileExists(res, filename, 200,'Over writing file',200,'New file is created');
		fs.writeFile(filename, JSON.stringify(parsed),function(err){
				if(err) throw " PUT - error while appending the file  -> " +err; 
				else { createResponse(res,200,'\n Replacing json data in file\n');}
				}); 		 
	} else {
				createResponse(res,200,'Invalid ID \n\n Please add id to input JSON');			
			}
	});//req.on end
} ; //PUT end

action.PATCH=function(req,res){

	var input =''; 
	req.on('data',function(data){ input += data.toString('utf-8');}); 
	req.on('end',function(){
		var parsed = JSON.parse(input);
		var id = parsed.id;  // get id from input; 
		console.log('Patch - id'+ id +'   ');
	if (id){
		var filename = filepath + id +'.json';
		//if (chkFileExists(res, filename,200, 'Patching file '+ filename, 404, 'File does not exists')){
			// read json from file
			var fileObj; 
			fs.readFile(filename,'utf8', function(err,data){
				if (err) throw "PATCh - error   -> "+ err; 
				else {
					createResponse(res,200,'\n Append json data to file\n');
					fileObj = JSON.parse(data);
					// replace the value for the keys in PATCh input data and append if new key
				for(var key in parsed){
					 fileObj[key]= parsed[key];
				//	}					
				// clear the json file and write the json 
				fs.writeFile(filename, JSON.stringify(fileObj),function(err){
					if(err) throw " PUT - error while appending the file  -> " +err; 
					else { createResponse(res,200,'\n Append json data to file\n');}
					}); 
					}
				}
			});
			//}
					 		
	} else {
				createResponse(res,200,'Invalid ID \n\n Please add id to input JSON');			
			}
	});//req.on end
} ; //PUT end

action.DELETE=function(req,res){

	var input =''; 
	req.on('data',function(data){ input += data.toString('utf-8');}); 
	req.on('end',function(){
	var parsed = JSON.parse(input);
	var id = parsed.id;  // get id from input; 	
	if (id){
		var filename = filepath + id +'.json';
		fs.unlink(filename, function(err){
			if (err) throw "error while DELETE -> "+err; 
			else
			 createResponse(res,200, filename+' - File Deleted');				
		});
					 		
	} else {
				createResponse(res,200,'Invalid ID \n\n Please add id to input JSON');			
			}
	});//req.on end
} ; //PUT end

action.GET=function(req,res){
	var urlparts = req.url.split('/');
	var input =''; 
	req.on('data',function(data){ input += data.toString('utf-8');}); 
	req.on('end',function(){
	var id = urlparts[2]; 
	var filename = filepath + id +'.json';
	var fileObj; 
	fs.readFile(filename,'utf8', function(err,data){
		if (err) throw "GET - error   -> "+ err; 
		else {
			fileObj = JSON.parse(data);	
			console.dir(fileObj);
			createResponse(res,200, JSON.stringify(fileObj)); 		
			}
		});
	});//req.on end
} ; //GET end


function createResponse(res,msg_code,msg){
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.write('\n'+msg+'\n'); 
	res.end()
}

function chkFileExists(res,filename, msgCode,msg,msgAltCode ,altmsg){
	fs.exists(filename, function(exists){
				if (exists){
					createResponse(res,msgCode,'\n '+msg+' \n');					
					return true; 
				} 
				else if (msgAltCode != null && altmsg != null) {
					createResponse(res,msgAltCode,'\n '+altmsg+' \n');
					return false; 
				}
			});
}
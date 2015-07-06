var fs = require('fs'),
	_ = require('lodash');

function cssSelectorLimitWarning(files, options, callback){

	//allow a single file to be passed in.
	if(!Array.isArray(files)){
		files = [files];
	}

	if(arguments.length === 2){
		callback = options;
		options = {};
	}

	options = _.merge({
		limit: 4095
	}, options);

	var hasErrored = false,
		length = files.length,
		count = 0,
		results = [],
		eachCallback = function(err, result, index){
			if(err){
				callback(err);
				hasErrored = true;
			}
			
			if(!hasErrored){
				results[index] = result;
				count++;
				if(count === length){
					callback(null, results);
				}
			}
		};

	for(var i=0; i<length; i++){
		checkFile(files[i], i, options, eachCallback);
	}
}

function checkFile(filePath, index, options, callback){
	var result = {
			file: filePath,
			ok: true,
			selector: null,
			line: null,
			count: 0
		},
		isOverLimit = false;

	var analyse = function(file){
		try{
			var lineSplit = file.split(/\n|\r/);
			
			for(var i=0; i<lineSplit.length; i++){
				
				//if line has a selector
				var selectorMatch = lineSplit[i].match(/[^{]+{/g);
				
				if(selectorMatch){				
					for(var j=0; j<selectorMatch.length; j++){
						//split by comma to ensure we count comma-separated selectors
						var commaSplit = selectorMatch[j].split(',');
						
						result.count += commaSplit.length;
						
						if(result.count > options.limit){
							result.ok = false;
							
							if(!isOverLimit){
								result.selector = lineSplit[i];
								result.line = i+1;
							}
							isOverLimit = true;
						}
					}
				}
			}
			
			callback(null, result, index);
		}
		catch(err){
			callback(err);
		}
	};

	try{

		fs.exists(filePath, function(exists){
			if(exists){
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err, file){
					if(err){
						return callback(err);
					}
					analyse(file);
				});
			}
			//if file doesn't exist assume that we've been passed the file contents
			else{
				analyse(filePath);
			}
		});

	}
	catch(err){
		callback(err);
	}
}

module.exports = cssSelectorLimitWarning;
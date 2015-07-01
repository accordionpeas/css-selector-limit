var fs = require('fs'),
	_ = require('lodash');

function cssSelectorLimitWarning(files, options, callback){

	if(arguments.length === 2){
		callback = options;
		options = {};
	}

	options = _.merge({
		limit: 4095
	}, options);

	var length = files.length,
		count = 0,
		results = [],
		eachCallback = function(result, index){
			results[index] = result;
			count++;
			if(count === length){
				callback(results);
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

	fs.readFile(filePath, {encoding: 'utf-8'}, function(err, file){
		
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

		callback(result, index);

	});
}

module.exports = cssSelectorLimitWarning;
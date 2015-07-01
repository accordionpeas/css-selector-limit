var fs = require('fs'),
	expect = require('chai').expect,
	cssSelectorLimit = require('./index'),
	fileList = [
		__dirname + '/tests/file-0.css',
		__dirname + '/tests/file-1.css',
		__dirname + '/tests/file-2.css',
		__dirname + '/tests/file-3.css',
		__dirname + '/tests/file-4.css',
		__dirname + '/tests/file-5.css'
	];

describe('css selector limit warning', function(){

	it('returns an array of results in the same order as the array of files that it was given', function(done){

		cssSelectorLimit(fileList, function(results){
			try{
				expect(results[0].file).to.equal(__dirname + '/tests/file-0.css');
				expect(results[1].file).to.equal(__dirname + '/tests/file-1.css');
				expect(results[2].file).to.equal(__dirname + '/tests/file-2.css');
				expect(results[3].file).to.equal(__dirname + '/tests/file-3.css');
				expect(results[4].file).to.equal(__dirname + '/tests/file-4.css');
				expect(results[5].file).to.equal(__dirname + '/tests/file-5.css');

				done();
			}
			catch(err){
				done(err);
			}
		});

	});
	
	it('sets "ok" property to true if the file has less than or equal selectors to limit', function(done){

		cssSelectorLimit(fileList, function(results){
			try{
				expect(results[0].ok).to.equal(true);
				expect(results[1].ok).to.equal(true);
				expect(results[2].ok).to.equal(true);
				expect(results[3].ok).to.equal(true);

				done();
			}
			catch(err){
				done(err);
			}
		});

	});
	
	it('sets "ok" property to false if the file has more selectors than the limit', function(done){

		cssSelectorLimit(fileList, function(results){
			try{
				expect(results[4].ok).to.equal(false);
				expect(results[5].ok).to.equal(false);

				done();
			}
			catch(err){
				done(err);
			}
		});

	});
	
	it('sets "line" property to null if the file has less than or equal selectors to the limit', function(done){

		cssSelectorLimit(fileList, function(results){
			try{
				expect(results[0].line).to.equal(null);
				expect(results[1].line).to.equal(null);
				expect(results[2].line).to.equal(null);
				expect(results[3].line).to.equal(null);

				done();
			}
			catch(err){
				done(err);
			}
		});

	});
	
	it('sets "line" property to the line number of the first selector that went over the limit', function(done){

		cssSelectorLimit(fileList, function(results){
			try{
				expect(results[4].line).to.equal(16381);
				expect(results[5].line).to.equal(16381);

				done();
			}
			catch(err){
				done(err);
			}
		});

	});
	
	it('sets "selector" property to null if the file has less than or equal selectors to the limit', function(done){

		cssSelectorLimit(fileList, function(results){
			try{
				expect(results[0].line).to.equal(null);
				expect(results[1].line).to.equal(null);
				expect(results[2].line).to.equal(null);
				expect(results[3].line).to.equal(null);

				done();
			}
			catch(err){
				done(err);
			}
		});

	});
	
	it('sets "selector" property to the first selector that went over the limit', function(done){

		cssSelectorLimit(fileList, function(results){
			try{
				expect(results[4].selector).to.equal('.selector-4096{');
				expect(results[5].selector).to.equal('.selector-4096{');

				done();
			}
			catch(err){
				done(err);
			}
		});

	});
	
	it('sets "count" property to the number of selectors in the file', function(done){

		cssSelectorLimit(fileList, function(results){
			try{
				expect(results[0].count).to.equal(0);
				expect(results[1].count).to.equal(2);
				expect(results[2].count).to.equal(500);
				expect(results[3].count).to.equal(4095);
				expect(results[4].count).to.equal(4096);
				expect(results[5].count).to.equal(7000);

				done();
			}
			catch(err){
				done(err);
			}
		});

	});
	
	it('overwrites limit with given option', function(done){
		
		cssSelectorLimit(fileList, {limit: 4094}, function(results){
			try{
				expect(results[0].ok).to.equal(true);
				expect(results[1].ok).to.equal(true);
				expect(results[2].ok).to.equal(true);
				expect(results[3].ok).to.equal(false);
				expect(results[4].ok).to.equal(false);
				expect(results[5].ok).to.equal(false);

				done();
			}
			catch(err){
				done(err);
			}
		});
		
	});

});
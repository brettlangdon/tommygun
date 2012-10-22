var gauss = require('gauss');
var url_parse = require('url').parse;
var iniparser = require('iniparser');
var extend = require('xtend');
var http = require('http');
var fs = require('fs');
var async = require('async');
var argv = require('optimist')
    .usage('Usage: $0 [config] [config]...')
    .options('c', {
	    alias: 'concurrency',
	    default: 1,
	    describe: 'Number of Concurrent Clients to Use'
	})
    .options('n', {
	    alias: 'requests',
	    describe: 'Total Number Of Requests To Make'
	})
    .options('r', {
	    alias: 'random',
	    describe: 'Whether Or Not To Randomize The Url Order',
	    default: false,
	    boolean: true
	})
    .options('k', {
	    alias: 'keepalive',
	    describe: 'Whether Or Not To Enable Keep Alive Support',
	    boolean: true,
	    default: false,
	})
    .options('l', {
	    alias: 'log',
	    describe: 'Log File To Write All Request Data To',
	    string: true,
	})
    .options('s', {
	    alias: 'stats',
	    describe: 'Whether or Not Print Result Stats',
	    boolean: true,
	    default: true
	})
    .options('q', {
	    alias: 'quiet',
	    default: false,
	    describe: 'Whether Or Not To Silence stdout',
	    boolean: true,
	})
    .options('h', {
	    alias: 'help',
	    describe: 'Show This Help Text',
	    boolean: true
	})
    .demand(1)
    .argv;

if( argv.help ){
    require('optimist').showHelp();
    process.exit();
}

if( argv.quiet ){
    console.log = function(msg){};
}

if( argv.log ){
    argv.log = fs.openSync(argv.log, 'w');
}

var config = {
    urls: {},
};
var defaults = {
    num: 1,
    port: 80,
};

argv._.forEach(function(file){
	try{
	    ini = iniparser.parseSync(file);
	    for( var key in ini ){
		if( typeof(ini[key]) === 'object'){
		    var url = key;
		    if(url.substring(0, 4) !== 'http'){
			url = 'http://' + url;
		    }
		    parts = url_parse(url, true, true);
		    ini[key] = extend({}, defaults, ini[key], parts);
		} else{
		    config[key] = ini[key];
		    delete ini[key];
		}
	    }
	    config.urls = extend(config.urls, ini);
	}catch(e){
	    console.error('Could Not Process ' + file + ' ini File');
	    console.error(e.stack);
	    process.exit(1);
	}
    });

var results = [];
var results_length = 0;
var errors = [];
var errors_length = 0;
var urls = [];
for( var key in config.urls ){
    var url = config.urls[key];
    for( var i = 0; i < url.num; ++i ){
	urls.push(url);
    }
}

if( argv.random ){
    console.log('Randomizing Url List');
    var i = urls.length;
    if ( i == 0 ) return false;
    while ( --i ) {
	var j = Math.floor( Math.random() * ( i + 1 ) );
	var tempi = urls[i];
	var tempj = urls[j];
	urls[i] = tempj;
	urls[j] = tempi;
    }
}

if( !argv.requests ){
    argv.requests = urls.length;
}


var save_result = function(result){
    var url = result.url;
    results[url] = (results[url])?results[url]:[];
    results[url].push(result);
    results_length += 1;
    if( argv.log ){
	var tmp = [];
	for( var i in result ){
	    var val = parseInt(result[i]);
	    if( isNaN(val) ){
		tmp.push('"' + result[i] + '"');
	    } else{
		tmp.push(val);
	    }
	}
	fs.writeSync(argv.log, tmp.join() + '\r\n');
    }
};

var save_error = function(error){
    var url = error.url;
    errors[url] = (errors[url])?errors[url] : [];
    errors[url].push(error);
    errors_length += 1;
};


var run = function(options, done){
    var start = new Date().getTime();
    req = http.request(options, function(res){
	    var stop = new Date().getTime();
	    save_result({
		        ms: (stop - start),
			status: res.statusCode,
			url: options.href
			});
	    done();
	});
    req.on('error', function(err){
	    save_error({
		        error: err,
			url: options.href
			});
	    done();
	});
    if( options.data ){
	req.write(options.data);
    }
    req.setSocketKeepAlive(argv.keepalive);
    req.end();
};

console.log('Starting Up ' + argv.concurrency + ' Clients');
var queue = async.queue(run, argv.concurrency);

var percentiles = [.5, .6, .7, .8, .9, .95, .98, .99];
queue.drain = function(){
    var end_time = new Date().getTime();
    var elapsed = end_time - start_time;
    console.log('Finished');
    console.log('Elapsed Time (sec): ' + (elapsed/1000));
    console.log('Completed Requests: ' + results_length);
    console.log('Errors: ' + errors_length);
    var req_sec = results_length / (elapsed/1000);
    console.log('Requests per Second: ' + req_sec);

    if( argv.stats ){
	console.log('Processing Results');
	for( var url in results ){
	    if( typeof(results[url]) === 'function' ){
		continue;
	    }
	    console.log('Results For: ' + url);
	    console.log('\tTotal Requests: ' + results[url].length);
	    var ms_data = results[url].map( function(a){ return a.ms; } );
	    ms_data = ms_data.sort();
	    var ms_set = new gauss.Vector(ms_data);
	    var ms_total = ms_set.sum();
	    console.log('\tMean Time (ms): ' + ms_set.mean());
	    console.log('\tMin Time (ms): ' + ms_set.min());
	    console.log('\tMax Time (ms): ' + ms_set.max());
	    console.log('\tTotal Time (ms): ' + ms_total);
	    percentiles.forEach( function(percent){
		    console.log('\t' + (percent*100) + '% (ms): ' + ms_set.percentile(percent));
		});
	    var status_data = results[url].map( function(a){ return a.status; } );
	    var status_set = new gauss.Vector(status_data);
	    var status_dist = status_set.distribution();
	    console.log('\tStatus Code Distribution:');
	    for( var status in status_dist ){
		console.log('\t\t' + status + '\t' + status_dist[status]);
	    }
	}
	for( var url in errors){
	    if( typeof(errors[url]) == 'function' ){
		continue;
	    }
	    console.log('Errors For: ' + url);
	    console.log('\tErrors: ' + errors[url].length);
	    var code_errors = errors[url].map( function(a){ return a.error.code; });
	    var code_set = new gauss.Vector(code_errors);
	    var code_dist = code_set.distribution();
	    console.log('\tError Code Distribution:');
	    for( var code in code_dist ){
		console.log('\t\t' + code + '\t' + code_dist[code]);
	    }
	}

    }

    if( argv.log ){
	fs.closeSync(argv.log);
    }
    process.exit(0);
};

console.log('Queuing Up ' + argv.requests + ' Requests');
var offset = 0;
var start_time = new Date().getTime();
for( var i = 0; i < argv.requests; ++i ){
    if( offset >= urls.length ){
	offset = 0;
    }
    queue.push(urls[offset]);
    offset += 1;
}
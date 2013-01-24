# tommygun

HTTP Benchmarking Tool written in Node.JS.

## Installation
### NPM
```bash
npm install -g tommygun
```

### Git
```bash
git clone git://github.com/brettlangdon/tommygun.git
cd ./tommygun
npm install -g
```

## Configuration

Tommygun uses ini files to specify what urls and settings to test. Each section corresponds to the url to test and
each property corresponds to specific settings for that given url.

The options available for each url are the same as those available to `http.request` (http://nodejs.org/api/http.html#http_http_request_options_callback).

When using the configuration setting `headers` you *must* provide the value as a valid JSON string.

### Example
```ini
[localhost]
port = 8000
num = 5

[localhost/submit]
port = 8000
data = this is a test
headers = {"some": "values"}
method = post
num = 2

[www.google.com]

[www.github.com]
```

## Usage

### Get Help
```bash
tommygun --help
Usage: tommygun [config] [config]...

Options:
  -c, --concurrency  Number of Concurrent Clients to Use          [default: 1]
  -n, --requests     Total Number Of Requests To Make
  -r, --random       Whether Or Not To Randomize The Url Order    [boolean]  [default: false]
  -k, --keepalive    Whether Or Not To Enable Keep Alive Support  [boolean]  [default: false]
  -l, --log          Log File To Write All Request Data To        [string]
  -s, --stats        Whether or Not Print Result Stats            [boolean]  [default: true]
  -q, --quiet        Whether Or Not To Silence stdout             [boolean]  [default: false]
  -h, --help         Show This Help Text                          [boolean]
```

### Simple Usage
#### Config
```ini
[localhost]
port=8000
```
#### Benchmark
```bash
tommygun -c 10 -n 1000 config.ini
```

#### Results
```bash
Starting Up 10 Clients
Queuing Up 1000 Requests
Finished
Elapsed Time (sec): 0.233
Completed Requests: 1000
Errors: 0
Requests per Second: 4291.845493562231
Processing Results
Results For: http://localhost/
  Total Requests: 1000
	Mean Time (ms): 2.159
	Min Time (ms): 1
	Max Time (ms): 16
	Total Time (ms): 2159
	50% (ms): 2
	60% (ms): 2
	70% (ms): 2
	80% (ms): 3
	90% (ms): 4
	95% (ms): 6
	98% (ms): 8
	99% (ms): 10
	Status Code Distribution:
		200	514
		404	486
```

## Name

The name for tommygun came from a play off of the name for http://www.github.com/newsapps/beeswithmachineguns

## License

(The MIT License)

Copyright (c) 2012 Brett Langdon &lt;brett@blangdon.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
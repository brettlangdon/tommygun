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
each property corresponds to specific settings for that given url. If the property occurs outside of a section then
tommygun those settings are used by tommygun.

### Example
```ini
;this setting is used by tommygun globally
random = false

[localhost]
port = 8000
num = 5

[localhost/submit]
port = 8000
data = this is a test
method = post
num = 2

[www.google.com]

[www.github.com]
```

## Usage

### Get Help
```bash
tommygun --help
```

### Simple Usage
```bash
tommygun config.ini
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
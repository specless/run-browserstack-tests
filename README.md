run your test pages against browserstack first by installing to cli globally

```
npm install -g run-browserstack-tests
```
then create a config json file
```
{
    "username": "BROWSERSTACK_USERNAME",
    "key": "BROWSERSTACK_KEY",
    "test_path": "PATH_TO_HTML"
}
```
then simply point run-browserstack-tests to your config
```
run-browserstack-tests -c PATH_TO_CONFIG
```
the module will take care of getting to the html from there.

a full command has to have a query parameter passed to it. A perfect example is the following
```
run-browserstack-tests -c ~/Sites/config.json -q "~iphone"
```
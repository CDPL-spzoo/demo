# K6 Load Test

## Getting started

To run load test with K6 you need install K6 on your PC
[use this guide](https://k6.io/docs/get-started/installation/)

## Run test
To start test with default options run this CLI command from the root folder
```
k6 run  load_tests/k6-test.js
```
## Environment variables
Variables to change launch options:

| Variable      | Description                    | Default value | 
| ------------- | ---------------------          | ------------- |
| USERS         | Number of virtual users        | 1             |
| EXECTIME      | Time for script execution (sec)| 60            |
| OPENCLOSETIMEOUT| delay between order opening and order closing (milliseconds)| 1000|
| CONNECTIONRETRIES      | retries to connect to socket if failed| 1            |


To set ENV variables you need put every variable to CLI with -e flag:
```
k6 run -e USERS=15 -e CONNECTIONRETRIES=3 -e OPENCLOSETIMEOUT=2000 -e EXECTIME=90 load_tests/k6-test.js
```

To close all unclosed orders of user  run the script ones with REMOVEORDERS=true
and wait for script to be finished. Don't use this for load testing,
only for order removing otherwise the results will be inaccurate. 
``` 
k6 run --env REMOVEORDERS=true load_tests/k6-test.js
```
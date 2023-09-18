import requests
from time import sleep
for i in range(1):
    res = requests.get('http://localhost/api/token/verify/')
    print(res.status_code)

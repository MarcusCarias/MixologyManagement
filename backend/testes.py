import requests

headers = {

    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzg3NDc4NDA5MCIsImV4cCI6MTc2OTU1Mjk2MX0.iPR97dcyDO6vWuN1K6Co7EETuiDUXtVP7EhfdikwETI"

}

requisicao = requests.get("http://127.0.0.1:8000/auth/refresh", headers = headers)
print(requisicao)
print(requisicao.json)
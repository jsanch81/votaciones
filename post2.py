import requests
import json
url = 'http://localhost:8000/'
data1 = {'nombre':"jose",'cedula': 103765543,'id':"0x8543e1125FFe3054F52F93A1F41c78501a7E87cb",'voto':"elvotoencriptados"}
datafinal = json.dumps(data1);
r = requests.post(url ,data=datafinal)

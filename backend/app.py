import json, os
from EdgeGPT.EdgeUtils import Query, Cookie
from urllib.parse import urlparse, parse_qs
from flask import Flask, request
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS, cross_origin
import random

app = Flask(__name__)
CORS(app)

@cross_origin
@app.route('/api',methods = ["GET","POST"])
def api():

    if request.method == "POST":
        try:
            url = request.json["url"]
            url = url.split("http://127.0.0.1:5173/quiz?q=")[1]
            video_id = get_youtube_video_id(url)
            
            subtitles = ""
            result = YouTubeTranscriptApi.get_transcript(video_id, languages = ["en","en-IN"])
            for ele in result:
                subtitles = subtitles + ele["text"] + " "
                
            #print(subtitles)
            
            sublist = [[]]
            temp = subtitles.split(" ")
            count = 0
            for i in range(0,len(temp)):
                if count<100:
                    sublist[-1].append(temp[i])
                    count += 1
                else:
                    sublist.append([])
                    count = 0
                    sublist[-1].append(temp[i])
            #print(len(sublist))
            
            sub = " ".join(sublist[random.randint(0, len(sublist)-1)])
            
            prompt=f"Can you create 1 quiz question for following video transcript in following JSON format question:'' answer:'' options:['option 1','option 2','option 3','option 4'] ? {sub}"
            q = Query(
              prompt,
              style="precise",
              cookie_files=["./bing_cookies_1.json","./bing_cookies_2.json"]
            )
            #print(q)
            #print(q.output)
            #print(q.code)
            print(q.prompt)
            #print(q.code_blocks)
            json_data = json.loads(q.code_blocks[0])
            print(json_data)
            
            returndict = {}
            returndict["question"] = json_data["question"]
            returndict["option1"] = {"text":json_data["options"][0],"correct":json_data["options"][0]==json_data["answer"]}
            returndict["option2"] = {"text":json_data["options"][1],"correct":json_data["options"][1]==json_data["answer"]}
            returndict["option3"] = {"text":json_data["options"][2],"correct":json_data["options"][2]==json_data["answer"]}
            returndict["option4"] = {"text":json_data["options"][3],"correct":json_data["options"][3]==json_data["answer"]}
            
            return returndict

            return {}
        except:
            return {"data":"Failed"}
    

def get_youtube_video_id(url):
    query = urlparse(url)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            return parse_qs(query.query)['v'][0]
        if query.path.startswith('/embed/'):
            return query.path.split('/')[2]
    return None
    
app.run(debug=True)
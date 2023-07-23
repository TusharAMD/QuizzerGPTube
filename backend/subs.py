from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

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

# Example usage:
url = "http://127.0.0.1:5173/quiz?q=https://www.youtube.com/watch?v=66tKz279Bmw&t=250s"

url = url.split("http://127.0.0.1:5173/quiz?q=")[1]


video_id = get_youtube_video_id(url)
print(video_id)  # Output: "dQw4w9WgXcQ"

transcript_list = YouTubeTranscriptApi.list_transcripts("c4OyfL5o7DU")
subtitles = ""
result = YouTubeTranscriptApi.get_transcript("c4OyfL5o7DU")
for ele in result:
    subtitles = subtitles + ele["text"] + " "
print(subtitles)
print(len(subtitles.split()))
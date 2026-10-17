# Author: 31edgar

import yt_dlp
import os
import json

LINK_MANAGEMENT_PATH = "link_management"

file = os.path.join(LINK_MANAGEMENT_PATH, "yt_link_archive.txt")
json_file = os.path.join(LINK_MANAGEMENT_PATH, "videos.json")

def read_json():
    try:
        with open(json_file, 'r', encoding='utf8') as f:
            data = json.load(f)
        return data
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def read_links(txt_file):
    try:
        with open(txt_file, "r", encoding="utf-8") as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"File {txt_file} does not exist.")
        return []

def extract_metadata(url):
    ydl_opts = {
        'quiet': True,
        'skip_download': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        
        return {
            "title": info.get("title", ""),
            "author": info.get("uploader", ""),
            "duration": info.get("duration", ""),
            "embedId": info.get("id", ""),
            "categories": [],
            "description": info.get("description", "")[:200],  # Primeros 200 caracteres
            "thumbnail" : info.get("thumbnail", "")
        }

def save_json(json_file, data):
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Json file updated correctly.")

def main():
    videos = read_json()
    urls = read_links(file)

    for url in urls:
        metadata = extract_metadata(url)

        new_video = {
            "id": str(len(videos) + 1),
            "title": metadata["title"],
            "author": metadata["author"],
            "duration": metadata["duration"],
            "embedId": metadata["embedId"],
            "categories": metadata["categories"],
            "description": metadata["description"],
            "thumbnail": metadata["thumbnail"]
        }

        videos.append(new_video)

    save_json(json_file, videos)
    
    open(file, 'w').close()

if __name__ == "__main__":
    main()
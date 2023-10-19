# ZumoCat-backend - Created by sw1ndler

<br>

## Todo:
    - Add get request for images by tags
    - Add an option for amount of images from /latest    
<br>

## GET Routes

### /random
Get a random cat from the database

```json
{
    "title": "string",
    "description": "string",
    "tags": [
        "string"
    ],
    "image": "url",
}
```

### /latest
Return the latest 30 uploaded images

```json
{
    {
        "title": "string",
        "description": "string",
        "tags": [
            "string"
        ],
        "image": "url", 
    },
}
```

<br>

## Post Routes

### /upload
Upload an image to the server, example under /example/upload.js   
Tags should be in json

```json
{
    "headers": {
        "title": "string",
        "description": "string",
        "tags": ["string"],
    },
    "files": {
        "image": "image-data",
    }
}
```

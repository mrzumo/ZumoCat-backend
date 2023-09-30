# ZumoCat-backend - Created by sw1ndler

<br>

## Todo:
    - Clean up code (its all in main right now 💀)
    - Add get request for images by tags
    - Return a list of recently uploaded images

<br>

## GET Routes

### /random
Get a random cat from the database

```lua
{
    "title": "string",
    "description": "string",
    "tags": [
        "string"
    ],
    "image": "url",
}
```

<br>

## Post Routes

### /upload
Upload an image to the server, example under /example/upload.js

```lua
{
    headers: {
        "title": "string",
        "description": "string",
        "tags": ["string"], // json format
    },
    files: {
        "image": "image-data",
    }
}



```

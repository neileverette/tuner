Radio Paradise - Complete Integration Guide
Step 1: Get All 4 Station Stream URLs
Radio Paradise has 4 channels - here are the direct stream URLs:
FLAC Streams(Lossless - Highest Quality):
Main Mix: http://stream.radioparadise.com/flac
Mellow Mix: http://stream.radioparadise.com/mellow-flac
Rock Mix: http://stream.radioparadise.com/rock-flac
Global Mix: http://stream.radioparadise.com/global-flac
MP3 Streams(128kbps - Compatible):
Main Mix: http://stream.radioparadise.com/mp3-128
Mellow Mix: http://stream.radioparadise.com/mellow-128
Rock Mix: http://stream.radioparadise.com/rock-128
Global Mix: http://stream.radioparadise.com/global-128
AAC Streams(320kbps - High Quality):
Main Mix: http://stream.radioparadise.com/aac-320
Mellow Mix: http://stream.radioparadise.com/mellow-320
Rock Mix: http://stream.radioparadise.com/rock-320
Global Mix: http://stream.radioparadise.com/global-320

Step 2: API Endpoints for Each Channel
Get Now Playing + Metadata for Each Channel:
    javascript// Main Mix (chan=0)
https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=0

// Mellow Mix (chan=1)
https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=1

// Rock Mix (chan=2)
https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=2

// Global Mix (chan=3)
https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=3
Note: The API has CORS restrictions, so you may need to proxy requests if calling from a browser.

    Step 3: Complete Code to Get All Stations
JavaScript / Node.js Example:
javascriptconst stations = [
    {
        id: 'rp-main',
        name: 'Radio Paradise - Main Mix',
        description: 'Eclectic blend of rock, electronica, world music',
        chan: 0,
        streamUrl: {
            flac: 'http://stream.radioparadise.com/flac',
            mp3: 'http://stream.radioparadise.com/mp3-128',
            aac: 'http://stream.radioparadise.com/aac-320'
        },
        apiUrl: 'https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=0',
        logo: 'https://img.radioparadise.com/assets/rp-logo.png'
    },
    {
        id: 'rp-mellow',
        name: 'Radio Paradise - Mellow Mix',
        description: 'Downtempo, chill, ambient, acoustic',
        chan: 1,
        streamUrl: {
            flac: 'http://stream.radioparadise.com/mellow-flac',
            mp3: 'http://stream.radioparadise.com/mellow-128',
            aac: 'http://stream.radioparadise.com/mellow-320'
        },
        apiUrl: 'https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=1',
        logo: 'https://img.radioparadise.com/assets/rp-logo.png'
    },
    {
        id: 'rp-rock',
        name: 'Radio Paradise - Rock Mix',
        description: 'Rock-focused, classic to modern',
        chan: 2,
        streamUrl: {
            flac: 'http://stream.radioparadise.com/rock-flac',
            mp3: 'http://stream.radioparadise.com/rock-128',
            aac: 'http://stream.radioparadise.com/rock-320'
        },
        apiUrl: 'https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=2',
        logo: 'https://img.radioparadise.com/assets/rp-logo.png'
    },
    {
        id: 'rp-global',
        name: 'Radio Paradise - Global Mix',
        description: 'World music and international sounds',
        chan: 3,
        streamUrl: {
            flac: 'http://stream.radioparadise.com/global-flac',
            mp3: 'http://stream.radioparadise.com/global-128',
            aac: 'http://stream.radioparadise.com/global-320'
        },
        apiUrl: 'https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=3',
        logo: 'https://img.radioparadise.com/assets/rp-logo.png'
    }
];

// Function to get now playing for a specific channel
async function getNowPlaying(chanId) {
    const response = await fetch(
        `https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=${chanId}`
    );
    const data = await response.json();

    return {
        currentSong: data.song['0'],
        upcomingSongs: Object.values(data.song).slice(1),
        streamUrl: data.url,
        imageBase: data.image_base
    };
}

// Get now playing for all channels
async function getAllStationsData() {
    const stationsWithMetadata = await Promise.all(
        stations.map(async (station) => {
            try {
                const nowPlaying = await getNowPlaying(station.chan);
                return {
                    ...station,
                    nowPlaying: {
                        artist: nowPlaying.currentSong.artist,
                        title: nowPlaying.currentSong.title,
                        album: nowPlaying.currentSong.album,
                        coverArt: nowPlaying.imageBase + nowPlaying.currentSong.cover,
                        duration: nowPlaying.currentSong.duration
                    }
                };
            } catch (error) {
                console.error(`Error fetching data for ${station.name}:`, error);
                return station;
            }
        })
    );

    return stationsWithMetadata;
}

// Usage
getAllStationsData().then(data => {
    console.log(JSON.stringify(data, null, 2));
});

Step 4: Simple JSON Structure for Your Project
json{
    "stations": [
        {
            "id": "rp-main",
            "name": "Radio Paradise - Main Mix",
            "description": "Eclectic blend of rock, electronica, world music",
            "streamUrl": "http://stream.radioparadise.com/flac",
            "apiUrl": "https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=0",
            "genre": "Eclectic",
            "quality": "FLAC",
            "homepage": "https://radioparadise.com"
        },
        {
            "id": "rp-mellow",
            "name": "Radio Paradise - Mellow Mix",
            "description": "Downtempo, chill, ambient, acoustic",
            "streamUrl": "http://stream.radioparadise.com/mellow-flac",
            "apiUrl": "https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=1",
            "genre": "Ambient/Chill",
            "quality": "FLAC",
            "homepage": "https://radioparadise.com"
        },
        {
            "id": "rp-rock",
            "name": "Radio Paradise - Rock Mix",
            "description": "Rock-focused, classic to modern",
            "streamUrl": "http://stream.radioparadise.com/rock-flac",
            "apiUrl": "https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=2",
            "genre": "Rock",
            "quality": "FLAC",
            "homepage": "https://radioparadise.com"
        },
        {
            "id": "rp-global",
            "name": "Radio Paradise - Global Mix",
            "description": "World music and international sounds",
            "streamUrl": "http://stream.radioparadise.com/global-flac",
            "apiUrl": "https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=3",
            "genre": "World",
            "quality": "FLAC",
            "homepage": "https://radioparadise.com"
        }
    ]
}

Step 5: Important Notes
CORS Issues:
The API doesn't allow Cross-Origin requests from browsers. Solutions:

Proxy the API calls through your backend
Use a CORS proxy(for development only)
Call API from server - side code

Bitrate Options:
Change the bitrate parameter based on your needs:

bitrate = 0 → 128k MP3(most compatible)
bitrate = 1 → 192k AAC(good balance)
bitrate = 2 → 320k AAC(high quality)
bitrate = 4 → FLAC(lossless, large files)

Polling Frequency:

Don't poll the API more than once every 30 seconds
Songs typically last 3 - 5 minutes
Use the length field in the response to know when to update


Quick Start(Minimal):
If you just need the basics to add to your project right now:
javascriptconst radioParadiseStations = [
    {
        name: "Radio Paradise - Main Mix",
        url: "http://stream.radioparadise.com/flac",
        api: "https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=0"
    },
    {
        name: "Radio Paradise - Mellow Mix",
        url: "http://stream.radioparadise.com/mellow-flac",
        api: "https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=1"
    },
    {
        name: "Radio Paradise - Rock Mix",
        url: "http://stream.radioparadise.com/rock-flac",
        api: "https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=2"
    },
    {
        name: "Radio Paradise - Global Mix",
        url: "http://stream.radioparadise.com/global-flac",
        api: "https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=3"
    }
];
That's it! You now have 4 high-quality, curated radio stations with full API access for your project. 🎵
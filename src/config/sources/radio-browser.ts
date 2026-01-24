/**
 * Radio Browser channel-to-genre mappings and channel definitions.
 * 40 curated internet radio stations from Radio Browser API.
 * Excludes existing sources (SomaFM, Radio Paradise, NTS, KEXP).
 */

import type { SourceConfig, ChannelDefinition } from '../types.js';

const channelDefinitions: readonly ChannelDefinition[] = [
  {
    id: 'rb-airport-lounge',
    title: 'AIRPORT LOUNGE RADIO',
    description: 'Ambient, chill, chillout, and lounge music',
    dj: null,
    image: {
      small: 'https://favicon-generator.org/favicon-generator/htdocs/favicons/2023-12-16/9274e8a4803971186ff5c45359ab77a4.ico.png',
      medium: 'https://favicon-generator.org/favicon-generator/htdocs/favicons/2023-12-16/9274e8a4803971186ff5c45359ab77a4.ico.png',
      large: 'https://favicon-generator.org/favicon-generator/htdocs/favicons/2023-12-16/9274e8a4803971186ff5c45359ab77a4.ico.png',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://az1.mediacp.eu/listen/airport-lounge-radio/radio.mp3' },
    ],
    homepage: 'https://radiosuitenetwork.torontocast.stream/airport-lounge-radio/',
  },
  {
    id: 'rb-abc-lounge',
    title: 'ABC Lounge Radio',
    description: 'Ambient, chillout, easy listening, lounge, smooth jazz',
    dj: null,
    image: {
      small: 'https://www.abc-lounge.com/favicon.ico',
      medium: 'https://www.abc-lounge.com/favicon.ico',
      large: 'https://www.abc-lounge.com/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://eu1.fastcast4u.com/proxy/kpmxz?mp=/1' },
    ],
    homepage: 'https://www.abc-lounge.com/radio/lounge-jazz-folk/#home',
  },
  {
    id: 'rb-ambient-modern',
    title: 'Ambient Modern',
    description: 'Ambient, chillout, non-commercial relaxation music',
    dj: null,
    image: {
      small: 'https://ambientmodern.com/wp-content/uploads/2020/05/cropped-ambient-modern-3000-180x180.png',
      medium: 'https://ambientmodern.com/wp-content/uploads/2020/05/cropped-ambient-modern-3000-180x180.png',
      large: 'https://ambientmodern.com/wp-content/uploads/2020/05/cropped-ambient-modern-3000-180x180.png',
    },
    streams: [
      { quality: 'high', format: 'mp3', bitrate: 256, url: 'http://radio.stereoscenic.com/mod-h' },
    ],
    homepage: 'https://ambientmodern.com/',
  },
  {
    id: 'rb-cryosleep',
    title: 'Cryosleep',
    description: 'Ambient, calm music, no beat, sleep, space',
    dj: null,
    image: {
      small: 'http://www.echoesofbluemars.org/images/favicon.ico',
      medium: 'http://www.echoesofbluemars.org/images/favicon.ico',
      large: 'http://www.echoesofbluemars.org/images/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'http://streams.echoesofbluemars.org:8000/cryosleep' },
    ],
    homepage: 'http://www.echoesofbluemars.org/cryosleep.php',
  },
  {
    id: 'rb-chill-lounge-florida',
    title: 'Chill Lounge Florida',
    description: 'Ambient, chill, chillout, lounge',
    dj: null,
    image: {
      small: 'https://vip2.fastcast4u.com/favicon.ico',
      medium: 'https://vip2.fastcast4u.com/favicon.ico',
      large: 'https://vip2.fastcast4u.com/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://vip2.fastcast4u.com/proxy/chillfla?mp=/1' },
    ],
    homepage: 'https://vip2.fastcast4u.com/proxy/chillfla?mp=/1',
  },
  {
    id: 'rb-acid-jazz',
    title: '100% ACID JAZZ',
    description: 'Acid jazz, ambient, instrumental, nu-jazz, smooth jazz',
    dj: null,
    image: {
      small: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2024-10-25/f83dbfeda4fbcf3399eb5afd0949c4b1.ico.png',
      medium: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2024-10-25/f83dbfeda4fbcf3399eb5afd0949c4b1.ico.png',
      large: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2024-10-25/f83dbfeda4fbcf3399eb5afd0949c4b1.ico.png',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://mpc1.mediacp.eu:8356/stream' },
    ],
    homepage: 'https://radiosuitenetwork.torontocast.stream/100-acid-jazz/',
  },
  {
    id: 'rb-sensual-lounge',
    title: 'SENSUAL LOUNGE RADIO',
    description: 'Ambient lounge, chillout, jazz lounge, smooth jazz',
    dj: null,
    image: {
      small: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2025-02-16/253ad4a8eaed27bf80efa9d428914089.ico.png',
      medium: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2025-02-16/253ad4a8eaed27bf80efa9d428914089.ico.png',
      large: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2025-02-16/253ad4a8eaed27bf80efa9d428914089.ico.png',
    },
    streams: [
      { quality: 'high', format: 'mp3', bitrate: 320, url: 'https://kathy.torontocast.com:3590/;?type=http&nocache=1739707069' },
    ],
    homepage: 'https://radiosuitenetwork.torontocast.stream/sensual-lounge',
  },
  {
    id: 'rb-vanilla-deep',
    title: 'Vanilla Radio Deep Flavors',
    description: 'Deep ambient, deep house, house',
    dj: null,
    image: {
      small: 'https://vanillaradio.com/favicon.ico',
      medium: 'https://vanillaradio.com/favicon.ico',
      large: 'https://vanillaradio.com/favicon.ico',
    },
    streams: [
      { quality: 'high', format: 'mp3', bitrate: 320, url: 'https://stream.vanillaradio.com:8090/live' },
    ],
    homepage: 'https://vanillaradio.com/',
  },
  {
    id: 'rb-spokoinoe',
    title: 'Спокойное радио',
    description: 'Ambient, chillout, easy listening, jazz, lounge',
    dj: null,
    image: {
      small: 'https://i.1.creatium.io/5f/9c/2c/4e16165627237138cbc3273f76782d56f9/196x196/favicon.png',
      medium: 'https://i.1.creatium.io/5f/9c/2c/4e16165627237138cbc3273f76782d56f9/196x196/favicon.png',
      large: 'https://i.1.creatium.io/5f/9c/2c/4e16165627237138cbc3273f76782d56f9/196x196/favicon.png',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://listen9.myradio24.com/6262' },
    ],
    homepage: 'http://spokoinoeradio.ru/',
  },
  {
    id: 'rb-rautemusik-lounge',
    title: '__LOUNGE__ by rautemusik',
    description: 'Ambient, chill, chillout, lounge music',
    dj: null,
    image: {
      small: 'https://www.rm.fm/favicon.ico',
      medium: 'https://www.rm.fm/favicon.ico',
      large: 'https://www.rm.fm/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 192, url: 'https://lounge-high.rautemusik.fm/?ref=radiobrowser' },
    ],
    homepage: 'https://www.rm.fm/lounge',
  },
  {
    id: 'rb-deep-in-space',
    title: 'DEEP IN SPACE',
    description: 'Ambient, chillout, deep space, space music',
    dj: null,
    image: {
      small: 'https://deepinspace.ru/wp-content/uploads/2024/12/logo500.jpg',
      medium: 'https://deepinspace.ru/wp-content/uploads/2024/12/logo500.jpg',
      large: 'https://deepinspace.ru/wp-content/uploads/2024/12/logo500.jpg',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.drugradio.ru:8020/stream128' },
    ],
    homepage: 'https://deepinspace.ru/',
  },
  {
    id: 'rb-nature-rain',
    title: 'Nature Radio Rain',
    description: 'Ambient and relaxation music, nature sounds',
    dj: null,
    image: {
      small: 'https://radiosuitenetwork.torontocast.stream/favicon.ico',
      medium: 'https://radiosuitenetwork.torontocast.stream/favicon.ico',
      large: 'https://radiosuitenetwork.torontocast.stream/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://maggie.torontocast.com:2020/stream/natureradiorain' },
    ],
    homepage: 'https://radiosuitenetwork.torontocast.stream/nature-radio-rain/',
  },
  {
    id: 'rb-0n-chillout',
    title: '0 N - Chillout on Radio',
    description: 'Ambient, chillout, easy listening, electro',
    dj: null,
    image: {
      small: 'https://www.0nradio.com/logos/0n-chillout_600x600.jpg',
      medium: 'https://www.0nradio.com/logos/0n-chillout_600x600.jpg',
      large: 'https://www.0nradio.com/logos/0n-chillout_600x600.jpg',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://0n-chillout.radionetz.de/0n-chillout.mp3' },
    ],
    homepage: 'http://www.0nradio.com/',
  },
  {
    id: 'rb-deep-radio',
    title: 'Deep Radio',
    description: 'Ambient, deep house, downtempo, nu-jazz, progressive',
    dj: null,
    image: {
      small: 'https://deep.radio/favicon.ico',
      medium: 'https://deep.radio/favicon.ico',
      large: 'https://deep.radio/favicon.ico',
    },
    streams: [
      { quality: 'high', format: 'mp3', bitrate: 320, url: 'http://stream.deep.radio/hd' },
    ],
    homepage: 'https://deep.radio/',
  },
  {
    id: 'rb-record-ambient',
    title: 'Radio Record Ambient',
    description: 'Ambient electronic music',
    dj: null,
    image: {
      small: 'https://cdn-profiles.tunein.com/s309967/images/logod.jpg',
      medium: 'https://cdn-profiles.tunein.com/s309967/images/logod.jpg',
      large: 'https://cdn-profiles.tunein.com/s309967/images/logod.jpg',
    },
    streams: [
      { quality: 'medium', format: 'aac', bitrate: 96, url: 'http://radiorecord.hostingradio.ru/ambient96.aacp' },
    ],
    homepage: 'https://radiorecord.ru/',
  },
  {
    id: 'rb-0n-lounge',
    title: '0 N - Lounge on Radio',
    description: 'Ambient, chillout, easy listening, lounge',
    dj: null,
    image: {
      small: 'https://www.0nradio.com/logos/0n-lounge_600x600.jpg',
      medium: 'https://www.0nradio.com/logos/0n-lounge_600x600.jpg',
      large: 'https://www.0nradio.com/logos/0n-lounge_600x600.jpg',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://0n-lounge.radionetz.de/0n-lounge.mp3' },
    ],
    homepage: 'http://www.0nradio.com/',
  },
  {
    id: 'rb-rain-songs',
    title: '雨声轻音乐',
    description: 'Ambient, instrumental, relax',
    dj: null,
    image: {
      small: 'https://zeno.fm/favicon.ico',
      medium: 'https://zeno.fm/favicon.ico',
      large: 'https://zeno.fm/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.zeno.fm/689zc32y4x8uv' },
    ],
    homepage: 'https://zeno.fm/radio/rain-songs/',
  },
  {
    id: 'rb-covers-lounge',
    title: '100% COVERS LOUNGE',
    description: 'Ambient, bossa nova, chillout lounge, deep house, jazz',
    dj: null,
    image: {
      small: 'https://radiosuitenetwork.torontocast.stream/favicon.ico',
      medium: 'https://radiosuitenetwork.torontocast.stream/favicon.ico',
      large: 'https://radiosuitenetwork.torontocast.stream/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://az1.mediacp.eu/listen/100coverslounge/radio.mp3' },
    ],
    homepage: 'https://radiosuitenetwork.torontocast.stream/100-covers-lounge/',
  },
  {
    id: 'rb-1a-relax',
    title: '1 A - Relax von 1A Radio',
    description: 'Ambient, chillout, easy listening, electro',
    dj: null,
    image: {
      small: 'https://www.1aradio.com/logos/1a-relax_600x600.jpg',
      medium: 'https://www.1aradio.com/logos/1a-relax_600x600.jpg',
      large: 'https://www.1aradio.com/logos/1a-relax_600x600.jpg',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://1a-relax.radionetz.de/1a-relax.mp3' },
    ],
    homepage: 'http://www.1aradio.com/',
  },
  {
    id: 'rb-fluid-radio',
    title: 'Fluid Radio',
    description: 'Abstract, acoustic, ambient, experimental, instrumental',
    dj: null,
    image: {
      small: 'http://www.fluid-radio.co.uk/favicon.ico',
      medium: 'http://www.fluid-radio.co.uk/favicon.ico',
      large: 'http://www.fluid-radio.co.uk/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'http://uk4-vn.webcast-server.net:9270/' },
    ],
    homepage: 'http://www.fluid-radio.co.uk/',
  },
  {
    id: 'rb-total-instrumental',
    title: 'Total instrumental',
    description: 'Ambient, dance, electronic, instrumental',
    dj: null,
    image: {
      small: 'http://www.radio-total-instrumental.de/favicon.ico',
      medium: 'http://www.radio-total-instrumental.de/favicon.ico',
      large: 'http://www.radio-total-instrumental.de/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'http://stream.laut.fm/total-instrumental' },
    ],
    homepage: 'http://www.radio-total-instrumental.de/',
  },
  {
    id: 'rb-epic-classical-sleep',
    title: 'EPIC CLASSICAL - Classical Music For Sleep',
    description: 'Ambient and relaxation music, chillout, classical',
    dj: null,
    image: {
      small: 'https://epic-classical.com/favicon.ico',
      medium: 'https://epic-classical.com/favicon.ico',
      large: 'https://epic-classical.com/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 192, url: 'https://stream.epic-classical.com/classical-music-for-sleep' },
    ],
    homepage: 'https://epic-classical.com/',
  },
  {
    id: 'rb-am-ambient',
    title: 'a.m. ambient',
    description: 'Ambient, chillout, relax',
    dj: null,
    image: {
      small: 'https://d3rt1990lpmkn.cloudfront.net/640/0634887695e4eae902001f7a0043fabf315ca85137b2bc48b0f7bc471027db292203d32bf423475d5d684fa192549c8167a024502282748d7082779ba7e53d4d6ea32ef5b8b2ab1dccd5c8d6b75db291',
      medium: 'https://d3rt1990lpmkn.cloudfront.net/640/0634887695e4eae902001f7a0043fabf315ca85137b2bc48b0f7bc471027db292203d32bf423475d5d684fa192549c8167a024502282748d7082779ba7e53d4d6ea32ef5b8b2ab1dccd5c8d6b75db291',
      large: 'https://d3rt1990lpmkn.cloudfront.net/640/0634887695e4eae902001f7a0043fabf315ca85137b2bc48b0f7bc471027db292203d32bf423475d5d684fa192549c8167a024502282748d7082779ba7e53d4d6ea32ef5b8b2ab1dccd5c8d6b75db291',
    },
    streams: [
      { quality: 'high', format: 'mp3', bitrate: 256, url: 'http://radio.stereoscenic.com/ama-h' },
    ],
    homepage: 'https://amambient.com/',
  },
  {
    id: 'rb-nature-sleep',
    title: 'NATURE RADIO SLEEP',
    description: 'Ambient, nature sounds, meditation, relaxation',
    dj: null,
    image: {
      small: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2025-03-01/fb714c8d8238b02673a9ee2b018528af.ico.png',
      medium: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2025-03-01/fb714c8d8238b02673a9ee2b018528af.ico.png',
      large: 'https://d1ujqdpfgkvqfi.cloudfront.net/favicon-generator/htdocs/favicons/2025-03-01/fb714c8d8238b02673a9ee2b018528af.ico.png',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://az1.mediacp.eu/listen/natureradiosleep/radio.mp3' },
    ],
    homepage: 'https://natureradiosleep.weebly.com/',
  },
  {
    id: 'rb-groove-wave-lounge',
    title: 'Groove Wave Lounge',
    description: 'Ambient lounge, jazz lounge, lounge',
    dj: null,
    image: {
      small: 'https://www.groovewave.com/favicon.ico',
      medium: 'https://www.groovewave.com/favicon.ico',
      large: 'https://www.groovewave.com/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stm1.srvif.com:7576/;' },
    ],
    homepage: 'https://www.groovewave.com/lounge/lounge.htm',
  },
  {
    id: 'rb-7rays',
    title: '7 Rays Radio',
    description: 'Ambient, chillout, deep space, healing, meditation',
    dj: null,
    image: {
      small: 'https://7promeniv.com.ua/images/Seven_Rays_Mix/7RaysRadioLogoNew.jpg',
      medium: 'https://7promeniv.com.ua/images/Seven_Rays_Mix/7RaysRadioLogoNew.jpg',
      large: 'https://7promeniv.com.ua/images/Seven_Rays_Mix/7RaysRadioLogoNew.jpg',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://7rays.stream.laut.fm/7rays' },
    ],
    homepage: 'https://7promeniv.com.ua/radio',
  },
  {
    id: 'rb-mynoise-nature',
    title: 'MyNoise Pure Nature',
    description: 'Ambient and relaxation music, nature',
    dj: null,
    image: {
      small: 'https://mynoise.net/apple-touch-icon.png',
      medium: 'https://mynoise.net/apple-touch-icon.png',
      large: 'https://mynoise.net/apple-touch-icon.png',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 160, url: 'https://purenature-mynoise.radioca.st/stream' },
    ],
    homepage: 'https://mynoise.net/',
  },
  {
    id: 'rb-erotica-lounge',
    title: 'EROTICA LOUNGE',
    description: 'Ambient, chillout lounge, jazz fusion, nu jazz',
    dj: null,
    image: {
      small: 'https://tunein.com/favicon.ico',
      medium: 'https://tunein.com/favicon.ico',
      large: 'https://tunein.com/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.zeno.fm/89asra0sfa0uv' },
    ],
    homepage: 'https://tunein.com/radio/EROTICA-LOUNGE-s260655/',
  },
  {
    id: 'rb-dark-jazz',
    title: 'Radio Caprice - Dark Jazz',
    description: 'Ambient jazz, dark, doom, funeral, noir',
    dj: null,
    image: {
      small: 'http://radcap.ru/favicon.ico',
      medium: 'http://radcap.ru/favicon.ico',
      large: 'http://radcap.ru/favicon.ico',
    },
    streams: [
      { quality: 'high', format: 'aac', bitrate: 320, url: 'http://79.120.39.202:9137/' },
    ],
    homepage: 'http://radcap.ru/darkjazz.html',
  },
  {
    id: 'rb-cafe-del-mar',
    title: 'Café del Mar CALM',
    description: 'Ambient, chillout, electronic, Ibiza',
    dj: null,
    image: {
      small: 'https://cafedelmar.com/favicon.ico',
      medium: 'https://cafedelmar.com/favicon.ico',
      large: 'https://cafedelmar.com/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'aac', bitrate: 192, url: 'https://streamer.radio.co/sb748f24ad/listen' },
    ],
    homepage: 'https://cafedelmar.com/radio',
  },
  {
    id: 'rb-dinamo-sleep',
    title: 'dinamo.fm sleep',
    description: 'Ambient, chillout, lullaby, relaxing, sleep, zen',
    dj: null,
    image: {
      small: 'http://www.dinamo.fm/favicon.ico',
      medium: 'http://www.dinamo.fm/favicon.ico',
      large: 'http://www.dinamo.fm/favicon.ico',
    },
    streams: [
      { quality: 'high', format: 'mp3', bitrate: 320, url: 'http://channels.dinamo.fm/sleep-mp3' },
    ],
    homepage: 'http://www.dinamo.fm/',
  },
  {
    id: 'rb-positively-stress',
    title: 'Positively Stress Relief',
    description: 'Ambient stress relief music',
    dj: null,
    image: {
      small: 'https://streaming.positivity.radio/favicon.ico',
      medium: 'https://streaming.positivity.radio/favicon.ico',
      large: 'https://streaming.positivity.radio/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://nl4.mystreaming.net/pr/stressrelief/icecast.audio' },
    ],
    homepage: 'https://streaming.positivity.radio/pr/stressrelief/icecast.audio',
  },
  {
    id: 'rb-rautemusik-techno',
    title: '__TECHNO__ by rautemusik.fm',
    description: 'Ambient techno, deep techno, dub techno, minimal techno',
    dj: null,
    image: {
      small: 'https://www.rm.fm/favicon.ico',
      medium: 'https://www.rm.fm/favicon.ico',
      large: 'https://www.rm.fm/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 192, url: 'https://streams.rautemusik.fm/techno/mp3-192/?ref=radiobrowser' },
    ],
    homepage: 'https://rm.fm/techno',
  },
  {
    id: 'rb-dark-ambient',
    title: 'Dark Ambient Radio',
    description: 'Ambient, dark, deep ambient',
    dj: null,
    image: {
      small: 'http://www.darkambientradio.de/favicon.ico',
      medium: 'http://www.darkambientradio.de/favicon.ico',
      large: 'http://www.darkambientradio.de/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 192, url: 'http://s3.viastreaming.net:8835/' },
    ],
    homepage: 'http://www.darkambientradio.de/news.php',
  },
  {
    id: 'rb-radio-nature',
    title: 'Radio Nature',
    description: 'Ambient, chill, meditation, nature, relax, zen',
    dj: null,
    image: {
      small: 'http://radionature.weebly.com/favicon.ico',
      medium: 'http://radionature.weebly.com/favicon.ico',
      large: 'http://radionature.weebly.com/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.zeno.fm/3ac97ysh6f0uv.aac' },
    ],
    homepage: 'http://radionature.weebly.com/',
  },
  {
    id: 'rb-werave-study',
    title: 'WeRave Music Radio 02 - Study and Chillout',
    description: 'Ambient, chill house, chillout, deep house, melodic house',
    dj: null,
    image: {
      small: 'https://werave.com.br/favicon.ico',
      medium: 'https://werave.com.br/favicon.ico',
      large: 'https://werave.com.br/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.zeno.fm/cpnv07rjvp0vv' },
    ],
    homepage: 'https://werave.com.br/en',
  },
  {
    id: 'rb-dimensione-relax',
    title: 'RADIO DIMENSIONE RELAX',
    description: 'Ambient lounge, chillout lounge, deep ambient, jazz, smooth jazz',
    dj: null,
    image: {
      small: 'https://rdastation.it/favicon.ico',
      medium: 'https://rdastation.it/favicon.ico',
      large: 'https://rdastation.it/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://az1.mediacp.eu/listen/radiodimensionerelax/radio.mp3' },
    ],
    homepage: 'https://rdastation.it/',
  },
  {
    id: 'rb-schizoid-chill',
    title: 'Radio Schizoid - Chillout/Ambient',
    description: 'Ambient, chillout',
    dj: null,
    image: {
      small: 'http://schizoid.in/favicon.ico',
      medium: 'http://schizoid.in/favicon.ico',
      large: 'http://schizoid.in/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'http://94.130.113.214:8000/chill' },
    ],
    homepage: 'http://schizoid.in/',
  },
  {
    id: 'rb-ambientradio',
    title: 'AmbientRadio (MRG.fm)',
    description: 'Ambient, dark ambient, deep ambient, downtempo, drone, meditation',
    dj: null,
    image: {
      small: 'https://www.mrg.fm/favicon.ico',
      medium: 'https://www.mrg.fm/favicon.ico',
      large: 'https://www.mrg.fm/favicon.ico',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'http://listen.mrg.fm:8888/stream' },
    ],
    homepage: 'https://www.mrg.fm/',
  },
  {
    id: 'rb-mynoise-ocean',
    title: 'MyNoise Ocean Waves',
    description: 'Ambient and relaxation music, nature',
    dj: null,
    image: {
      small: 'https://mynoise.net/apple-touch-icon.png',
      medium: 'https://mynoise.net/apple-touch-icon.png',
      large: 'https://mynoise.net/apple-touch-icon.png',
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 160, url: 'http://oceanwaves.radio.mynoise.net/' },
    ],
    homepage: 'https://mynoise.net/',
  },
];

export const RADIO_BROWSER_CONFIG: SourceConfig = {
  id: 'radio-browser',
  name: 'Radio Browser',
  homepage: 'https://www.radio-browser.info/',
  channels: [
    // Ambient (20 channels)
    { channelId: 'rb-ambient-modern', primaryGenre: 'ambient' },
    { channelId: 'rb-cryosleep', primaryGenre: 'ambient' },
    { channelId: 'rb-deep-in-space', primaryGenre: 'ambient' },
    { channelId: 'rb-nature-rain', primaryGenre: 'ambient' },
    { channelId: 'rb-0n-chillout', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
    { channelId: 'rb-record-ambient', primaryGenre: 'ambient' },
    { channelId: 'rb-rain-songs', primaryGenre: 'ambient' },
    { channelId: 'rb-1a-relax', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
    { channelId: 'rb-fluid-radio', primaryGenre: 'ambient' },
    { channelId: 'rb-epic-classical-sleep', primaryGenre: 'ambient' },
    { channelId: 'rb-am-ambient', primaryGenre: 'ambient' },
    { channelId: 'rb-nature-sleep', primaryGenre: 'ambient' },
    { channelId: 'rb-7rays', primaryGenre: 'ambient' },
    { channelId: 'rb-mynoise-nature', primaryGenre: 'ambient' },
    { channelId: 'rb-cafe-del-mar', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
    { channelId: 'rb-dinamo-sleep', primaryGenre: 'ambient' },
    { channelId: 'rb-positively-stress', primaryGenre: 'ambient' },
    { channelId: 'rb-dark-ambient', primaryGenre: 'ambient' },
    { channelId: 'rb-radio-nature', primaryGenre: 'ambient' },
    { channelId: 'rb-ambientradio', primaryGenre: 'ambient' },
    { channelId: 'rb-mynoise-ocean', primaryGenre: 'ambient' },
    { channelId: 'rb-schizoid-chill', primaryGenre: 'ambient' },

    // Lounge (10 channels)
    { channelId: 'rb-airport-lounge', primaryGenre: 'lounge', secondaryGenres: ['ambient'] },
    { channelId: 'rb-abc-lounge', primaryGenre: 'lounge', secondaryGenres: ['jazz-soul'] },
    { channelId: 'rb-chill-lounge-florida', primaryGenre: 'lounge', secondaryGenres: ['ambient'] },
    { channelId: 'rb-sensual-lounge', primaryGenre: 'lounge', secondaryGenres: ['jazz-soul'] },
    { channelId: 'rb-rautemusik-lounge', primaryGenre: 'lounge', secondaryGenres: ['ambient'] },
    { channelId: 'rb-0n-lounge', primaryGenre: 'lounge', secondaryGenres: ['ambient'] },
    { channelId: 'rb-covers-lounge', primaryGenre: 'lounge', secondaryGenres: ['jazz-soul'] },
    { channelId: 'rb-groove-wave-lounge', primaryGenre: 'lounge', secondaryGenres: ['jazz-soul'] },
    { channelId: 'rb-erotica-lounge', primaryGenre: 'lounge', secondaryGenres: ['jazz-soul'] },
    { channelId: 'rb-dimensione-relax', primaryGenre: 'lounge', secondaryGenres: ['jazz-soul'] },

    // Electronic (5 channels)
    { channelId: 'rb-vanilla-deep', primaryGenre: 'electronic', secondaryGenres: ['ambient'] },
    { channelId: 'rb-deep-radio', primaryGenre: 'electronic', secondaryGenres: ['ambient'] },
    { channelId: 'rb-total-instrumental', primaryGenre: 'electronic' },
    { channelId: 'rb-rautemusik-techno', primaryGenre: 'electronic' },
    { channelId: 'rb-werave-study', primaryGenre: 'electronic', secondaryGenres: ['ambient'] },

    // Jazz & Soul (3 channels)
    { channelId: 'rb-acid-jazz', primaryGenre: 'jazz-soul' },
    { channelId: 'rb-dark-jazz', primaryGenre: 'jazz-soul', secondaryGenres: ['ambient'] },
    { channelId: 'rb-spokoinoe', primaryGenre: 'jazz-soul', secondaryGenres: ['lounge'] },
  ],
  api: {
    channelsEndpoint: null, // Using static channel definitions
    nowPlayingEndpoint: null, // Radio Browser stations don't have unified now-playing API
    streamUrlTemplate: null, // Using static stream definitions
    proxyRequired: false, // Most Radio Browser streams work directly
  },
  channelDefinitions,
};

// Made with Bob

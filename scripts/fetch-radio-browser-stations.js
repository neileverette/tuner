/**
 * Fetch and filter stations from Radio Browser API
 * 
 * Criteria:
 * - Music-only (exclude talk, news, podcasts)
 * - Genres: ambient, electronic, chillout, lofi, downtempo, instrumental
 * - No call-sign style names (KXXX, WXXX)
 * - Codec: MP3 or AAC
 * - Bitrate >= 128
 * - clickcount > 0
 * - Max 40 stations
 */

import https from 'https';

const TARGET_GENRES = ['ambient', 'electronic', 'chillout', 'lofi', 'downtempo', 'instrumental'];
const EXCLUDE_KEYWORDS = ['news', 'talk', 'podcast', 'show'];
const PREFER_KEYWORDS = ['24/7', 'stream', 'internet', 'non stop', 'music only'];

// Existing sources to exclude
const EXISTING_SOURCES = [
  'somafm',
  'radio paradise',
  'nts',
  'kexp'
];

function fetchStations() {
  return new Promise((resolve, reject) => {
    const url = 'https://de1.api.radio-browser.info/json/stations/search?' + 
      'tag=ambient&tag=electronic&tag=chillout&tag=lofi&tag=downtempo&tag=instrumental&' +
      'hidebroken=true&order=clickcount&reverse=true&limit=200';
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function isCallSign(name) {
  // Match patterns like KXXX, WXXX (US radio call signs)
  return /^[KW][A-Z]{3,4}(\s|$)/i.test(name);
}

function hasExcludedKeywords(station) {
  const searchText = `${station.name} ${station.tags}`.toLowerCase();
  return EXCLUDE_KEYWORDS.some(keyword => searchText.includes(keyword));
}

function isExistingSource(station) {
  const searchText = `${station.name} ${station.homepage}`.toLowerCase();
  return EXISTING_SOURCES.some(source => searchText.includes(source));
}

function hasPreferredKeywords(station) {
  const searchText = `${station.name} ${station.tags}`.toLowerCase();
  return PREFER_KEYWORDS.some(keyword => searchText.includes(keyword));
}

function filterStations(stations) {
  return stations
    .filter(s => {
      // Must have clickcount > 0
      if (s.clickcount <= 0) return false;
      
      // Must be MP3 or AAC
      const codec = s.codec.toUpperCase();
      if (!codec.includes('MP3') && !codec.includes('AAC')) return false;
      
      // Must have bitrate >= 128 (or 0 which means unknown/variable)
      if (s.bitrate > 0 && s.bitrate < 128) return false;
      
      // Exclude call signs
      if (isCallSign(s.name)) return false;
      
      // Exclude stations with excluded keywords
      if (hasExcludedKeywords(s)) return false;
      
      // Exclude existing sources (SomaFM, Radio Paradise, NTS, KEXP)
      if (isExistingSource(s)) return false;
      
      return true;
    })
    .map(s => ({
      name: s.name,
      streamUrl: s.url_resolved || s.url,
      tags: s.tags,
      clickcount: s.clickcount,
      bitrate: s.bitrate,
      codec: s.codec,
      country: s.country,
      language: s.language || '',
      homepage: s.homepage,
      hasPreferredKeywords: hasPreferredKeywords(s)
    }))
    .sort((a, b) => {
      // Prioritize stations with preferred keywords
      if (a.hasPreferredKeywords && !b.hasPreferredKeywords) return -1;
      if (!a.hasPreferredKeywords && b.hasPreferredKeywords) return 1;
      // Then sort by clickcount
      return b.clickcount - a.clickcount;
    })
    .slice(0, 40);
}

async function main() {
  try {
    console.log('Fetching stations from Radio Browser API...\n');
    const stations = await fetchStations();
    console.log(`Fetched ${stations.length} stations`);
    
    const filtered = filterStations(stations);
    console.log(`Filtered to ${filtered.length} stations\n`);
    
    console.log('Top 40 Stations:\n');
    filtered.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name}`);
      console.log(`   URL: ${s.streamUrl}`);
      console.log(`   Tags: ${s.tags}`);
      console.log(`   Codec: ${s.codec} @ ${s.bitrate}kbps`);
      console.log(`   Clicks: ${s.clickcount} | Country: ${s.country}`);
      console.log(`   Preferred: ${s.hasPreferredKeywords ? 'YES' : 'NO'}`);
      console.log('');
    });
    
    // Output JSON for easy integration
    console.log('\n=== JSON OUTPUT ===\n');
    console.log(JSON.stringify(filtered, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

// Made with Bob

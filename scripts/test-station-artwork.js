/**
 * Test script to verify all stations have visible artwork
 * This script checks each station's image URLs and identifies stations without artwork
 */

import { SourceRegistry } from '../src/services/SourceRegistry.js';

async function testStationArtwork() {
  console.log('🔍 Testing station artwork...\n');
  
  const registry = new SourceRegistry();
  
  try {
    // Fetch all channels
    const channels = await registry.getAllChannels();
    console.log(`📊 Total stations: ${channels.length}\n`);
    
    // Track statistics
    const stats = {
      total: channels.length,
      withArtwork: 0,
      withoutArtwork: 0,
      emptyImages: 0,
      bySource: {}
    };
    
    const stationsWithoutArtwork = [];
    
    // Check each station
    channels.forEach((channel, index) => {
      const hasImage = channel.image.medium && channel.image.medium.trim() !== '';
      
      // Initialize source stats
      if (!stats.bySource[channel.source]) {
        stats.bySource[channel.source] = {
          total: 0,
          withArtwork: 0,
          withoutArtwork: 0
        };
      }
      
      stats.bySource[channel.source].total++;
      
      if (hasImage) {
        stats.withArtwork++;
        stats.bySource[channel.source].withArtwork++;
      } else {
        stats.withoutArtwork++;
        stats.bySource[channel.source].withoutArtwork++;
        stationsWithoutArtwork.push({
          index: index + 1,
          id: channel.id,
          title: channel.title,
          source: channel.source,
          imageUrl: channel.image.medium || '(empty)'
        });
      }
      
      if (!channel.image.medium) {
        stats.emptyImages++;
      }
    });
    
    // Print results
    console.log('📈 STATISTICS:');
    console.log('─'.repeat(50));
    console.log(`Total Stations:           ${stats.total}`);
    console.log(`With Artwork:             ${stats.withArtwork} (${((stats.withArtwork/stats.total)*100).toFixed(1)}%)`);
    console.log(`Without Artwork:          ${stats.withoutArtwork} (${((stats.withoutArtwork/stats.total)*100).toFixed(1)}%)`);
    console.log(`Empty Image URLs:         ${stats.emptyImages}`);
    console.log('');
    
    console.log('📊 BY SOURCE:');
    console.log('─'.repeat(50));
    Object.entries(stats.bySource).forEach(([source, data]) => {
      const percentage = ((data.withoutArtwork/data.total)*100).toFixed(1);
      console.log(`${source.toUpperCase()}:`);
      console.log(`  Total: ${data.total}`);
      console.log(`  With Artwork: ${data.withArtwork}`);
      console.log(`  Without Artwork: ${data.withoutArtwork} (${percentage}%)`);
      console.log('');
    });
    
    if (stationsWithoutArtwork.length > 0) {
      console.log('🚨 STATIONS WITHOUT ARTWORK:');
      console.log('─'.repeat(50));
      stationsWithoutArtwork.forEach(station => {
        console.log(`${station.index}. [${station.source}] ${station.title}`);
        console.log(`   ID: ${station.id}`);
        console.log(`   Image: ${station.imageUrl}`);
        console.log('');
      });
    }
    
    // Summary
    console.log('✅ SUMMARY:');
    console.log('─'.repeat(50));
    if (stats.withoutArtwork === 0) {
      console.log('✨ All stations have artwork!');
    } else {
      console.log(`⚠️  ${stats.withoutArtwork} stations need fallback thumbnails`);
      console.log('   These stations will display generated thumbnails with:');
      console.log('   - Colored background based on station ID');
      console.log('   - Station initials in the center');
    }
    
  } catch (error) {
    console.error('❌ Error testing station artwork:', error);
    process.exit(1);
  }
}

// Run the test
testStationArtwork();

// Made with Bob

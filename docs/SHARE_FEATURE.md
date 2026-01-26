# Share Feature Documentation

## Overview
The share feature allows users to share their favorite radio stations with friends via social media platforms including Facebook, Twitter, WhatsApp, Instagram, TikTok, and more.

## Implementation Details

### Components
- **ShareButton.tsx** - Main share button component with AddToAny integration
- Located in upper right corner of the header, mirroring the logo position

### Technology
- **AddToAny** - Lightweight (20KB), privacy-focused sharing service
- Supports 100+ platforms including all major social networks
- No account required, completely free

### Share Format
When users click the share button, they can share:
```
Check out [Station Name] on tunr! https://tunr.app
```

Example:
```
Check out SomaFM Groove Salad on tunr! https://tunr.app
```

## Features

### Multi-Platform Support
- ✅ Facebook
- ✅ Twitter/X
- ✅ WhatsApp
- ✅ Email
- ✅ SMS
- ✅ Reddit
- ✅ LinkedIn
- ✅ Telegram
- ✅ Pinterest
- ✅ And 100+ more platforms

### Fallback Mechanisms
1. **Primary**: AddToAny share menu
2. **Fallback 1**: Native Web Share API (mobile devices)
3. **Fallback 2**: Copy to clipboard with confirmation toast

### Accessibility
- ✅ Keyboard navigation (Tab, Enter/Space)
- ✅ Screen reader support with descriptive labels
- ✅ Clear focus indicators
- ✅ WCAG AA color contrast compliance
- ✅ Touch-optimized for mobile (44px+ tap targets)

### Responsive Design
- **Desktop**: 32px × 32px button with hover effects
- **Tablet**: 40px × 40px with touch optimization
- **Mobile**: 44px × 44px for easy tapping

## User Experience

### Button States
1. **Default**: Semi-transparent with blur effect
2. **Hover**: Slightly larger with increased opacity
3. **Active**: Pressed effect (scale down)
4. **Disabled**: Reduced opacity when no station selected

### Animations
- Slides in from right side (mirrors logo animation)
- Smooth transitions on all interactions
- Syncs with header visibility

### Visual Design
- Position: Upper right corner (top: 24px, right: 24px)
- Style: Glass morphism effect with backdrop blur
- Icon: Material Symbols "share" icon
- Color: White with semi-transparent background

## Usage

### For Users
1. Select a radio station
2. Click the share button in the upper right corner
3. Choose your preferred platform from the menu
4. Share with friends!

### For Instagram/TikTok
Since these platforms don't have direct web share APIs:
1. Click the share button
2. Select "Copy Link"
3. Paste the link into Instagram/TikTok app

## Testing

### Manual Testing Checklist
- [ ] Share button appears in correct position
- [ ] Button is disabled when no station is selected
- [ ] Button enables when station is playing
- [ ] Clicking opens share menu
- [ ] Share text includes correct station name
- [ ] All major platforms work (Facebook, Twitter, WhatsApp)
- [ ] Copy link functionality works
- [ ] Fallback to native share works (mobile)
- [ ] Fallback to clipboard works
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Responsive on mobile devices
- [ ] Works on different backgrounds

### Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (macOS/iOS)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Performance

### Bundle Impact
- AddToAny script: ~20KB (async loaded)
- ShareButton component: ~2KB
- Total: ~22KB (minimal impact)

### Loading Strategy
- AddToAny loads asynchronously
- Doesn't block initial page render
- Button works immediately with fallback mechanisms

## Privacy & Security

### Privacy
- AddToAny doesn't track users
- No personal data collected or shared
- GDPR compliant
- No cookies or tracking pixels

### Security
- Station names are sanitized before sharing
- URLs are validated
- No XSS vulnerabilities
- Content Security Policy compatible

## Future Enhancements

### Potential Features
- [ ] Share with current track info (when available)
- [ ] Share with album artwork image
- [ ] Custom share messages per platform
- [ ] Share analytics (track which platforms used)
- [ ] Deep linking to specific stations
- [ ] QR code generation for easy mobile sharing
- [ ] Share playlists/favorites

## Troubleshooting

### Share button not visible
- Check that a station is selected
- Verify header is visible (not hidden by welcome modal)
- Check browser console for errors

### Share menu doesn't appear
- Verify AddToAny script is loaded (check Network tab)
- Try fallback methods (native share or copy to clipboard)
- Check browser console for errors

### Share text is empty
- Ensure a station is selected
- Check that station has a title
- Verify selectedChannel prop is passed correctly

## Code Examples

### Using the ShareButton Component
```typescript
<ShareButton
  stationName={selectedChannel?.title || ''}
  stationId={selectedChannel?.id || ''}
  visible={headerVisible && !showWelcome}
  disabled={!selectedChannel}
/>
```

### Customizing Share Platforms
Edit `src/components/ShareButton.tsx` to add/remove platforms:
```typescript
container.innerHTML = `
  <a class="a2a_button_facebook"></a>
  <a class="a2a_button_twitter"></a>
  <a class="a2a_button_whatsapp"></a>
  <a class="a2a_button_email"></a>
  <a class="a2a_button_sms"></a>
  <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
`
```

### Adding Analytics
```typescript
const handleShare = useCallback(async () => {
  // Track share button click
  if (window.gtag) {
    window.gtag('event', 'share_button_clicked', {
      station_name: stationName,
      station_id: stationId,
    })
  }
  // ... rest of share logic
}, [stationName, stationId])
```

## Support

For issues or questions:
- Check browser console for errors
- Verify all files are saved
- Test in different browsers
- Review AddToAny documentation: https://www.addtoany.com/buttons/customize

## Credits

- **AddToAny** - Share button service
- **Material Symbols** - Share icon
- **tunr team** - Implementation and design

---

Last updated: 2026-01-25
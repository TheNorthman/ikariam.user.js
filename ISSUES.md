# TNT Collection Core Issues

## Performance/Optimization
- [ ] cityId detection called multiple times during init
- [ ] Table building happening multiple times per page load
- [ ] Consider caching frequently called functions
- [ ] Static game data in separate localStorage extension (building costs, unit stats, research requirements)

## UI/Styling  
- [x] Window control sprite still being requested
- [x] Verify all buttons use Unicode instead of external sprites
- [x] **Research Ikariam icon CSS structure for resource/building icons**
  - ✅ Tested standalone classes - `.icon_wood`, `.wine`, etc. don't work without containers
  - ✅ Confirmed no simple icon classes exist on current page
  - ✅ **BREAKTHROUGH:** Found Ikariam's actual icon CSS structure!
    - **Required structure:** `#container ul.resources li.resourceName`
    - **Examples:** `#container ul.resources .wood`, `#container ul.resources .wine`, etc.
    - **Includes:** `.gold`, `.wood`, `.wine`, `.marble`, `.researchPoints`, `.capturePoints`, `.pirateCrew`
    - **Note:** Uses `.glass` NOT `.crystal` for crystal resource
  - ✅ **SUCCESS:** Tested structure - icons display perfectly!
  - [ ] **Ready for implementation** - Replace hardcoded URLs in core script

## Code Quality
- [ ] Reduce debug logging in production
- [ ] Optimize initialization sequence
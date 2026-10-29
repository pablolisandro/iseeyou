# PROJECT MEMORY - I SEE YOU

**Project:** I SEE YOU (ISY) - Editorial birthday web experience for Jea  
**Repository:** `pablolisandro/iseeyou` (public)  
**Deploy:** Vercel (auto-deploy on push to main)  
**Last Updated:** October 24, 2026  

---

## Project Overview

**Purpose:** Interactive web gift celebrating Jea's birthday (October 10, 2026)  
**Structure:** Single-page HTML with 3 tabs + scroll-snap sections  
**Status:** In development - core infrastructure stable, interactive envelope feature ready for review

---

## Current State (main branch)

### Working Features
- ✅ **Navigation:** 3 tabs (CHAPTER 01, CHAPTER 02, MAGAZINE)
- ✅ **Chapter 01:** Closed envelope → open envelope → card with "I SEE YOU HERE."
- ✅ **Chapter 02:** Closed envelope → open envelope → card with "I SEE YOU TIRED."
- ✅ **Magazine Cover:** Full-screen cover with metadata, subtitle, attributes
- ✅ **Design System:** Playfair Display (serif) + Inter, color palette #E8E0D0, #F5EEE5, #1a1a1a
- ✅ **Responsive:** Mobile (480px), tablet (768px), desktop (1024px+)

### Known Issues (main)
- ⚠️ **Magazine portada layout:** Mobile layout inconsistent, desktop has spacing issues
  - Last modified: commit `008a81a` ("Correcciones en layout de portada de revista")
  - Status: Needs CSS review/refinement
- ⚠️ **No interactive envelope:** sobre-front.png is static (scheduled for feature branch)

### Assets
- `sobre-closed.png` (1962×1280) - Envelope exterior
- `sobre-front.png` (1942×1260) - Envelope flap with chapter label
- `tarjeta-card.png` (1960×1228) - Opened card interior
- `jea-cover.jpg` (1.2 MB) - Jea's original photo (NEVER EDIT)
- `chapter02-page-*.png` (3 files) - Chapter 02 envelope states
- `sobre2-page-*.png` (3 files) - Alternate Chapter 02 versions

---

## Active Branches

### `feature/envelope-magazine` (Ready for Review)
**Status:** 2 commits ahead of main  
**Author:** Claude (session: initial interactive implementation)

**Commits:**
- `3096f5b` feat: Add interactive envelope opening with modal cards
- `9d18082` docs: Add feature review and demo description

**Changes:**
- Made sobre-front.png clickable (hover effect, cursor pointer)
- Added modal system with GSAP animations (0.4s in, 0.3s out)
- Modal displays chapter card with close button, click-outside, ESC key
- Responsive modal (desktop 600px, mobile 90% width)
- No breaking changes, all original assets preserved

**Review Documents:**
- `FEATURE_REVIEW.md` - Technical spec, testing checklist, limitations
- `DEMO_DESCRIPTION.txt` - Visual demo, animation keyframes, edge cases

**Next Step:** Await review feedback, then merge to main

---

## Design System (Immutable)

**Typography:**
- Primary: Playfair Display (serif) - Headings
- Secondary: Inter (sans-serif) - Body text
- Font sizes: Responsive via `clamp()`

**Color Palette:**
```
#E8E0D0  - Background (warm cream)
#F5EEE5  - Card/envelope interior (lighter cream)
#D9CFBF  - Seal/accents
#B8A89A  - Seal stroke
#1a1a1a  - Text (nearly black)
```

**Constraints:**
- ❌ NO changes to color values without explicit approval
- ❌ NO changes to typography without approval
- ❌ NO edits to jea-cover.jpg (original photo must remain untouched)
- ✅ CSS refinement OK (spacing, layout, responsiveness)
- ✅ Interactive enhancements OK (animations, modals, click behavior)

---

## Magazine Section (TODO)

**Status:** Portada implemented, pages not started

**Current Portada Layout:**
- Full-screen background image (jea-cover.jpg)
- Overlay gradient (dark left → transparent right)
- Header row: ISSUE 001 | 10 OCTOBER 2026
- Large title: "I SEE YOU."
- Two-column layout (grid on desktop, single on mobile):
  - Left: Tags (ART, TRAVEL, IDEAS, PEOPLE, PLACES) + description + VOL. 01
  - Right: Subtitle "JEA." + attributes (CREATIVE, FREE, INTELLIGENT, FUNNY, POWERFUL, SENSUAL) + tagline

**Issues to Address:**
- Mobile responsiveness needs refinement
- Desktop column spacing may need adjustment
- Text contrast on image could be improved (currently has gradient overlay)

**Future Pages (Not Started):**
- Magazine interior pages (content unknown)
- Transition from envelope → magazine flow
- Possible: "Continue to Magazine" button from modal

---

## Technology Stack

**Frontend:**
- HTML5 (single-page, semantic markup)
- CSS3 (media queries, flexbox, grid, backdrop-filter)
- JavaScript (vanilla, no frameworks)
- GSAP 3.12.2 (CDN for animations)

**Tools:**
- Git (version control)
- Vercel (hosting, auto-deploy on main)
- Chrome/Safari/Edge (target browsers)

**Optional (Not Yet Integrated):**
- HyperFrames (video rendering from GSAP timelines)
- PDF flipbooks (Flipsnack, FlipHTML5)
- AI-generated images (if magazine content needs assets)

---

## Agent Roles & Responsibilities

### Current Agent (Claude - Session)
**Branch:** `feature/envelope-magazine`  
**Tasks Completed:**
1. ✅ Analyzed project scope and existing codebase
2. ✅ Designed interactive envelope system (modal + GSAP)
3. ✅ Implemented sobre-front.png click handling
4. ✅ Added modal styling, animations, keyboard/click-outside close
5. ✅ Made responsive (mobile <768px, desktop 1024px+)
6. ✅ Created FEATURE_REVIEW.md and DEMO_DESCRIPTION.txt
7. ✅ Committed code + documentation
8. ✅ Ready for review before merge

**Blockers:** None  
**Next:** Await Pablo's review feedback, address any concerns, merge to main

---

## Key Decisions & Trade-offs

| Decision | Rationale | Status |
|----------|-----------|--------|
| **HTML/CSS/GSAP** over framework | Lightweight, responsive, fast | ✅ Active |
| **Modal for card display** over scroll flow | More dramatic reveal, interactivity | ✅ In feature branch |
| **GSAP from CDN** vs vendored | Smaller bundle, easier updates | ✅ Implemented |
| **No HyperFrames on web** yet | HTML/GSAP sufficient for modal, video optional later | ✅ Deferred |
| **PDF flipbooks optional** | Not critical for core gift delivery | 📋 To discuss |
| **Jea's photo untouched** | Preserves authenticity, no AI alterations | ✅ Rule enforced |

---

## Testing Checklist (for reviewers)

- [ ] sobre-front.png click opens modal (Chapter 01 & 02)
- [ ] Close button (✕) works
- [ ] Click outside modal dismisses it
- [ ] ESC key closes modal
- [ ] Hover effect visible on sobre-front.png
- [ ] Animations smooth on desktop (Chrome, Safari, Firefox)
- [ ] Responsive on mobile (test at 375px, 768px, 1024px)
- [ ] No console errors
- [ ] All original assets intact (no accidental overwrites)
- [ ] Tabs still switch correctly
- [ ] Magazine cover still displays
- [ ] Scroll behavior smooth after modal close

---

## Communication Log

**October 24, 2026:**
- Pablo: "Analiza todo lo que hablamos" (context doc requested)
- Claude: Provided comprehensive CONTEXTO_DE_PROYECTO summary
- Pablo: "Trabajá sobre feature/envelope-magazine" (branch assignment)
- Claude: Implemented interactive envelope, created FEATURE_REVIEW.md, ready for review

**Next Communication Expected:** Pablo's feedback on feature review

---

## Rules for Future Agents

1. **Always read this file first** before starting work on `pablolisandro/iseeyou`
2. **Assign yourself to a branch** - do not work on main directly
3. **Preserve immutable assets:**
   - jea-cover.jpg (Jea's photo - sacred)
   - sobre-*.png, tarjeta-*.png (approved designs)
   - Color palette #E8E0D0, #F5EEE5, #D9CFBF, #1a1a1a
   - Typography: Playfair Display + Inter

4. **Document your work:**
   - Update `docs/agents/<your-name>.md` after each session
   - Create feature branch (not work directly on main)
   - Write FEATURE_REVIEW.md or equivalent before proposing PR
   - Leave clear commit messages and code comments

5. **Propose memory updates** via PR if you modify this file
6. **No simultaneous multi-agent writes** to this file
7. **Check for open PRs** before starting new work (avoid duplicates)

---

## Files Structure

```
pablolisandro/iseeyou/
├── index.html                          (Main file, 700+ lines)
├── jea-cover.jpg                       (Sacred photo)
├── sobre-closed.png                    (Envelope exterior)
├── sobre-front.png                     (Envelope flap)
├── tarjeta-card.png                    (Card interior)
├── chapter02-page-*.png                (3 variants)
├── sobre2-page-*.png                   (3 variants)
├── vercel.json                         (Deploy config)
├── PROJECT_MEMORY.md                   (This file - central registry)
├── FEATURE_REVIEW.md                   (Current feature review)
├── DEMO_DESCRIPTION.txt                (Current feature demo)
├── docs/
│   └── agents/
│       └── (Agent session summaries - to be created)
└── README.md                           (Optional - project overview for public)
```

---

## Next Priorities

**Immediate (Before Main):**
1. Pablo reviews `feature/envelope-magazine` implementation
2. Address any feedback from feature review
3. Merge to main once approved
4. Deploy to Vercel

**Short-term (After Merge):**
1. Fix magazine portada mobile layout
2. Implement magazine interior pages (if content provided)
3. Add "Continue to Magazine" flow from modal
4. Consider: PDF flipbook for offline sharing

**Long-term (Future):**
1. Sound design (modal open/close audio)
2. HyperFrames video integration (opcional)
3. Multi-language support (if needed)
4. Analytics/tracking (if requested)

---

## Contact & Escalation

**Project Owner:** Pablo Kühle  
**Repository:** https://github.com/pablolisandro/iseeyou  
**Current Status:** Feature ready for review (feature/envelope-magazine)  

**For Questions:**
- Check this file first
- Review FEATURE_REVIEW.md
- Read DEMO_DESCRIPTION.txt
- Check open PRs in the repo
- Look at `docs/agents/` for previous session notes

---

**Document Version:** 1.0  
**Created:** October 24, 2026  
**Last Modified:** October 24, 2026 (initial creation)  
**Maintained by:** Claude (initial), future agents TBD

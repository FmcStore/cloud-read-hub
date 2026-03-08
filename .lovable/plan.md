

## Problem Analysis

The history data IS being saved correctly to the database (confirmed 4 records exist). The issue is in the **History page rendering**.

**Root cause**: `History.tsx` line 44 calls `getComicBySlug(item.comic_slug)` which looks up comics from the static `comics` array in `src/data/comics.ts` -- but that array is **empty** (`[]`). So every history item returns `null` from the lookup, and line 45 `if (!comic) return null` filters them all out, showing an empty list.

The app fetches all comic data from an external API (sankavollerei.com), not from static data. The History page needs to fetch comic details from the API for each history item.

## Plan

### 1. Rewrite History.tsx to fetch comic details from API

- Remove the `getComicBySlug` import (useless -- static array is empty)
- For each history item, call `fetchComicDetail(slug)` from the API to get title, cover image, and type
- Use `useQueries` from `@tanstack/react-query` to batch-fetch details for all history slugs in parallel
- Render cards using API data instead of static data
- Show skeleton/loading states while fetching

### 2. Files to change

- **`src/pages/History.tsx`**: Replace static lookup with API-based fetching using `useQueries` + `fetchComicDetail`. Each card will show `detail.title`, `detail.imageSrc` as cover, and link to `/comic/{slug}`.

### Technical Detail

```typescript
// Use useQueries to fetch all comic details in parallel
const comicQueries = useQueries({
  queries: history.map((item) => ({
    queryKey: ["api-comic-detail", item.comic_slug],
    queryFn: () => fetchComicDetail(item.comic_slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!item.comic_slug,
  })),
});
```

Each card renders using `comicQueries[index].data` for title/cover, falling back to slug if still loading. This is a single-file change.


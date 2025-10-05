# Search Functionality Documentation

## Overview

The headless WordPress magazine already has a fully functional search system that allows users to search across all content types (articles, events, and resources).

## Components

### 1. Global Search Modal (`components/global-search.tsx`)

A keyboard-accessible search modal that provides instant search results as you type.

**Features:**
- Opens with `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- Real-time search with 300ms debounce
- Keyboard navigation (↑↓ arrows, Enter to select, Escape to close)
- Shows up to 10 results across all content types
- Displays result type badges (Article, Event, Resource)
- Shows metadata (date, category, location)
- "View all results" button to go to full search page

**Usage:**
- Click the search button in the navigation
- Press `Cmd+K` / `Ctrl+K` anywhere on the site
- Start typing to see instant results

### 2. Search API Route (`app/api/search/route.ts`)

Backend API endpoint that handles search queries.

**Endpoint:** `GET /api/search?q={query}`

**How it works:**
1. Receives search query from URL parameter
2. Searches in parallel across:
   - WordPress posts (articles)
   - WordPress events (custom post type)
   - WordPress resources (custom post type)
3. Formats results with consistent structure
4. Returns up to 10 results (5 per content type)

**Response format:**
\`\`\`json
{
  "results": [
    {
      "type": "article" | "event" | "resource",
      "id": 123,
      "title": "Result title",
      "excerpt": "Brief description...",
      "url": "/blog/slug",
      "date": "2024-01-15",
      "category": "Category name",
      "location": "Event location",
      "fileType": "pdf" | "video" | "document"
    }
  ]
}
\`\`\`

### 3. Search Results Page (`app/recherche/page.tsx`)

A dedicated page for displaying comprehensive search results.

**Features:**
- Full-page search interface
- Tabbed filtering (All, Articles, Events, Resources)
- Result counts per category
- Detailed result cards with metadata
- Empty state with suggestions
- Suggested search terms
- Links to browse by content type

**URL:** `/recherche?q={query}`

### 4. Navigation Integration (`components/navigation.tsx`)

Search is integrated into the main navigation bar.

**Features:**
- Search button with keyboard shortcut hint
- Opens global search modal on click
- Right-click opens full search page
- Mobile-friendly search button

## WordPress Integration

The search uses WordPress REST API's built-in search functionality:

### Posts (Articles)
\`\`\`typescript
getPosts({ search: query, per_page: 5 })
\`\`\`
Searches in: title, content, excerpt

### Events
\`\`\`typescript
getEvents({ search: query })
\`\`\`
Searches in: title, content, ACF description field

### Resources
\`\`\`typescript
getResources({ search: query })
\`\`\`
Searches in: title, content, ACF descriptif field

## Search Parameters

The WordPress REST API `search` parameter searches across:
- Post/page titles
- Post/page content
- Post/page excerpts
- Custom fields (if configured)

## Customization Options

### 1. Increase Result Limits

In `app/api/search/route.ts`, adjust the `per_page` and `slice()` values:

\`\`\`typescript
// Current: 5 results per type
getPosts({ search: query, per_page: 5 })

// Change to 10 results per type
getPosts({ search: query, per_page: 10 })
\`\`\`

### 2. Add More Content Types

To search additional custom post types:

1. Add a new fetch function in `lib/wordpress.tsx`
2. Add it to the parallel search in `app/api/search/route.ts`
3. Format the results
4. Add a new tab in `app/recherche/page.tsx`

### 3. Improve Search Relevance

WordPress search can be enhanced with plugins:
- **Relevanssi** - Better search algorithm with relevance scoring
- **SearchWP** - Advanced search with custom field support
- **ElasticPress** - Elasticsearch integration for large sites

### 4. Add Search Filters

You can add filters to the search page:
- Date range
- Categories
- Content type
- Tags
- Custom taxonomies

### 5. Search Analytics

Track search queries to understand user behavior:
- Most searched terms
- Zero-result searches
- Popular content

## Performance Considerations

### Current Optimizations

1. **Debouncing** - 300ms delay before searching (reduces API calls)
2. **Parallel Requests** - All content types searched simultaneously
3. **Result Limits** - Maximum 10 results in modal, unlimited on search page
4. **Caching** - WordPress API responses cached for 5 minutes

### Future Improvements

1. **Client-side caching** - Cache recent searches in localStorage
2. **Search suggestions** - Autocomplete based on popular searches
3. **Fuzzy matching** - Handle typos and similar terms
4. **Search history** - Remember user's recent searches

## Accessibility

The search functionality is fully accessible:

- ✅ Keyboard navigation (Tab, Arrow keys, Enter, Escape)
- ✅ Screen reader support with ARIA labels
- ✅ Focus management (auto-focus on open)
- ✅ Keyboard shortcuts with visual hints
- ✅ High contrast support

## Mobile Experience

The search is optimized for mobile:

- Simplified search button (icon only)
- Full-screen search modal on small screens
- Touch-friendly result cards
- Responsive layout

## Testing the Search

### Test Queries

Try these searches to test functionality:

1. **General terms**: "engagement", "action", "collectif"
2. **Specific content**: Event names, article titles
3. **Empty search**: Test empty state
4. **No results**: "xyzabc123" (should show no results message)
5. **Special characters**: Test with accents, punctuation

### Expected Behavior

- ✅ Results appear within 300ms of typing
- ✅ Results are relevant to the query
- ✅ All content types are searched
- ✅ Keyboard navigation works smoothly
- ✅ Links navigate to correct pages

## Troubleshooting

### No Results Found

1. Check WordPress API is accessible
2. Verify content exists in WordPress
3. Check search parameter is being sent correctly
4. Review WordPress REST API permissions

### Slow Search

1. Reduce result limits
2. Add caching layer
3. Optimize WordPress database
4. Consider search plugin (Relevanssi, SearchWP)

### Missing Content Types

1. Verify custom post types are registered with `show_in_rest => true`
2. Check REST API endpoints are accessible
3. Ensure ACF fields are exposed to REST API

## Future Enhancements

Potential improvements for the search functionality:

1. **Advanced Filters**
   - Date range picker
   - Multiple category selection
   - Location-based filtering for events

2. **Search Suggestions**
   - Autocomplete dropdown
   - Popular searches
   - Related terms

3. **Search Analytics**
   - Track search queries
   - Identify content gaps
   - Improve content based on searches

4. **AI-Powered Search**
   - Semantic search
   - Natural language queries
   - Content recommendations

5. **Voice Search**
   - Speech-to-text input
   - Mobile voice search button

## Conclusion

The search functionality is fully implemented and ready to use. It provides a fast, accessible, and user-friendly way to find content across the entire WordPress magazine.

For questions or improvements, refer to the component files or the WordPress REST API documentation.

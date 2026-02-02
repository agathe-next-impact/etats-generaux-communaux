/**
 * WordPress API utilities for headless preview
 */

export interface WPPreviewParams {
  id: string | number;
  postType?: string;
  token?: string;
  secret?: string;
}

export interface WPPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  status: string;
  type: string;
  featured_media: number;
  author: number;
  categories?: number[];
  tags?: number[];
  acf?: Record<string, unknown>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      avatar_urls: Record<string, string>;
    }>;
  };
}

export interface WPPreviewData {
  post: WPPost | null;
  isPreview: boolean;
  postType: string;
}

const WP_API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const WP_PREVIEW_SECRET = process.env.WP_PREVIEW_SECRET;

/**
 * Cache for post type mappings
 */
let postTypeMappings: Record<string, string> | null = null;

/**
 * Fetch post type REST base mappings from WordPress
 */
async function fetchPostTypeMappings(): Promise<Record<string, string>> {
  if (postTypeMappings) {
    return postTypeMappings;
  }

  try {
    const response = await fetch(`${WP_API_URL?.replace('/wp-json', '')}/wp-json/headless-preview/v1/post-types`, {
      cache: 'force-cache',
    });
    
    if (response.ok) {
      const data = await response.json();
      postTypeMappings = {};
      for (const [postType, info] of Object.entries(data as Record<string, { rest_base: string }>)) {
        postTypeMappings[postType] = info.rest_base;
      }
      return postTypeMappings;
    }
  } catch (error) {
    console.warn('Could not fetch post type mappings:', error);
  }
  
  return {};
}

/**
 * Get the WordPress REST API endpoint for a given post type
 * WordPress REST API uses plural forms for endpoints by default
 */
export function getPostTypeEndpoint(postType: string): string {
  const endpoints: Record<string, string> = {
    post: 'posts',
    page: 'pages',
    // Add your custom post types here if they have non-standard endpoints
    // 'my-cpt': 'my-cpts',
  };

  // If we have a mapped endpoint, use it
  if (endpoints[postType]) {
    return endpoints[postType];
  }

  // For CPTs, WordPress typically uses the post type name as-is for the REST endpoint
  // but some plugins/themes register them with custom rest_base
  // Common pattern: singular -> plural (add 's')
  return postType;
}

/**
 * Get the WordPress REST API endpoint for a given post type (async version)
 * This fetches the actual rest_base from WordPress for ACF and other plugin CPTs
 */
export async function getPostTypeEndpointAsync(postType: string): Promise<string> {
  // Check built-in types first
  const builtIn: Record<string, string> = {
    post: 'posts',
    page: 'pages',
  };

  if (builtIn[postType]) {
    return builtIn[postType];
  }

  // Fetch mappings from WordPress for CPTs
  const mappings = await fetchPostTypeMappings();
  if (mappings[postType]) {
    return mappings[postType];
  }

  // Fallback to post type name
  return postType;
}

/**
 * Fetch a preview post from WordPress using authentication
 */
export async function fetchPreviewPost({
  id,
  postType = 'post',
  token,
}: WPPreviewParams): Promise<WPPost | null> {
  if (!WP_API_URL) {
    console.error('WordPress API URL is not configured');
    return null;
  }

  // Use async version to get correct endpoint for ACF CPTs
  const endpoint = await getPostTypeEndpointAsync(postType);
  const url = `${WP_API_URL}/wp/v2/${endpoint}/${id}?_embed&status=any`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      headers,
      cache: 'no-store', // Always fetch fresh data for previews
    });

    if (!response.ok) {
      console.error(`Failed to fetch preview: ${response.status} ${response.statusText}`);
      return null;
    }

    const post: WPPost = await response.json();
    return post;
  } catch (error) {
    console.error('Error fetching preview post:', error);
    return null;
  }
}

/**
 * Fetch a draft or revision post from WordPress
 */
export async function fetchDraftPost({
  id,
  postType = 'post',
  token,
}: WPPreviewParams): Promise<WPPost | null> {
  if (!WP_API_URL) {
    console.error('WordPress API URL is not configured');
    return null;
  }

  const endpoint = getPostTypeEndpoint(postType);
  
  // First, try to get the latest revision
  const revisionsUrl = `${WP_API_URL}/wp/v2/${endpoint}/${id}/revisions?per_page=1`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const revisionsResponse = await fetch(revisionsUrl, {
      headers,
      cache: 'no-store',
    });

    if (revisionsResponse.ok) {
      const revisions: WPPost[] = await revisionsResponse.json();
      if (revisions.length > 0) {
        // Get the parent post with embedded data and merge with revision content
        const parentPost = await fetchPreviewPost({ id, postType, token });
        if (parentPost) {
          return {
            ...parentPost,
            title: revisions[0].title,
            content: revisions[0].content,
            excerpt: revisions[0].excerpt,
          };
        }
        return revisions[0];
      }
    }

    // Fallback to getting the post directly
    return await fetchPreviewPost({ id, postType, token });
  } catch (error) {
    console.error('Error fetching draft post:', error);
    return null;
  }
}

/**
 * Validate the preview secret token
 */
export function validatePreviewSecret(secret: string | undefined): boolean {
  if (!WP_PREVIEW_SECRET) {
    console.warn('WP_PREVIEW_SECRET is not configured');
    return true; // Allow preview if no secret is configured (development)
  }
  return secret === WP_PREVIEW_SECRET;
}

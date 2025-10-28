export function parseYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '');
    }

    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }

    const path = parsed.pathname.split('/');
    const embedIndex = path.findIndex((segment) => segment === 'embed');
    if (embedIndex !== -1 && path[embedIndex + 1]) {
      return path[embedIndex + 1];
    }

    return null;
  } catch (error) {
    return null;
  }
}

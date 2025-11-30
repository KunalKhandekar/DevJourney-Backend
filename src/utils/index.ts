/**
 * Generate a random username (e.g. user-abc123)
*/
export const generateUsername = (): string => {
    const usernamePrefix = 'user-';
    const randomChars = Math.random().toString(36).slice(2);
    return usernamePrefix + randomChars;
}

/**
 * Generate a random slug from a title (e.g. my-title-abc123)
 * @param title The title to generate a slug from
 * @returns A random slug 
*/
export const generateSlug = (title: string): string => {
    const slug = title.toLowerCase().trim()
    .replace(/[^a-z0-9]\s-/g, '')
    .replace(/\s-+/g, '-')
    .replace(/-+/g, '-');
const randomChars = Math.random().toString(36).slice(2);
    
    return `${slug}-${randomChars}`
}
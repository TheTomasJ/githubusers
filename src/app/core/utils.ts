export function getURI(path: string): string {
    return 'https://api.github.com' + path;
}

export interface GitHubResponse {
    total_count: number,
    items: unknown[]
}
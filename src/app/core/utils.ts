import { HttpClient } from '@angular/common/http';

export function getURI(path: string): string {
    return 'https://api.github.com' + path;
}

export interface GitHubResponse {
    total_count: number,
    items: unknown[]
}

export function extractCountToProp(http: HttpClient, url: string, onDone: (res: number) => unknown) {
    http.get(url, {
        params: {
            per_page: '1'
        },
        observe: 'response'
    })
    .subscribe(res => {
        const link = res.headers.get('link');
        onDone(link ? parseInt(link.substring(link.lastIndexOf('page=')).split('=')[1]) : 0);
    });
}
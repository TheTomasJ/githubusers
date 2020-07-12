import { GitHubResponse } from 'src/app/core/utils';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

const DEFAULT_PAGE_SIZE = 30;

export class DataSource<T> {
    public rows: T[];
    public page: number = 1;
    public pages: number = 1;
    public order: 'desc' | 'asc' = 'desc';
    public sortKey: string;
    public latest: GitHubResponse;
    public isWorking: boolean;
    public destroyed$: Subject<void> = new Subject();
    
    constructor(
        public cols: {id: string, sortKey?: string, type?: string}[],
        private provider: (sort: string, order: string, page: number) => Observable<GitHubResponse>,
        private parser: (row: any) => T,
        defaults?: {
            sortKey?: string
        }
    ) {
        if(defaults) {
            this.sortKey = defaults.sortKey;
        }
    }

    public nextPage(): void {
        if(this.pages > this.page) {
            this.page++;
            this.update();
        }
    }

    public prevPage(): void {
        if(this.page > 1) {
            this.page--;
            this.update();
        }
    }

    public sort(col: string): void {
        if(this.sortKey === col) {
            this.order = this.order === 'desc' ? 'asc' : 'desc';
        } else {
            this.sortKey = col;
            this.order = 'desc';
        }
        this.update();
    }

    public destroy(): void {
        this.destroyed$.next();
    }

    public refresh(): void {
        this.page = 1;
        this.update();
    }

    private update(): void {
        this.isWorking = true;
        this.provider(this.sortKey, this.order, this.page)
            .pipe(
                take(1),
                takeUntil(this.destroyed$)
            )
            .subscribe(data => {
                this.latest = data;
                this.rows = data.items.map(this.parser);
                this.pages = Math.ceil(this.latest?.total_count / DEFAULT_PAGE_SIZE);
                this.isWorking = false;
            });
    }
}

import { GitHubResponse } from 'src/app/core/utils';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

export class DataSource<T> {
    rows: T[];
    isWorking?: boolean;
    page = 1;
    pages = 1;
    sortKey: string;
    order: string = 'desc';
    latest: GitHubResponse;
    destroyed$: Subject<void> = new Subject();

    constructor(
        public cols: {id: string, sortKey?: string, type?: string}[],
        private provider: (sort: string, order: string, page: number) => Observable<GitHubResponse>,
        private parser: (row: any) => T
    ) {

    }

    nextPage(): void {
        if(this.pages > this.page) {
            this.page++;
            this.update();
        }
    }
    prevPage(): void {
        if(this.page > 1) {
            this.page--;
            this.update();
        }
    }
    sort(col: string): void {
        if(this.sortKey === col) {
            this.order = this.order === 'desc' ? 'asc' : 'desc';
        } else {
            this.sortKey = col;
            this.order = 'desc';
        }
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
                this.pages = Math.ceil(this.latest?.total_count / 30);
            });
    }

    public destroy(): void {
        this.destroyed$.next();
    }

    public refresh(): void {
        this.page = 1;
        this.update();
    }
}
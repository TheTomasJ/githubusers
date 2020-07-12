import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { getURI, GitHubResponse, extractCountToProp } from 'src/app/core/utils';
import { User } from './user-detail.model';
import { DataSource } from 'src/app/components/table/table.model';
import { Observable, Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import { SessionService } from 'src/app/core/session.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnDestroy {
  public id: string;
  public user: User;
  public reposDS: DataSource<unknown>;
  public followersDS: DataSource<unknown>;
  private destroyed: Subject<void> = new Subject();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public session: SessionService
  ) {
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.destroyed)
      )
      .subscribe(() => {
        this.id = this.route.snapshot.paramMap.get('id');
        this.fetchData();
        this.user = null;
        this.reposDS = null;
        this.followersDS = null;
      });
  }

  private fetchData(): void {
    this.http.get<GitHubResponse>(getURI('/search/users'), {
      params: {
        q: 'user:' + this.id
      }
    })
      .subscribe(response => {
        this.user = response.items[0] as User;

        // prepare followers data
        extractCountToProp(this.http, this.user.followers_url, res => {
          this.user.followersCount = res;
          this.followersDS = new DataSource(
            [
              {
                id: 'Name',
                type: 'link'
              },
            ],
            (sort, order, page) => this.getSubDS(page, res, this.user.followers_url),
            row => {
              return {
                Name: {
                  text: row.login,
                  link: ['/users/' + row.login]
                }
              }
            }
          );
        });

        // prepare repos data
        extractCountToProp(this.http, this.user.repos_url, res => {
          this.user.reposCount = res;
          this.reposDS = new DataSource(
            [
              {
                id: 'Name',
              },
            ],
            (sort, order, page) => this.getSubDS(page, res, this.user.repos_url),
            row => {
              return {
                Name: row.name,
                'Full Name': row.full_name
              }
            }
          );
        });

      });
  }

  public getSubDS(page: number, count: number, url: string): Observable<GitHubResponse> {
    return this.http.get<GitHubResponse>(url, {
      params: {
        page: page + ''
      }
    })
      .pipe(map(res => {
        return  {
          total_count: count,
          items: res as unknown as unknown[]
        }
      }));
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

}

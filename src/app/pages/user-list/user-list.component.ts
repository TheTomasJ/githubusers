import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getURI, GitHubResponse } from '../../core/utils';
import { DataSource } from 'src/app/components/table/table.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  public location = new FormControl('Bratislava');

  public dataSource: DataSource<unknown> = new DataSource(
    [
      {
        id: 'Avatar',
        type: 'img'
      },
      {
        id: 'Name',
        type: 'link'
      },
      {
        id: 'Repos',
        sortKey: 'repositories',
        type: 'dynamic'
      },
      {
        id: 'Followers',
        sortKey: 'followers',
        type: 'dynamic'
      },
      {
        id: 'Created at',
        sortKey: 'created'
      }
    ],
    (sort, order, page) => this.getList(this.location.value, sort, order, page),
    (row => {
      const result = {
        Avatar: row.avatar_url,
        Name: {
          text: row.login,
          link: ['/users/' + row.id]
        },
        Repos: {
          revealed: null,
          reveal: () => {
            this.http.get(row.repos_url, {
              params: {
                per_page: '1'
              },
              observe: 'response'
            })
              .subscribe(res => {
                const link = res.headers.get('link');
                result.Repos.revealed = parseInt(link.substring(link.lastIndexOf('page=')).split('=')[1])
              });
          }
        },
        Followers: {
          revealed: null,
          reveal: () => {
            this.http.get(row.followers_url, {
              params: {
                per_page: '1'
              },
              observe: 'response'
            })
              .subscribe(res => {
                const link = res.headers.get('link');
                result.Followers.revealed = parseInt(link.substring(link.lastIndexOf('page=')).split('=')[1])
              });
          }
        },
        'Created at': '-'
      }

      return result;
    })
  );

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  public getList(location: string, sort: string, order: string, page: number): Observable<GitHubResponse> {
    return this.http.get<GitHubResponse>(getURI('/search/users'), {
      params: {
        q: 'location:' + location,
        order: order,
        sort: sort,
        page: page + ''
      }
    })
  }

  ngOnDestroy(): void {
    this.dataSource.destroy();
  }

}

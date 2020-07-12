import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getURI, GitHubResponse, extractCountToProp } from '../../core/utils';
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
        id: 'Joined at',
        sortKey: 'joined'
      }
    ],
    (sort, order, page) => this.getList(this.location.value, sort, order, page),
    (row => {
      const result = {
        Avatar: row.avatar_url,
        Name: {
          text: row.login,
          link: ['/users/' + row.login]
        },
        Repos: {
          revealed: null,
          reveal: () => extractCountToProp(this.http, row.repos_url, res => result.Repos.revealed = res)
        },
        Followers: {
          revealed: null,
          reveal: () => extractCountToProp(this.http, row.followers_url, res => result.Followers.revealed = res)
        },
        'Joined at': '-'
      }

      return result;
    }),
    {
      sortKey: 'repositories'
    }
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

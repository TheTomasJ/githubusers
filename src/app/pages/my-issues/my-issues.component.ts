import { Component } from '@angular/core';
import { DataSource } from 'src/app/components/table/table.model';
import { GitHubResponse, getURI } from 'src/app/core/utils';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/app/core/session.service';

@Component({
  selector: 'app-my-issues',
  templateUrl: './my-issues.component.html',
  styleUrls: ['./my-issues.component.scss']
})
export class MyIssuesComponent {

  public dataSource: DataSource<unknown> = new DataSource(
    [
      {
        id: 'Issue',
        type: 'href'
      },
    ],
    (sort, order, page) => this.getList(page),
    (row => {
      return {
        Issue: {
          text: row.title,
          url: 'https://github.com/' + (row.url as string).split('repos/')[1]
        }
      }
    })
  );

  constructor(private http: HttpClient, private session: SessionService) {
  }

  public getList(page: number): Observable<GitHubResponse> {
    return this.http.get<GitHubResponse>(getURI('/search/issues'), {
      params: {
        q: 'user:' + this.session.loggedInUser.username,
        page: page + ''
      }
    })
  }

}

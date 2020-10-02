import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from 'rxjs';
import { map,catchError,tap } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    return this.http
      .post<{ name: string }>(
        "https://http-2f901.firebaseio.com/posts.json",
        postData,
        {
          observe: 'response'
        }
      );
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');

    return this.http
      .get<{ [key: string]: Post }>(
        "https://http-2f901.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({
            "Custom-Header": "Hello"
          }),
          params: searchParams
        }
      )
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError((errorRes) => {
         return throwError(errorRes);
        })
      );
  }

  deletePosts() {
      return this.http.delete("https://http-2f901.firebaseio.com/posts.json",
      {
        observe: 'events',
        responseType: 'text'
      }).pipe(tap(event => {
        console.log(event);
        if(event.type === HttpEventType.Sent){
        }
        if(event.type === HttpEventType.Response){
          console.log(event.body);
        }
      }));
  }
}

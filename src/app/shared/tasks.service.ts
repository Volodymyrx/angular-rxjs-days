import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {map} from 'rxjs/operators';

export interface Task {
  title: string;
  id?: string;
  date: string;
}

export interface CreateResponse {
  name: string;
}

@Injectable({providedIn: 'root'})
export class TasksService {
  static baseUrlDb = 'https://a-rxjs-days.firebaseio.com/tasks';
  dayTasks: Task[] = [];

  constructor(private http: HttpClient) {
  }

  getDayTasks(date: string): Observable<Task[]> {
    return this.http
      .get(`${TasksService.baseUrlDb}/${date}.json`)
      .pipe(map(tasks => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map(id => ({...tasks[id], id}));
        })
      );
  }

  createTask(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.baseUrlDb}/${task.date}.json`, task)
      .pipe(map(res => {
        return {...task, id: res.name};
      }));

  }

  removeTask(date: string, id: string): Observable<void> {
    console.log('id, date', id, date);
    return this.http.delete<void>(`${TasksService.baseUrlDb}/${date}/${id}.json`);
  }


}

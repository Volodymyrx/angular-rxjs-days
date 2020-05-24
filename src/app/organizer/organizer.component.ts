import {Component, OnInit} from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Task, TasksService} from '../shared/tasks.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dateService: DateService,
    public tasksService: TasksService,
  ) {
  }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap((value) => this.tasksService.getDayTasks(value.format('DD-MM-YYYY')))
    ).subscribe(tasks => {
      this.tasksService.dayTasks = tasks;
    });


    this.form = new FormGroup({
      title: new FormControl(null,
        [Validators.required])
    });
    // const dateStr: string = this.dateService.date.value.format('DD-MM-YYYY');
    // this.tasksService.getDayTasks(dateStr).subscribe((tasks: Task[]) => {
    //   console.log('tasks', tasks);
    //   this.tasksService.dayTasks = tasks;
    // });

  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const {title} = this.form.value;
    console.log('title', title);
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };
    this.tasksService.createTask(task).subscribe((t: Task) => {
        this.tasksService.dayTasks.unshift(t);
        this.form.reset();
        console.log('response', t);
      }, error => console.log('error', error)
    );

  }

  remove(date: string, id: string) {
    this.tasksService.removeTask(date, id).subscribe((resDel) => {
      this.tasksService.dayTasks = this.tasksService.dayTasks.filter(task => task.id !== id);
      console.log('resDel', resDel);
    });
    console.log('remove ');
  }
}

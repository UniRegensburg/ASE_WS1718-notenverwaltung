import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';

import { OverviewComponent, StudentsComponent, GradingComponent } from './components/course/index'

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'course',
        component: CourseComponent,
        children:[
            {
                path: 'overview',
                component: OverviewComponent, 
            },
            {
                path: 'students',
                component: StudentsComponent, 
            },
            {
                path: 'grading',
                component: GradingComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }

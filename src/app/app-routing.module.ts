import { HomeComponent, NewCourseComponent } from './components/home/index';
import { CourseComponent } from './components/course/course.component';

import {APP_BASE_HREF} from '@angular/common';


import { OverviewComponent, StudentsComponent, GradingComponent, CorrectionComponent, ResultsComponent } from './components/course/index'

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'newcourse',
        component: NewCourseComponent,
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
                path: 'results',
                component: ResultsComponent,
            },
            {
                path: 'grading',
                component: GradingComponent, 
            },
            {
                path: 'correction',
                component: CorrectionComponent, 
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { HomeComponent } from './components/home/index';
import { NewCourseComponent } from './components/newcourse/newcourse.component';
import { CourseComponent } from './components/course/course.component';

import {APP_BASE_HREF} from '@angular/common';


import { OverviewComponent, StudentsComponent, GradingComponent, CorrectionComponent, ResultsComponent, DetailComponent, ResultsDetailComponent } from './components/course/index'

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
                path:'student_detail',
                component: DetailComponent
            },
            {
                path: 'results',
                component: ResultsComponent,
            },
            {
                path: 'results-detail',
                component: ResultsDetailComponent,
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

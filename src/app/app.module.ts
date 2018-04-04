import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/index';
import { NewCourseComponent } from './components/newcourse/newcourse.component';
import { CourseComponent } from './components/course/course.component';

import { OverviewComponent, StudentsComponent, GradingComponent, ResultsComponent, CorrectionComponent,DetailComponent } from './components/course/index'


import { AppRoutingModule } from './app-routing.module';

import { ElectronService, GlobalDataService, ChartService, LastOpened, gripsExportService, flexNowExportService, ToastService, lastSavedService, CheckOsService } from './providers/index';

import { NgxPaginationModule } from 'ngx-pagination';

import { SearchStudentPipe } from './pipes/index';

import { ToastComponent } from './directives/toast.directive/toast.directive';

import { DeviceDetectorModule } from 'ngx-device-detector';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CourseComponent,
    OverviewComponent,
    StudentsComponent,
    GradingComponent,
    NewCourseComponent,
    ResultsComponent,
    CorrectionComponent,
    DetailComponent,
    SearchStudentPipe,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgxPaginationModule,
    DeviceDetectorModule.forRoot() 
  ],
  providers: [
    ElectronService,
    GlobalDataService,
    ChartService,
    LastOpened,
    gripsExportService,
    SearchStudentPipe,
    flexNowExportService,
    CheckOsService
    ToastService,
    lastSavedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent, NewCourseComponent } from './components/home/index';
import { CourseComponent } from './components/course/course.component';

import { OverviewComponent, StudentsComponent, ResultsComponent } from './components/course/index'

import { AppRoutingModule } from './app-routing.module';

import { ElectronService, GlobalDataService, LastOpened } from './providers/index';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CourseComponent,
    OverviewComponent,
    StudentsComponent,
    NewCourseComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ElectronService, GlobalDataService, LastOpened],
  bootstrap: [AppComponent]
})
export class AppModule { }

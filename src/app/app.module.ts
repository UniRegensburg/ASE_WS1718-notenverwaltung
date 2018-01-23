import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';

import { OverviewComponent, StudentsComponent } from './components/course/index'

import { AppRoutingModule } from './app-routing.module';

import { ElectronService, GlobalDataService } from './providers/index';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CourseComponent,
    OverviewComponent,
    StudentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ElectronService, GlobalDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

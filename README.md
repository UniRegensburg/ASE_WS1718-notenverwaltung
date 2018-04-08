<a>
<img align="left" src="https://i.imgur.com/DAMWNib.png" width="400px" alt="" />
</a><br><br>

# Introduction
Notenverwaltung is a program that gives lecturers the opportunity to evaluate students consistently and fairly. Particular focus is placed on the independence of Internet services and the encryption of data. 
The app was developed during the winter semester 2017/2018 at the University of Regensburg, as main project of the course "Advanced Software Engineering".
<br><br>
<a>
<img align="left" src="https://i.imgur.com/yKiF0x9.jpg" alt="" />
</a><br>

Currently runs with:

- Angular v5.0.1
- Angular-CLI v1.5.0
- Electron v1.7.6
- Electron Packager v9.0.1

# Features

- Rating :pencil2:
- Group rating :pencil2: :family:
- Visualization :chart_with_upwards_trend:
- Export Data :arrow_up:
- Import Data :arrow_down:
- Create schema :memo:
- Change schema :pencil:
- Overview of students :clipboard:

# Getting Started

Install dependencies with npm :

``` bash
npm install
```
or recommended:
``` bash
yarn install
```

If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.  
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

## To build for development

- **in a terminal window** -> npm start  

## To build for production

- Using production variables (environments/index.prod.ts) :  `npm run electron:prod`

Your built files are in the /dist folder.

## Included Commands

|Command|Description|
|--|--|
|`npm run start:web`| Execute the app in the brower |
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

**Your application is optimised. Only the files of /dist folder are included in the executable.**


# Authors

* **Gina Maria Wolf** - [Github](https://github.com/GiMaWolf) 
* **Markus Guder** - [Github](https://github.com/marc101101) | [Twitter](https://twitter.com/Markus_Guder)
* **Ewald Reinhardt** - [Github](https://github.com/Owlwald)
* **Felix Kalley** - [Github](https://github.com/FelixKalley)


## License

Licensed under the [MIT](LICENSE.txt) License.

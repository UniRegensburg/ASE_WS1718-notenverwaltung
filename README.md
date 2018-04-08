<a>
<img align="left" src="https://i.imgur.com/DAMWNib.png" width="400px" alt="" />
</a><br><br>

# Introduction

Currently runs with:

- Angular v5.0.1
- Angular-CLI v1.5.0
- Electron v1.7.6
- Electron Packager v9.0.1

## Getting Started

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

# Contributors 

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/21662088?s=460&v=4" width="100px;"/><br /><sub>Gina Maria Wolf</sub>](https://github.com/GiMaWolf)<br />| [<img src="https://avatars2.githubusercontent.com/u/4850601?s=460&v=4" width="100px;"/><br /><sub>Ewald Reinhardt</sub>](https://github.com/Owlwald)<br />| [<img src="https://avatars0.githubusercontent.com/u/7516526?s=460&v=4" width="100px;"/><br /><sub>Felix Kalley</sub>](https://github.com/FelixKalley)<br />| [<img src="https://avatars2.githubusercontent.com/u/6153088?s=460&v=4" width="100px;"/><br /><sub>Markus Guder</sub>](https://github.com/marc101101)<br /> |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->


## License

Licensed under the [MIT](LICENSE.txt) License.

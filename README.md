# prettier-plugin-angular-module-sort-metadata


[Prettier](https://prettier.io/) plugin to sort angular metadata's

See [https://prettier.io/docs/en/plugins.html#using-plugins](https://prettier.io/docs/en/plugins.html#using-plugins)

## Usage

Add a `.prettierc.js` file to your project



```js
module.exports = {
  plugins: ['angular-module-sort-metadata'],
};
```

## Result

This file:

```js
import { CommonModule } from "@angular/common";
import { RouterModule, ZRouterModule } from "@angular/route";
import { NgModule } from "@angular/core";
import { NgXModule } from "@ng-x/x";
import { AppModule } from "@app/app-module";
import { AAmodule, ABmodule } from './modulea';
import { Bmodule } from './moduleb';
import { Cmodule } from './modulec';
import { Zmodule } from '@custom/moduleZ';
import DefaultModule from "@custom/withDefault"

/*  another comment */
@NgModule({
  declarations: [],
  imports: [
    // this is a comment 2
    Zmodule,
    Bmodule,
    NgXModule,    
    AppModule,
    CommonModule, // this is a comment    
    RouterModule,
    ABmodule,
    Cmodule,
    AAmodule,
    DefaultModule,
    ZRouterModule
  ]
})
export class ExampleModule {}
```

Will be formatted as:

```js
import { CommonModule } from '@angular/common';
import { RouterModule, ZRouterModule } from '@angular/route';
import { NgModule } from '@angular/core';
import { NgXModule } from '@ng-x/x';
import { AppModule } from '@app/app-module';
import { AAmodule, ABmodule } from './modulea';
import { Bmodule } from './moduleb';
import { Cmodule } from './modulec';
import { Zmodule } from '@custom/moduleZ';
import DefaultModule from '@custom/withDefault';

/*  another comment */
@NgModule({
  declarations: [],
  imports: [
    CommonModule, // this is a comment
    RouterModule,
    ZRouterModule,
    DefaultModule,
    NgXModule,
    // this is a comment 2
    Zmodule,
    AppModule,
    AAmodule,
    ABmodule,
    Bmodule,
    Cmodule,
  ],
})
export class ExampleModule {}

```

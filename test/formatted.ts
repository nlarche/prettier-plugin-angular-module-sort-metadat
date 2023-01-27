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

import { CommonModule } from "@angular/common";
import { RouterModule, ZRouterModule } from "@angular/route";
import { NgModule } from "@angular/core";
import { AAmodule, ABmodule } from './modulea';
import { Bmodule } from './moduleb';
import { Cmodule } from './modulec';
import { Zmodule } from '@custom/moduleZ';

/*  another comment */
@NgModule({
  declarations: [],
  imports: [
    // this is a comment 2
    Zmodule,
    Bmodule,

    CommonModule, // this is a comment
    RouterModule,
    ABmodule,
    Cmodule,
    AAmodule,
    ZRouterModule
  ]
})
export class GlossaryItemDetailModule {}

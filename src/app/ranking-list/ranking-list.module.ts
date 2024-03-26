import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingListPage } from './ranking-list.page';
import { RankingListRoutingModule } from './ranking-list-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RankingListPage],
  imports: [
    CommonModule,
    RankingListRoutingModule,
    TableModule,
    ButtonModule,
    SliderModule,
    InputTextModule,
    RippleModule,
    MultiSelectModule,
    DropdownModule,
    ProgressBarModule,
    FormsModule,
  ],
})
export class RankingListModule {}

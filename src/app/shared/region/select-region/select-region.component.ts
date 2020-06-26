import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  Optional,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { RegionQuery } from '../../../state/region/region.query';
import { trackByRegion } from '../../../model/region';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@ng-stack/forms';
import { debounceTime } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

export interface RegionModalOptions {
  idRegion?: number;
  title?: string;
}

@Component({
  selector: 'app-select-region',
  templateUrl: './select-region.component.html',
  styleUrls: ['./select-region.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectRegionComponent implements OnInit, AfterViewInit {
  constructor(
    public regionQuery: RegionQuery,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RegionModalOptions
  ) {}

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  trackByRegion = trackByRegion;

  regionSearchControl = new FormControl<string>(null);
  regionSearch$ = this.regionSearchControl.valueChanges.pipe(debounceTime(400));

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.data.idRegion) {
      setTimeout(() => {
        this.virtualScroll.scrollToIndex(
          this.regionQuery.getAll().findIndex(region => region.id === this.data.idRegion)
        );
      });
    }
  }
}

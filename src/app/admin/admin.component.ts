import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SideMenuService } from './side-menu/side-menu.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  constructor(public sideMenuService: SideMenuService) {}

  ngOnInit(): void {}
}

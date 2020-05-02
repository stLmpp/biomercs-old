import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthQuery } from '../../auth/state/auth.query';
import { LoadingService } from '../../core/loading/loading.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../auth/state/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('inOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  constructor(
    public authQuery: AuthQuery,
    public loadingService: LoadingService,
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  profile(): void {}

  admin(): void {}

  ngOnInit(): void {}
}

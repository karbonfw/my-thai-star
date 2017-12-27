import { Router } from '@angular/router';
import { LoginInfo } from '../../backend/backendModels/interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { LoginDataService } from '../../backend/login/login-data-service';
import { SnackBarService } from '../../core/snackService/snackService.service';
import { AuthService } from '../../core/authentication/auth.service';

@Injectable()
export class UserAreaService {

    constructor(public snackBar: SnackBarService,
        public router: Router,
        public authService: AuthService,
        public loginDataService: LoginDataService) { }

    login(username: string, password: string): void {
        this.loginDataService.login(username, password)
            .subscribe((res: any) => {
                this.authService.setToken(res.headers.get('Authorization'));
                this.loginDataService.getCurrentUser()
                    .subscribe((loginInfo: any) => {
                        this.authService.setLogged(true);
                        this.authService.setUser(loginInfo.name);
                        this.authService.setRole(loginInfo.role);
                        this.router.navigate(['orders']);
                        this.snackBar.openSnack('Login successful', 4000, 'green');
                    });
            }, (err: any) => {
                this.authService.setLogged(false);
                this.snackBar.openSnack(err.message, 4000, 'red');
            });
    }


    logout(): void {
        this.authService.setLogged(false);
        this.authService.setUser('');
        this.authService.setRole('CUSTOMER');
        this.authService.setToken('');
        this.snackBar.openSnack('Log out successful, come back soon!', 4000, 'black');
    }


}

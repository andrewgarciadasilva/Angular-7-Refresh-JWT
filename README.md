# Angular-7-Refresh-JWT
Refresh token JWT authorization on header of request  in angular project.


Let's create a simple project with interceptor and authguard.

- ng new AngularJWT
- cd AngularJWT
- ng serve --open
- open source code in code editor
- We will using the bootstrap 4 to login template:
	- For that we have install the bootstrap in AndularJWT project "npm install --save bootstrap@latest"
	- Add bootstrap in angular.json styles and scripts:
		"styles": [
              		"src/styles.css",
              		"node_modules/bootstrap/dist/css/bootstrap.min.css"
            		],
            	"scripts": ["node_modules/bootstrap/dist/css/bootstrap.min.css"]

- create a simple login component:
	- create folder sign 
	- in cmd write cd sign and then write:
		"ng generate component sign-in"
		"ng generate service sign-in"
		"ng generate guard auth"	
		"ng genrarte service request-interptor"
		"ng generate service user"
		"ng generate service user"

- in cmd write cd.. "ng generate component home"
- Copy html "view-source:https://getbootstrap.com/docs/4.1/examples/sign-in/" and css "https://getbootstrap.com/docs/4.1/examples/sign-in/signin.css" paste in sign-in component

Token service

Creat the following constants on top the file after imports:
	"const KEY = 'authToken';
	const TIME = 'timeToRefreshToken';
	const ID = 'id';"


create the following methods:

    "hasToken() {
        return !!this.getToken();
    }

    setToken(token) {
        window.localStorage.setItem(KEY, token);
    }


    getToken() {
        return window.localStorage.getItem(KEY);
    }

    removeToken() {
        window.localStorage.removeItem(KEY);
    }

    timeToRefreshToken(time) {
        window.localStorage.setItem(TIME, time);
    }

    getTimeToRefreshToken() {
        return window.localStorage.getItem(TIME);
    }
    removeTimeRefreshToken(){
        window.localStorage.removeItem(TIME);
    }"

User service 
	- Install jwt-decode "npm i jwt-decode"
	- imports:
		"import { TokenService } from './token.service';
		import * as jwt_decode from 'jwt-decode';
		import { BehaviorSubject } from 'rxjs';"

	- Inject dependency "constructor(private tokenService: TokenService)"
	
	- Create the following methods:
		"   decodeAndNotify() {
        const token = this.tokenService.getToken();
        // pegar o payload do token
        const claims = jwt_decode(token);
        const user: UserModel = {
            email: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            exp: claims['exp'],
            iss: claims['iss'],
            aud: claims['aud']
        };

        this.userSubject.next(user);
    }

    get user() {
        return this.userSubject.asObservable();
    }

    setUserToken(token: string) {
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }

    logOut() {
        this.tokenService.removeToken();
        this.tokenService.removeTimeRefreshToken();
        this.userSubject.next(null);
    }

    get isLogged() {
        return this.tokenService.hasToken();
    }

    get authorize() {
        return this.user;
    }

    setTimeRefreshToken() {
        let dateExp;

        this.user.subscribe(
            (data: UserModel) => {
                dateExp = data.exp;
                dateExp = dateExp.toString() + '000';
                // tslint:disable-next-line:radix
                dateExp = parseInt(dateExp);
            }
        );

        const newDateExp = new Date(dateExp);

        if (newDateExp.getMinutes() < 5) {
            newDateExp.setMinutes(newDateExp.getMinutes() + 55);
            newDateExp.setHours(newDateExp.getHours() - 1);

        } else if (newDateExp.getMinutes() >= 5 && newDateExp.getMinutes() <= 59) {
            newDateExp.setMinutes(newDateExp.getMinutes() - 5);

        }

        return this.tokenService.timeToRefreshToken(newDateExp);
    }
    removeTimeRefreshToken(){
        this.tokenService.removeTimeRefreshToken();
    }"

	- In constructor check if has token:
		"if (this.tokenService.hasToken()) {
			this.decodeAndNotify();
		}"

Sign-in service


- In login server inject dependecy "contructor(private http : HttpClient)"
- create method name "login" 
	"login(email: string, password: string) {
    this.http.post('your-api', { email, password })
      .pipe(
        tap((response: any) => {
          this.userService.setUserToken(response.token);
          this.userService.setTimeRefreshToken();
        })
      );
  }"



AuthGuard	


- Check if is logged:
	" if (!this.userService.isLogged) {
            this.router.navigate(['/signin']);
            return false;
        }else{
			return false;
		}"



RoutingModule

-Create route for home and insert canactivaet"{ path: '', component: HomeComponent canActivate: [AuthGuard] }"

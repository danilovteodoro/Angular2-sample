import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { catchError, map, tap} from 'rxjs/operators';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {HEROES} from './mock-heroes';
import { Hero } from './hero';
import {MessageService} from './message.service';

@Injectable()
export class HeroService {
  private heroesUrl = "api/heroes";


  constructor(
    private httpClient:HttpClient,
    private messageService:MessageService
  ) { }

  getHeroes():Observable<Hero[]>{
    // this.messageService.add("HeroService: fetched Heores");
    // return of(HEROES);
    return this.httpClient.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('feched heores')),
      catchError(this.handleError('getHeroes',[]))
    );
  }

  getHero(id:number):Observable<Hero>{
    // this.messageService.add('HeroService: fetched hero id='+id);
    // return of(HEROES.find(hero => hero.id === id));
    const url = this.heroesUrl+"/"+id;
    return this.httpClient.get<Hero>(url).pipe(
      tap(_ => this.log('fetched hero id='+id)),
      catchError(this.handleError<Hero>('Error in getting hero id='+id))
    );
  }
  
  private handleError<T>(operation='operation', result?:T) {
    return (error:any):Observable<T> =>{
      console.error(error);
      console.log(operation+' failed '+error.message);
      return of (result as T)
    }
  }

  log(msg:string):void{
    this.messageService.add(msg);
  }

  updateHero(hero:Hero):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json'})
    };

    return this.httpClient.put(this.heroesUrl,hero,httpOptions)
     .pipe(
       tap(_ => this.log('updated hero id=$id{hero.id}')),
       catchError(this.handleError<any>('Error in try update Hero '))
     );
  }

  addHero(hero:Hero):Observable<Hero>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json'})
    };
    return this.httpClient.post<Hero>(this.heroesUrl,hero,httpOptions)
     .pipe(
       tap(hero => this.log('added new hero \w id = '+hero.id)),
       catchError(this.handleError<Hero>("error in add new Hero"))
     );
  }

  deleteHero(hero:Hero):Observable<Hero>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json'})
    };
    const url = this.heroesUrl+"/"+hero.id;
    return this. httpClient.delete<Hero>(url,httpOptions)
    .pipe(
      tap(_ => this.log("deleted Hero id : "+hero.id)),
      catchError(this.handleError<Hero>('deleted hero'))
    );
  }

  searchHeroes(term:string):Observable<Hero[]>{
    if(!term.trim()){
      return of();
    }
    return this.httpClient.get<Hero[]>('api/heroes/?name='+term)
    .pipe(
      tap(_ => this.log("Found heroes matching "+term)),
      catchError(this.handleError<Hero[]>("searchHeroes",[]))
    );
  }

}

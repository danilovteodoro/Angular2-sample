import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero:Hero;

  constructor(
    private route:ActivatedRoute, //mantém informação de rota.
    private heroService:HeroService,
    private location:Location //angular service para que interage com o browser
  ) {}

  ngOnInit() {
    this.getHero();
  }

  getHero():void{
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
    .subscribe(hero=>{
      this.hero = hero;
      console.log(this.hero);
    });
  }

  goBack():void{
    this.location.back();
  }

  save(){
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
  

}

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss'],
})
export class ImgComponent
  // implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() img: string = '';
  @Input() alt: string = '';
  @Output() loaded = new EventEmitter<string>();
  imageDefault = './assets/images/default.png';

  constructor() {
    // before render
    // NO async -- once time
    // console.log('constructor', 'imgValue => ', this.img);
  }

  protected imgError() {
    this.img = this.imageDefault;
  }

  /*
  ngOnChanges(): void {
    // before render
    // Check changes inputs -- many times
    console.log('ngOnChanges', 'imgValue => ', this.img);
  }


  ngOnInit(): void {
    // before render
    // Async - fetch - promises etc -- once time
    console.log('ngOnInit', 'imgValue => ', this.img);
  }

  ngAfterViewInit(): void {
    // After render
    // handler children
    console.log('ngAfterViewInit');
  }

  ngOnDestroy() {
    // on destroy component
    console.log('ngOnDestroy');
  }
*/
  imgLoaded() {
    // console.log('Loaded hijo');
    this.loaded.emit(this.img);
  }
}

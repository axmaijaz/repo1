// import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
// import { Subscription, Observable, interval } from 'rxjs';
// import { take } from 'rxjs/operators';
    
//     // import { Observable, interval, Subscription } from 'rxjs';
//     // import { take } from 'rxjs/operators';
//     // import "rxjs/add/operator/map";
//     // import { map } from 'rxjs/operators';
//     @Component({
//       selector: 'counter',
//       template: `<div class="counter-parent">
//         <span>{{currentValue}}</span>
//     </div>`,
//       styles: [`h1 { font-family: Lato; }`],
//       changeDetection: ChangeDetectionStrategy.OnPush
//     })
//     export class CounterComponent  {
//       @Input()
//       startAt = 1;
    
//       @Input()
//       showTimeRemaining = true;
    
//       @Output()
//       counterState = new EventEmitter();
    
//       private currentValue = '';
    
//       private currentSubscription: Subscription;
    
//       constructor(private changeDetector:ChangeDetectorRef) { }
    
//       public start() {
//         this.currentValue = this.formatValue(this.startAt);
//         this.changeDetector.detectChanges();
    
//         const t: Observable<number> = interval(1000);
//         this.currentSubscription = t.pipe(take(this.startAt)).map(v => this.startAt - (v + 1)).subscribe(v => {
//             this.currentValue = this.formatValue(v);
//             this.changeDetector.detectChanges();
//           }, err => {
//             this.counterState.error(err);
//           }, () => {
//             this.currentSubscription.unsubscribe();
//             this.currentValue = '00:00';
//             this.counterState.emit('COMPLETE');
//             this.changeDetector.detectChanges();
//           });
//         }
        
//    public formatValue(v) {
//       const minutes = Math.floor(v / 60);
//               const formattedMinutes = '' + (minutes > 9 ? minutes : '0' + minutes);
//               const seconds = v % 60;
//               const formattedSeconds = '' + (seconds > 9 ? seconds : '0' + seconds);
    
//       return `${formattedMinutes}:${formattedSeconds}`;
//     }
    
//       public stop() {
//           this.currentSubscription.unsubscribe();
//           this.counterState.emit('ABORTED');
//       }
// }
    
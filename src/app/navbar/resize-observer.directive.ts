import { Directive, ElementRef, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
// import ResizeObserver from 'resize-observer-polyfill'; //not needed really since > Chrome 64

const entriesMap = new WeakMap();

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entriesMap.has(entry.target)) {
      const comp = entriesMap.get(entry.target);
      comp._resizeCallback({entry: entry});
    }
  }
});

@Directive({ selector: '[resizeObserver]' })
export class ResizeObserverDirective implements OnDestroy {
  @Output()
  resize = new EventEmitter();

  constructor(private el: ElementRef) {
    const target = this.el.nativeElement;
    entriesMap.set(target, this);
    ro.observe(target);
  }

  _resizeCallback({entry}: { entry: any }) {
    console.log(entry.contentRect);
    this.resize.emit(entry);
  }

  ngOnDestroy() {
    const target = this.el.nativeElement;
    ro.unobserve(target);
    entriesMap.delete(target);
  }
}

import {
  AfterContentInit,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../../core/window.service';
import { fromEvent, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { ScrollBoosterContentDirective } from './scroll-booster-content.directive';

const getFullWidth = elem => Math.max(elem.offsetWidth, elem.scrollWidth);
const getFullHeight = elem => Math.max(elem.offsetHeight, elem.scrollHeight);

const textNodeFromPoint = (element: Element, x: number, y: number, document: Document) => {
  const nodes = element.childNodes;
  const range = document.createRange();
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.nodeType !== 3) {
      continue;
    }
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    if (x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) {
      return node;
    }
  }
  return false;
};

const clearTextSelection = (window: Window, document: Document) => {
  const selection = window.getSelection ? window.getSelection() : (document as any).selection;
  if (!selection) {
    return;
  }
  if (selection.removeAllRanges) {
    selection.removeAllRanges();
  } else if (selection.empty) {
    selection.empty();
  }
};

const START_COORDINATES: ScrollBoosterCoordinates = { x: 0, y: 0 };

export interface ScrollBoosterCoordinates {
  x: number;
  y: number;
}

export interface ScrollBoosterMetrics {
  width: number;
  height: number;
}

export interface ScrollBoosterDirection {
  from: number;
  to: number;
}

export interface ScrollBoosterUpdateEventBorderCollision {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export type ScrollBoosterDragDirection = 'horizontal' | 'vertical';

export interface ScrollBoosterState {
  isMoving: boolean;
  isDragging: boolean;
  position: ScrollBoosterCoordinates;
  dragOffset: ScrollBoosterCoordinates;
  dragAngle: number;
  borderCollision: ScrollBoosterUpdateEventBorderCollision;
}

export interface ScrollBoosterEvent {
  state: ScrollBoosterState;
  event: MouseEvent;
}

export type ScrollBoosterShouldScroll = (state: ScrollBoosterState, event: MouseEvent) => boolean;

@Directive({
  selector: '[scrollBooster]',
  exportAs: 'scrollBooster',
})
export class ScrollBoosterDirective implements AfterContentInit, OnInit, OnDestroy {
  constructor(
    private elementRef: ElementRef<Element>,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private ngZone: NgZone
  ) {
    this.nativeElement = elementRef.nativeElement;
  }

  private _destroy$ = new Subject();

  private readonly nativeElement: Element;

  private get contentElement(): Element {
    return this.sbContentChild?.elementRef.nativeElement ?? this.nativeElement.children[0];
  }

  @Input() clickThreshold = 10;
  @Input() direction: 'all' | ScrollBoosterDragDirection = 'all';
  @Input() scrollMode: 'transform' | 'native' = 'transform';
  @Input() bounce = true;
  @Input()
  get bounceForce(): number {
    return this._bounceForce;
  }
  set bounceForce(value: number) {
    if (value < 0 && value > 1.5) {
      value = 0.1;
    }
    this._bounceForce = value;
  }
  private _bounceForce = 0.1;

  @Input() friction = 0.1;
  @Input() textSelection = false;
  @Input() inputsFocus = true;
  @Input() emulateScroll = false;
  @Input() preventDefaultOnEmulateScroll: ScrollBoosterDragDirection | undefined;
  @Input() preventPointerMoveDefault = true;
  @Input() lockScrollOnDragDirection: ScrollBoosterDragDirection | 'all' | undefined;
  @Input() pointerDownPreventDefault = true;
  @Input() dragDirectionTolerance = 40;

  @Input() disabled: boolean;

  @Output() sbUpdate = new EventEmitter<ScrollBoosterState>();
  @Output() sbPointerdown = new EventEmitter<ScrollBoosterEvent>();
  @Output() sbPointermove = new EventEmitter<ScrollBoosterEvent>();
  @Output() sbPointerup = new EventEmitter<ScrollBoosterEvent>();
  @Output() sbWheel = new EventEmitter<ScrollBoosterEvent>();

  @ContentChild(ScrollBoosterContentDirective) sbContentChild: ScrollBoosterContentDirective;

  private updateMetrics$ = new Subject();

  isDragging = false;
  isTargetScroll = false;
  isScrolling = false;
  isRunning = false;

  @HostBinding('class.moving')
  get classIsMoving(): boolean {
    return this.isDragging && this.isMoving();
  }

  private position: ScrollBoosterCoordinates = { ...START_COORDINATES };
  private velocity: ScrollBoosterCoordinates = { ...START_COORDINATES };
  private dragStartPosition: ScrollBoosterCoordinates = { ...START_COORDINATES };
  private dragOffset: ScrollBoosterCoordinates = { ...START_COORDINATES };
  private clientOffset: ScrollBoosterCoordinates = { ...START_COORDINATES };
  private dragPosition: ScrollBoosterCoordinates = { ...START_COORDINATES };
  private targetPosition: ScrollBoosterCoordinates = { ...START_COORDINATES };
  private scrollOffset: ScrollBoosterCoordinates = { ...START_COORDINATES };

  private rafID: number = null;

  private viewport: ScrollBoosterMetrics;
  private content: ScrollBoosterMetrics;
  private edgeX: ScrollBoosterDirection;
  private edgeY: ScrollBoosterDirection;

  private dragOrigin: ScrollBoosterCoordinates = { x: 0, y: 0 };
  private clientOrigin: ScrollBoosterCoordinates = { x: 0, y: 0 };
  private dragDirection: ScrollBoosterDragDirection = null;
  private wheelTimer: any = null;

  @Input() shouldScroll: ScrollBoosterShouldScroll = () => true;

  updateMetrics(): void {
    this.updateMetrics$.next();
  }

  private _updateMetrics(): void {
    if (!this.contentElement) return;
    this.viewport = {
      width: this.nativeElement.clientWidth,
      height: this.nativeElement.clientHeight,
    };
    this.content = {
      width: getFullWidth(this.contentElement),
      height: getFullHeight(this.contentElement),
    };
    this.edgeX = {
      from: Math.min(-this.content.width + this.viewport.width, 0),
      to: 0,
    };
    this.edgeY = {
      from: Math.min(-this.content.height + this.viewport.height, 0),
      to: 0,
    };
    this.sbUpdate.emit(this.getState());
    this.startAnimationLoop();
  }

  getState(): ScrollBoosterState {
    return {
      isMoving: this.isMoving(),
      isDragging: !!((this.dragOffset?.x ?? 0) || (this.dragOffset?.y ?? 0)),
      position: { x: -(this.position?.x ?? 0), y: -(this.position?.y ?? 0) },
      dragOffset: this.dragOffset,
      dragAngle: this.getDragAngle(this.clientOffset?.x ?? 0, this.clientOffset?.y ?? 0),
      borderCollision: {
        left: (this.position?.x ?? 0) >= (this.edgeX?.to ?? 0),
        right: (this.position?.x ?? 0) <= (this.edgeX?.from ?? 0),
        top: (this.position?.y ?? 0) >= (this.edgeY?.to ?? 0),
        bottom: (this.position?.y ?? 0) <= (this.edgeY?.from ?? 0),
      },
    };
  }

  startAnimationLoop(): void {
    this.isRunning = true;
    this.ngZone.runOutsideAngular(() => {
      cancelAnimationFrame(this.rafID);
      this.rafID = requestAnimationFrame(() => this.animate());
    });
  }

  animate(): void {
    if (!this.isRunning) {
      return;
    }
    this.updateScrollPosition();
    // stop animation loop if nothing moves
    if (!this.isMoving()) {
      this.isRunning = false;
      this.isTargetScroll = false;
    }
    const state = this.getState();
    this.setContentPosition(state);
    this.sbUpdate.emit(state);
    this.rafID = requestAnimationFrame(() => this.animate());
  }

  updateScrollPosition(): void {
    this.applyEdgeForce();
    this.applyDragForce();
    this.applyScrollForce();
    this.applyTargetForce();

    const inverseFriction = 1 - this.friction;
    this.velocity = {
      x: this.velocity.x * inverseFriction,
      y: this.velocity.y * inverseFriction,
    };
    if (this.direction !== 'vertical') {
      this.position = { ...this.position, x: this.position.x + this.velocity.x };
    }
    if (this.direction !== 'horizontal') {
      this.position = { ...this.position, y: this.position.y + this.velocity.y };
    }
    // disable bounce effect
    if ((!this.bounce || this.isScrolling) && !this.isTargetScroll) {
      this.position = {
        x: Math.max(Math.min(this.position.x, this.edgeX.to), this.edgeX.from),
        y: Math.max(Math.min(this.position.y, this.edgeY.to), this.edgeY.from),
      };
    }
  }

  applyForce(force: ScrollBoosterCoordinates): void {
    this.velocity = {
      x: this.velocity.x + force.x,
      y: this.velocity.y + force.y,
    };
  }

  applyEdgeForce(): void {
    if (!this.bounce || this.isDragging) {
      return;
    }
    // scrolled past viewport edges
    const beyondXFrom = this.position.x < this.edgeX.from;
    const beyondXTo = this.position.x > this.edgeX.to;
    const beyondYFrom = this.position.y < this.edgeY.from;
    const beyondYTo = this.position.y > this.edgeY.to;
    const beyondX = beyondXFrom || beyondXTo;
    const beyondY = beyondYFrom || beyondYTo;

    if (!beyondX && !beyondY) {
      return;
    }

    const edge = {
      x: beyondXFrom ? this.edgeX.from : this.edgeX.to,
      y: beyondYFrom ? this.edgeY.from : this.edgeY.to,
    };

    const distanceToEdge = {
      x: edge.x - this.position.x,
      y: edge.y - this.position.y,
    };

    const force = {
      x: distanceToEdge.x * this._bounceForce,
      y: distanceToEdge.y * this._bounceForce,
    };

    const restPosition = {
      x: this.position.x + (this.velocity.x + force.x) / this.friction,
      y: this.position.y + (this.velocity.y + force.y) / this.friction,
    };

    if (
      (beyondXFrom && restPosition.x >= this.edgeX.from) ||
      (beyondXTo && restPosition.x <= this.edgeX.to)
    ) {
      force.x = distanceToEdge.x * this._bounceForce - this.velocity.x;
    }

    if (
      (beyondYFrom && restPosition.y >= this.edgeY.from) ||
      (beyondYTo && restPosition.y <= this.edgeY.to)
    ) {
      force.y = distanceToEdge.y * this._bounceForce - this.velocity.y;
    }

    this.applyForce({
      x: beyondX ? force.x : 0,
      y: beyondY ? force.y : 0,
    });
  }

  applyDragForce(): void {
    if (!this.isDragging) {
      return;
    }

    const dragVelocity = {
      x: this.dragPosition.x - this.position.x,
      y: this.dragPosition.y - this.position.y,
    };

    this.applyForce({
      x: dragVelocity.x - this.velocity.x,
      y: dragVelocity.y - this.velocity.y,
    });
  }

  applyScrollForce(): void {
    if (!this.isScrolling) {
      return;
    }

    this.applyForce({
      x: this.scrollOffset.x - this.velocity.x,
      y: this.scrollOffset.y - this.velocity.y,
    });

    this.scrollOffset = {
      x: 0,
      y: 0,
    };
  }

  applyTargetForce(): void {
    if (!this.isTargetScroll) {
      return;
    }

    this.applyForce({
      x: (this.targetPosition.x - this.position.x) * 0.08 - this.velocity.x,
      y: (this.targetPosition.y - this.position.y) * 0.08 - this.velocity.y,
    });
  }

  isMoving(): boolean {
    return (
      this.isDragging ||
      this.isScrolling ||
      Math.abs(this.velocity?.x ?? 0) >= 0.01 ||
      Math.abs(this.velocity?.y ?? 0) >= 0.01
    );
  }

  scrollTo(position?: ScrollBoosterCoordinates): void {
    this.isTargetScroll = true;
    this.targetPosition = { x: -position.x || 0, y: -position.y || 0 };
    this.startAnimationLoop();
  }

  scrollToItem(id: number | string): void {
    const item = this.sbContentChild.dragItems.find(o => o.id === id);
    if (!item) return;
    let { top, left } = item.elementRef.nativeElement.getBoundingClientRect();
    top = this.nativeElement.getBoundingClientRect().top - top;
    left = this.nativeElement.getBoundingClientRect().left - left;
    this.scrollTo({
      x:
        left > 0
          ? Math.max(Math.abs(this.position.x) - left, 0)
          : Math.min(this.content.width - this.viewport.width, Math.abs(this.position.x) + Math.abs(left)),
      y:
        top > 0
          ? Math.max(Math.abs(this.position.y) - top, 0)
          : Math.min(this.content.height - this.viewport.height, Math.abs(this.position.y) + Math.abs(top)),
    });
  }

  setPosition(position?: ScrollBoosterCoordinates): void {
    this.velocity = { x: 0, y: 0 };
    this.position = { x: -position.x || 0, y: -position.y || 0 };
    this.startAnimationLoop();
  }

  getDragAngle(x: number, y: number): number {
    return Math.round(Math.atan2(x, y) * (180 / Math.PI));
  }

  getDragDirection(angle: number, tolerance: number): ScrollBoosterDragDirection {
    const absAngle = Math.abs(90 - Math.abs(angle));
    if (absAngle <= 90 - tolerance) {
      return 'horizontal';
    } else {
      return 'vertical';
    }
  }

  setContentPosition(state: ScrollBoosterState): void {
    if (this.scrollMode === 'transform') {
      this.renderer2.setStyle(
        this.contentElement,
        'transform',
        `translate(${-state.position.x}px, ${-state.position.y}px)`
      );
    } else if (this.scrollMode === 'native') {
      this.renderer2.setProperty(this.nativeElement, 'scrollTop', state.position.y);
      this.renderer2.setProperty(this.nativeElement, 'scrollLeft', state.position.x);
    }
  }

  setDragPosition($event: MouseEvent): void {
    if (!this.isDragging) {
      return;
    }
    const { pageX, pageY, clientX, clientY } = $event;

    this.dragOffset = { x: pageX - this.dragOrigin.x, y: pageY - this.dragOrigin.y };
    this.clientOffset = { x: clientX - this.clientOrigin.x, y: clientY - this.clientOrigin.y };

    // get dragDirection if offset threshold is reached
    if (
      (Math.abs(this.clientOffset.x) > 5 && !this.dragDirection) ||
      (Math.abs(this.clientOffset.y) > 5 && !this.dragDirection)
    ) {
      this.dragDirection = this.getDragDirection(
        this.getDragAngle(this.clientOffset.x, this.clientOffset.y),
        this.dragDirectionTolerance
      );
    }

    // prevent scroll if not expected scroll direction
    if (this.lockScrollOnDragDirection && this.lockScrollOnDragDirection !== 'all') {
      this.dragPosition = {
        x: this.dragStartPosition.x,
        y: this.dragStartPosition.y,
      };
    } else {
      this.dragPosition = {
        x: this.dragStartPosition.x + this.dragOffset.x,
        y: this.dragStartPosition.y + this.dragOffset.y,
      };
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown($event: MouseEvent): void {
    this.sbPointerdown.emit({ state: this.getState(), event: $event });

    const { pageX, pageY, clientX, clientY } = $event;

    const viewport = this.nativeElement;
    const rect = viewport.getBoundingClientRect();

    // click on vertical scrollbar
    if (clientX - rect.left >= viewport.clientLeft + viewport.clientWidth) {
      return;
    }

    // click on horizontal scrollbar
    if (clientY - rect.top >= viewport.clientTop + viewport.clientHeight) {
      return;
    }

    // interaction disabled by user
    if (this.disabled || !this.shouldScroll(this.getState(), $event)) {
      return;
    }

    // disable right mouse button scroll
    if ($event.button === 2) {
      return;
    }

    // focus on form input elements
    const formNodes = ['input', 'textarea', 'button', 'select', 'label'];
    if (this.inputsFocus && formNodes.indexOf(($event.target as Element).nodeName.toLowerCase()) > -1) {
      return;
    }

    // handle text selection
    if (this.textSelection) {
      const textNode = textNodeFromPoint($event.target as Element, clientX, clientY, this.document);
      if (textNode) {
        return;
      }
      clearTextSelection(this.window, this.document);
    }

    this.isDragging = true;

    this.dragOrigin = { x: pageX, y: pageY };
    this.clientOrigin = { x: clientX, y: clientY };
    this.dragStartPosition = { x: this.position.x, y: this.position.y };

    this.setDragPosition($event);
    this.startAnimationLoop();

    if (this.pointerDownPreventDefault) {
      $event.preventDefault();
    }
  }

  @HostListener('window:mousemove', ['$event']) // WINDOW
  onPointermove($event: MouseEvent): void {
    if (this.isDragging) {
      // prevent default scroll if scroll direction is locked
      if (
        $event.cancelable &&
        (this.lockScrollOnDragDirection === 'all' || this.lockScrollOnDragDirection === this.dragDirection)
      ) {
        $event.preventDefault();
      }
      this.setDragPosition($event);
      this.sbPointermove.emit({ state: this.getState(), event: $event });
    }
  }

  @HostListener('window:mouseup', ['$event']) // WINDOW
  onPointerup($event: MouseEvent): void {
    this.isDragging = false;
    this.dragDirection = null;
    this.sbPointerup.emit({ state: this.getState(), event: $event });
  }

  @HostListener('wheel', ['$event'])
  onWheel($event: WheelEvent): void {
    const state = this.getState();
    if (!this.emulateScroll) {
      return;
    }

    this.velocity = { x: 0, y: 0 };
    this.isScrolling = true;

    this.scrollOffset = { x: -$event.deltaX, y: -$event.deltaY };

    this.sbWheel.emit({ state, event: $event });

    this.startAnimationLoop();

    clearTimeout(this.wheelTimer);
    this.wheelTimer = setTimeout(() => (this.isScrolling = false), 80);

    // get (trackpad) scrollDirection and prevent default events
    if (
      this.preventDefaultOnEmulateScroll &&
      this.getDragDirection(
        this.getDragAngle(-$event.deltaX, -$event.deltaY),
        this.dragDirectionTolerance
      ) === this.preventDefaultOnEmulateScroll
    ) {
      $event.preventDefault();
    }
  }

  @HostListener('scroll')
  onScroll(): void {
    const { scrollLeft, scrollTop } = this.nativeElement;
    if (Math.abs(this.position.x + scrollLeft) > 3) {
      this.position = { ...this.position, x: -scrollLeft };
      this.velocity = { ...this.velocity, x: 0 };
    }
    if (Math.abs(this.position.y + scrollTop) > 3) {
      this.position = { ...this.position, y: -scrollTop };
      this.velocity = { ...this.velocity, y: 0 };
    }
  }

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    const state = this.getState();
    const dragOffsetX = this.direction !== 'vertical' ? state.dragOffset.x : 0;
    const dragOffsetY = this.direction !== 'horizontal' ? state.dragOffset.y : 0;
    if (Math.max(Math.abs(dragOffsetX), Math.abs(dragOffsetY)) > this.clickThreshold) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  moveRight(): void {
    if (Math.abs(this.position.x) > this.content.width - 10) {
      return;
    }
    const distance =
      this.sbContentChild?.dragItems.toArray()[0]?.elementRef.nativeElement.getBoundingClientRect().width ??
      0;
    const move = Math.abs(this.position.x) + distance;
    this.scrollTo({
      x: Math.min(this.content.width - this.viewport.width, move),
      y: 0,
    });
  }

  moveLeft(): void {
    if (Math.abs(this.position.x) < 10) {
      return;
    }
    const distance =
      this.sbContentChild?.dragItems.toArray()[0]?.elementRef.nativeElement.getBoundingClientRect().width ??
      0;
    this.scrollTo({
      x: Math.max(Math.abs(this.position.x) - distance, 0),
      y: 0,
    });
  }

  moveUp(): void {
    if (Math.abs(this.position.y) < 10) {
      return;
    }
    const distance =
      this.sbContentChild?.dragItems.toArray()[0]?.elementRef.nativeElement.getBoundingClientRect().height ??
      0;
    this.scrollTo({
      x: 0,
      y: Math.max(Math.abs(this.position.y) - distance, 0),
    });
  }

  moveDown(): void {
    if (Math.abs(this.position.y) > this.content.height - 10) {
      return;
    }
    const distance =
      this.sbContentChild?.dragItems.toArray()[0]?.elementRef.nativeElement.getBoundingClientRect().height ??
      0;
    const move = Math.abs(this.position.y) + distance;
    this.scrollTo({
      x: 0,
      y: Math.min(this.content.height - this.viewport.height, move),
    });
  }

  ngOnInit(): void {
    fromEvent(this.window, 'resize')
      .pipe(takeUntil(this._destroy$), auditTime(100))
      .subscribe(() => {
        this.updateMetrics();
      });
    this.updateMetrics$.pipe(takeUntil(this._destroy$), auditTime(100)).subscribe(() => {
      this._updateMetrics();
    });
  }

  ngAfterContentInit(): void {
    this.updateMetrics();
    this.sbContentChild?.dragItems.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.updateMetrics();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}

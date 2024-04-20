import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {EMPTY_ARRAY, TUI_DEFAULT_MATCHER} from '@taiga-ui/cdk';
import {TuiDataListComponent, tuiIsEditingKey} from '@taiga-ui/core';

interface Items<T> {
  readonly items: readonly T[];
  readonly name: string;
}

@Component({
  selector: 'custom-list',
  templateUrl: './custom-list.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomListComponent<T> {
  @Input()
  items: ReadonlyArray<Items<T>> = [];

  value = '';



  onArrowDown<T>(list: TuiDataListComponent<T>, event: Event): void {
    list.onFocus(event, true);
  }

  onKeyDown(key: string, element: HTMLElement | null): void {
    if (element && tuiIsEditingKey(key)) {
      element.focus({preventScroll: true});
    }
  }
}

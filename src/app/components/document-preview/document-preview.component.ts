import {ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PolymorpheusContent, PolymorpheusModule} from "@tinkoff/ng-polymorpheus";
import {tuiClamp, TuiSwipe, TuiSwipeModule} from "@taiga-ui/cdk";
import {TuiAlertService, TuiButtonModule, TuiDialogContext} from "@taiga-ui/core";
import {TuiPreviewDialogService, TuiPreviewModule} from "@taiga-ui/addon-preview";

@Component({
  selector: 'app-document-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiPreviewModule, TuiButtonModule, PolymorpheusModule, TuiSwipeModule],
  templateUrl: './document-preview.component.html',
  styleUrl: './document-preview.component.less'
})
export class DocumentPreviewComponent implements OnInit{
  @ViewChild('preview')
  readonly preview?: TemplateRef<TuiDialogContext>;

  @ViewChild('contentSample')
  readonly contentSample?: TemplateRef<Record<string, unknown>>;

  index = 0;
  length = 2;

  constructor(
    @Inject(TuiPreviewDialogService)
    private readonly previewService: TuiPreviewDialogService,
    @Inject(TuiAlertService)
    private readonly alerts: TuiAlertService,
  ) {}

  ngOnInit() {
    this.previewService.open(this.preview).subscribe()
  }

  get title(): string {
    return this.index === 0 ? 'Transaction cert.jpg' : 'My face.jpg';
  }

  get previewContent(): PolymorpheusContent {
    return this.index === 0 && this.contentSample
      ? this.contentSample
      : 'https://avatars.githubusercontent.com/u/10106368';
  }

  show(): void {
    this.previewService.open(this.preview || '').subscribe({
      complete: () => console.info('complete'),
    });
  }

  download(): void {
    this.alerts.open('Downloading...').subscribe();
  }

  delete(): void {
    this.alerts.open('Deleting...').subscribe();
  }

  onSwipe(swipe: TuiSwipe): void {
    if (swipe.direction === 'left') {
      this.index = tuiClamp(this.index + 1, 0, this.length - 1);
    }

    if (swipe.direction === 'right') {
      this.index = tuiClamp(this.index - 1, 0, this.length - 1);
    }
  }
}

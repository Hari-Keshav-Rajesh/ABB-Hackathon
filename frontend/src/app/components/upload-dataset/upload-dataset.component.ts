import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-dataset',
  standalone: false,
  templateUrl: './upload-dataset.component.html',
  styleUrls: ['./upload-dataset.component.css']
})
export class UploadDatasetComponent {
  @Output() stepCompleted = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();

  fileSelected = false;
  datasetSummary = {
    fileName: 'bosch.csv',
    totalRecords: 14704,
    totalColumns: 5,
    passRate: 70,
    dateRange: '2021-01-01 to 2021-01-02'
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Ignore file content and show static summary
      this.fileSelected = true;
      this.stepCompleted.emit();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      // Ignore file content and show static summary
      this.fileSelected = true;
      this.stepCompleted.emit();
    }
  }

  onNext() {
    this.nextStep.emit();
  }
}

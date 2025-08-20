import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IntelliInspect';
  currentStep = 0;
  stepCompleted = [false, false, false, false];

  steps = [
    { label: 'Upload Dataset', completed: false },
    { label: 'Date Ranges', completed: false },
    { label: 'Model Training', completed: false },
    { label: 'Simulation', completed: false }
  ];

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.steps[this.currentStep].completed = true;
      this.stepCompleted[this.currentStep] = true;
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(index: number) {
    // Only allow navigation to completed steps or the next step
    if (index <= this.currentStep || this.stepCompleted[index - 1]) {
      this.currentStep = index;
    }
  }

  onStepCompleted(stepIndex: number) {
    this.stepCompleted[stepIndex] = true;
    this.steps[stepIndex].completed = true;
  }
}

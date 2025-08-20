import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-date-ranges',
  standalone: false,
  templateUrl: './date-ranges.component.html',
  styleUrls: ['./date-ranges.component.css']
})
export class DateRangesComponent implements OnInit {
  @Output() stepCompleted = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();

  trainingForm!: FormGroup;
  testingForm!: FormGroup;
  simulationForm!: FormGroup;
  
  validated = false;
  validationMessage = '';

  // Chart data
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Training',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 3200, 2800, 3500, 4000, 2500],
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
        borderWidth: 1
      },
      {
        label: 'Testing',
        data: [400, 600, 900, 1500, 600, 900, 1350, 960, 840, 1050, 1200, 750],
        backgroundColor: '#ff9800',
        borderColor: '#f57c00',
        borderWidth: 1
      },
      {
        label: 'Simulation',
        data: [200, 300, 450, 750, 300, 450, 675, 480, 420, 525, 600, 375],
        backgroundColor: '#2196f3',
        borderColor: '#1976d2',
        borderWidth: 1
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthly Data Volume Distribution'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Records Count'
        }
      }
    }
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());

    this.trainingForm = this.fb.group({
      startDate: [twoMonthsAgo, Validators.required],
      endDate: [oneMonthAgo, Validators.required]
    });

    this.testingForm = this.fb.group({
      startDate: [oneMonthAgo, Validators.required],
      endDate: [new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15), Validators.required]
    });

    this.simulationForm = this.fb.group({
      startDate: [new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15), Validators.required],
      endDate: [today, Validators.required]
    });
  }

  validateRanges() {
    if (this.trainingForm.valid && this.testingForm.valid && this.simulationForm.valid) {
      // Simulate validation delay
      setTimeout(() => {
        this.validated = true;
        this.validationMessage = 'Date ranges validated successfully!';
        this.stepCompleted.emit();
      }, 1000);
    }
  }

  onPrevious() {
    this.previousStep.emit();
  }

  onNext() {
    this.nextStep.emit();
  }
}

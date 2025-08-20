import { Component, EventEmitter, Output } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-model-training',
  standalone: false,
  templateUrl: './model-training.component.html',
  styleUrls: ['./model-training.component.css']
})
export class ModelTrainingComponent {
  @Output() stepCompleted = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();

  isTraining = false;
  trainingComplete = false;
  
  metrics = {
    accuracy: 92,
    precision: 90,
    recall: 88,
    f1: 89
  };

  confusionMatrix = {
    tp: 1234,
    tn: 4567,
    fp: 123,
    fn: 98
  };

  // Line chart for training progress
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        label: 'Accuracy',
        data: [0.65, 0.72, 0.78, 0.82, 0.85, 0.87, 0.89, 0.90, 0.91, 0.92],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Loss',
        data: [1.2, 0.9, 0.7, 0.5, 0.4, 0.35, 0.3, 0.25, 0.22, 0.19],
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Training Progress: Accuracy vs Loss'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Epoch'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Accuracy'
        },
        min: 0,
        max: 1
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Loss'
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        max: 1.5
      }
    }
  };

  // Donut chart for confusion matrix
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['True Positive', 'True Negative', 'False Positive', 'False Negative'],
    datasets: [{
      data: [1234, 4567, 123, 98],
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'],
      borderColor: ['#388e3c', '#1976d2', '#f57c00', '#d32f2f'],
      borderWidth: 2
    }]
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      title: {
        display: true,
        text: 'Confusion Matrix'
      }
    }
  };

  trainModel() {
    this.isTraining = true;
    this.trainingComplete = false;

    // Simulate training delay
    setTimeout(() => {
      this.isTraining = false;
      this.trainingComplete = true;
      this.stepCompleted.emit();
    }, 3000);
  }

  onPrevious() {
    this.previousStep.emit();
  }

  onNext() {
    this.nextStep.emit();
  }
}

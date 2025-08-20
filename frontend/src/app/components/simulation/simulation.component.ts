import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DataService } from '../../services/data.service';

export interface SimulationRow {
  time: string;
  sampleId: string;
  prediction: string;
  confidence: number;
  temperature: number;
  pressure: number;
  humidity: number;
}

@Component({
  selector: 'app-simulation',
  standalone: false,
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnDestroy {
  @Output() stepCompleted = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();

  isRunning = false;
  isCompleted = false;
  simulationData: SimulationRow[] = [];
  
  stats = {
    totalPredictions: 0,
    passCount: 0,
    failCount: 0,
    avgConfidence: 0
  };

  displayedColumns: string[] = ['time', 'sampleId', 'prediction', 'confidence', 'temperature', 'pressure', 'humidity'];
  
  private simulationSubscription?: Subscription;

  // Quality Score Line Chart
  public lineChartType: ChartType = 'line';
  public qualityChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Quality Score',
      data: [],
      borderColor: '#2196f3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      fill: true,
      tension: 0.4
    }]
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
        text: 'Quality Score Over Time'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Quality Score'
        },
        min: 60,
        max: 100
      }
    }
  };

  // Pass/Fail Distribution Donut Chart
  public doughnutChartType: ChartType = 'doughnut';
  public distributionChartData: ChartData<'doughnut'> = {
    labels: ['Pass', 'Fail'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4caf50', '#f44336'],
      borderColor: ['#388e3c', '#d32f2f'],
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
        text: 'Pass vs Fail Distribution'
      }
    }
  };

  constructor(private dataService: DataService) {}

  ngOnDestroy() {
    if (this.simulationSubscription) {
      this.simulationSubscription.unsubscribe();
    }
  }

  startSimulation() {
    this.resetSimulation();
    this.isRunning = true;
    this.isCompleted = false;

    // Create interval that emits every second for 20 seconds
    this.simulationSubscription = interval(1000)
      .pipe(take(20))
      .subscribe({
        next: (index) => this.processSimulationStep(index),
        complete: () => this.completeSimulation()
      });
  }

  private processSimulationStep(index: number) {
    const row = this.dataService.generateSimulationRow(index + 1);
    this.simulationData.push(row);
    
    // Update stats
    this.updateStats();
    
    // Update charts
    this.updateCharts(row);
  }

  private updateStats() {
    this.stats.totalPredictions = this.simulationData.length;
    this.stats.passCount = this.simulationData.filter(row => row.prediction === 'Pass').length;
    this.stats.failCount = this.stats.totalPredictions - this.stats.passCount;
    
    const totalConfidence = this.simulationData.reduce((sum, row) => sum + row.confidence, 0);
    this.stats.avgConfidence = Math.round(totalConfidence / this.stats.totalPredictions);
  }

  private updateCharts(row: SimulationRow) {
    // Update Quality Score Chart
    const qualityScore = 70 + Math.random() * 30; // Random value between 70-100
    
    this.qualityChartData.labels?.push(row.time);
    this.qualityChartData.datasets[0].data.push(qualityScore);
    
    // Keep only last 10 points for better visibility
    if (this.qualityChartData.labels!.length > 10) {
      this.qualityChartData.labels?.shift();
      this.qualityChartData.datasets[0].data.shift();
    }
    
    // Update Pass/Fail Distribution Chart
    this.distributionChartData.datasets[0].data = [this.stats.passCount, this.stats.failCount];
    
    // Force chart updates
    this.qualityChartData = { ...this.qualityChartData };
    this.distributionChartData = { ...this.distributionChartData };
  }

  private completeSimulation() {
    this.isRunning = false;
    this.isCompleted = true;
    this.stepCompleted.emit();
  }

  restartSimulation() {
    this.startSimulation();
  }

  private resetSimulation() {
    this.simulationData = [];
    this.stats = {
      totalPredictions: 0,
      passCount: 0,
      failCount: 0,
      avgConfidence: 0
    };
    
    // Reset charts
    this.qualityChartData.labels = [];
    this.qualityChartData.datasets[0].data = [];
    this.distributionChartData.datasets[0].data = [0, 0];
  }

  onPrevious() {
    this.previousStep.emit();
  }
}

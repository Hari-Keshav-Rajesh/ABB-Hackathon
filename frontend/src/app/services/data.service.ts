import { Injectable } from '@angular/core';
import { SimulationRow } from '../components/simulation/simulation.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  generateSimulationRow(index: number): SimulationRow {
    const now = new Date();
    const time = new Date(now.getTime() + (index * 1000));
    
    // Generate random values
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
    const prediction = confidence > 85 ? 'Pass' : 'Fail';
    const temperature = Math.floor(Math.random() * 50) + 20; // 20-70°C
    const pressure = parseFloat((Math.random() * 5 + 1).toFixed(2)); // 1-6 bar
    const humidity = Math.floor(Math.random() * 40) + 30; // 30-70%

    return {
      time: time.toLocaleTimeString(),
      sampleId: `S-${String(index).padStart(4, '0')}`,
      prediction: prediction,
      confidence: confidence,
      temperature: temperature,
      pressure: pressure,
      humidity: humidity
    };
  }

  // Additional utility methods for generating static data
  getDatasetSummary() {
    return {
      fileName: 'bosch.csv',
      totalRecords: 14704,
      totalColumns: 5,
      passRate: 70,
      dateRange: '2021-01-01 to 2021-01-02'
    };
  }

  getTrainingMetrics() {
    return {
      accuracy: 92,
      precision: 90,
      recall: 88,
      f1: 89
    };
  }

  getConfusionMatrix() {
    return {
      tp: 1234,
      tn: 4567,
      fp: 123,
      fn: 98
    };
  }
}

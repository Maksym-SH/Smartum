import type { IServerDate } from ".";

export interface IChartColor {
  border: string;
  background: string;
}

export interface IChartVisit {
  visitCount: number;
  date: IServerDate | Date;
}

export interface IStatistics {
  visits: IChartVisit[];
  boardActivity: [number, number, number, number, number, number];
}

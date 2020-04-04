export interface Config {
  host: string;
  port: number;
  iceCast: IceCastConfig;
}

export interface IceCastConfig {
  host: string;
  port: number;
  mountPoint: string;
}
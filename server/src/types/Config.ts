export interface Config {
  server: string;
  iceCast: IceCastConfig;
}

export interface IceCastConfig {
  host: string;
  port: number;
  mountPoint: string;
}
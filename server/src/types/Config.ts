export interface Config {
  iceCast: IceCastConfig;
}

export interface IceCastConfig {
  host: string;
  port: number;
  mountPoint: string;
}
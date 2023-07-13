import type { Colors } from "../enums";

export interface IBackgroundPhotos {
  forest: string;
  lake: string;
  lakeWithForest: string;
  mountains: string;
  river: string;
}

export interface IBackgroundGradient {
  backgroundBlue: Colors.GRADIENT_BLUE;
  backgroundBluePink: Colors.GRADIENT_BLUE_PINK;
  backgrondGreen: Colors.GRADIENT_GREEN;
  backgroundLightBlue: Colors.GRADIENT_LIGHT_BLUE;
  backgrondGray: Colors.GRADIENT_GRAY;
  backgroundRedBlue: Colors.GRADIENT_RED_BLUE;
}

export interface IBackgroundDashboard {
  photos: IBackgroundPhotos;
  gradients: IBackgroundGradient;
}

export interface IColorPickerParams {
  textColor: Colors;
  target: string;
}

export interface ILightColors {
  pastelPink: string;
  pastelYellow: string;
  pastelCyan: string;
  pastelBlue: string;
  pastelGreen: string;
  pastelOrange: string;
  salmon: string;
  salmonCriola: string;
  yellowPink: string;
  yellowCrayola: string;
  lime: string;
  bluefrost: string;
  pearl: string;
  creamy: string;
  snowBlue: string;
  apple: string;
  banano: string;
  paleGold: string;
  gold: string;
  sky: string;
}

export interface IDarkColors {
  moray: string;
  pearlOpal: string;
  black: string;
  signalBlue: string;
  deepPurple: string;
  grayBlue: string;
  falunRed: string;
  willowBrown: string;
  deepGreen: string;
  three: string;
  turquoise: string;
  azureBlue: string;
  sandyTaupe: string;
  brown: string;
  copper: string;
  darkGrey: string;
  purple: string;
  redPurple: string;
  darkAzure: string;
  spruce: string;
}

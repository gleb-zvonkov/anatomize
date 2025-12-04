/**
 * Type definitions for react-native-confetti-cannon.
 * The library has no built-in TypeScript types, so this
 * module tells TS what props the component accepts.
 */

declare module "react-native-confetti-cannon" {
  import React from "react";
  import { ViewProps } from "react-native";

  export interface ConfettiCannonProps extends ViewProps {
    count?: number;
    origin?: { x: number; y: number };
    fadeOut?: boolean;
    explosionSpeed?: number;
    fallSpeed?: number;
    autoStart?: boolean;
  }

  export default class ConfettiCannon extends React.Component<ConfettiCannonProps> {}
}

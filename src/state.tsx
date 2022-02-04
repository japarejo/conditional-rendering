import { atom } from "recoil";

// UNUSED

export const feature1 = atom({
    key: 'can.read.feature1', //
    default: false
  });

  export const feature2 = atom({
    key: 'can.read.feature2', // unique ID (with respect to other atoms/selectors)
    default: true, // default value (aka initial value)
  });
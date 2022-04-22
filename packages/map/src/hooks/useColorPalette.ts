import { useReducer } from 'react';
import { colorPalettes } from '../data/color-palettes';

// create constants 
export const ON_SEQUENTIAL = 'ON_SEQUENTIAL';
export const ON_SEQUENTIAL_REVERSE = 'ON_SEQUENTIAL_REVERSE';
export const ON_NON_SEQUENTIAL = 'ON_NON_SEQUENTIAL';
export const ON_NON_SEQUENTIAL_REVERSE = 'ON_NON_SEQUENTIAL_REVERSE';

// create types & interfaces 
// type PalletTypes = typeof colorPalettes;
// type PalletType = keyof PalletTypes;
interface State {
    readonly filteredPallets:any[]
    readonly filteredQualitative:any[]
    readonly isSwitched: boolean;
    readonly isSwitched2: boolean;
   }
   interface Action {
    type:
      | 'ON_SEQUENTIAL_REVERSE'
      | 'ON_SEQUENTIAL'
      | 'ON_NON_SEQUENTIAL'
      | 'ON_NON_SEQUENTIAL_REVERSE';
    payload: typeof colorPalettes;
  }

// create initial state
const initialState = {
    filteredPallets: [],
    filteredQualitative: [],
    isSwitched: false,
    isSwitched2: false,
  };

// create reducer function to handle multiple states & manupilate with each state
function reducer (state,action){}
// create custon hook and export
export function useColorPalette(){
    // register reducer hook to handle multiple states at a time
  const [state, dispatch] = useReducer(reducer, initialState);

    return;
}
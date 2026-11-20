import { syntheticId } from '../fixtures/synthetic.js';
export function makeJob(): { id: string } { return { id: syntheticId('job') }; }

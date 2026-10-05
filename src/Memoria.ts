import { Proceso, EstadoProceso } from './Proceso';

export class BloqueMemoria {
    constructor(
        public inicio: number,
        public tamano: number,
        public libre: boolean = true,
        public proceso: Proceso | null = null
    ) {}
}
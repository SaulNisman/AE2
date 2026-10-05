export enum EstadoProceso {
    Nuevo,
    EsperandoMemoria,
    Listo,
    Ejecutando,
    Bloqueado,
    Terminado
}

export class Proceso {
    private _pid: number;
    private _memoriaRequerida: number;
    private _tiempoTotalCpu: number;
    private _cpuRestante: number;
    private _estado: EstadoProceso = EstadoProceso.Nuevo;
    private _quantumConsumido: number = 0;
    private _tiempoBloqueoRestante: number = 0;
    
    // RF08: Variables para Entrada/Salida
    private _ticksEjecutados: number = 0;
    private _eventoEsTick: number = -1;

    constructor(pid: number, memoriaRequerida: number, tiempoTotalCpu: number) {
        this._pid = pid;
        this._memoriaRequerida = memoriaRequerida;
        this._tiempoTotalCpu = tiempoTotalCpu;
        this._cpuRestante = tiempoTotalCpu;
    }

    get pid(): number { return this._pid; }
    get memoriaRequerida(): number { return this._memoriaRequerida; }
    get cpuRestante(): number { return this._cpuRestante; }
    get estado(): EstadoProceso { return this._estado; }
    get tiempoBloqueoRestante(): number { return this._tiempoBloqueoRestante; }

    setEstado(nuevoEstado: EstadoProceso): void {
        this._estado = nuevoEstado;
    }

    configurarES(tickDisparo: number, duracion: number): void {
        this._eventoEsTick = tickDisparo;
        this._tiempoBloqueoRestante = duracion;
    }

    ejecutarUnTick(): void {
        this._cpuRestante--;
        this._ticksEjecutados++;
        
        if (this._ticksEjecutados === this._eventoEsTick && this._cpuRestante > 0) {
            this.setEstado(EstadoProceso.Bloqueado);
        }
    }

    reducirBloqueo(): void {
        if (this._tiempoBloqueoRestante > 0) {
            this._tiempoBloqueoRestante--;
        }
    }
}

 
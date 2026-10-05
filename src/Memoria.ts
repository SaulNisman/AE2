import { Proceso, EstadoProceso } from './Proceso';

export class BloqueMemoria {
    constructor(
        public inicio: number,
        public tamano: number,
        public libre: boolean = true,
        public proceso: Proceso | null = null
    ) {}
}

export class Memoria {
    private _bloques: BloqueMemoria[];
    private _tamanoTotal: number;

    constructor(tamanoTotal: number) {
        if (tamanoTotal <= 0) throw new Error("Tamaño inválido. Debe ser mayor a 0.");
        this._tamanoTotal = tamanoTotal;
        this._bloques = [new BloqueMemoria(0, tamanoTotal)]; // Se inicia con un único bloque libre
    }

    get bloques(): BloqueMemoria[] { return [...this._bloques]; }
    get tamanoTotal(): number { return this._tamanoTotal; }

    asignarFirstFit(proceso: Proceso): boolean {
        const req = proceso.memoriaRequerida;
        for (let i = 0; i < this._bloques.length; i++) {
            const bloque = this._bloques[i];
            
            // Si el bloque está libre y es suficientemente grande
            if (bloque.libre && bloque.tamano >= req) {
                // Si el bloque es más grande que lo requerido, lo dividimos (RF04)
                if (bloque.tamano > req) {
                    const nuevoBloqueLibre = new BloqueMemoria(
                        bloque.inicio + req,
                        bloque.tamano - req
                    );
                    this._bloques.splice(i + 1, 0, nuevoBloqueLibre);
                }
                
                bloque.tamano = req;
                bloque.libre = false;
                bloque.proceso = proceso;
                proceso.setEstado(EstadoProceso.Listo);
                return true; // Asignación exitosa
            }
        }
        return false; // No hay espacio contiguo suficiente
    }

    liberar(proceso: Proceso): void {
        for (let i = 0; i < this._bloques.length; i++) {
            if (this._bloques[i].proceso === proceso) {
                this._bloques[i].libre = true;
                this._bloques[i].proceso = null;
                this._coalescencia();
                break;
            }
        }
    }

    private _coalescencia(): void {
        // Se recorren los bloques para fusionar los libres adyacentes (RF05)
        for (let i = 0; i < this._bloques.length - 1; i++) {
            const actual = this._bloques[i];
            const siguiente = this._bloques[i + 1];
            
            if (actual.libre && siguiente.libre) {
                actual.tamano += siguiente.tamano;
                this._bloques.splice(i + 1, 1); // Se elimina el bloque fusionado
                i--; // Se retrocede el índice para reevaluar el bloque actual con el nuevo vecino
            }
        }
    }
}

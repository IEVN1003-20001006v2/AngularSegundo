import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface Empleado {
  matricula: string;
  nombre: string;
  correo: string;
  edad: number;
  horasTrabajadas: number;
  horasPagar?: number; // Total a pagar por hasta 40 horas
  horasExtras?: number; // Total a pagar por horas extras
  subTotal?: number; // Total general
}

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export default class EmpleadoComponent implements OnInit {
  formGroup!: FormGroup;
  empleados: Empleado[] = [];
  matriculaParaModificar: string | null = null;
  mostrarTabla: boolean = false;
  mostrarBuscador: boolean = false;
  matriculaBusqueda: string = ''; // Para buscar empleado por matrícula

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      edad: ['', Validators.required],
      horasTrabajadas: ['', Validators.required],
    });

    // Cargar empleados guardados al iniciar el componente
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.empleados = JSON.parse(empleadosGuardados);
    }
  }

  registrarEmpleado(): void {
    const { matricula, nombre, correo, edad, horasTrabajadas } = this.formGroup.value;

    const nuevoEmpleado: Omit<Empleado, 'horasPagar' | 'horasExtras' | 'subTotal'> = {
      matricula,
      nombre,
      correo,
      edad: parseInt(edad),
      horasTrabajadas: parseInt(horasTrabajadas),
    };

    // Cargar empleados desde localStorage si es necesario
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.empleados = JSON.parse(empleadosGuardados);
    }

    if (this.matriculaParaModificar) {
      this.modificarEmpleado(nuevoEmpleado);
    } else {
      this.empleados.push(nuevoEmpleado);
    }

    localStorage.setItem('empleados', JSON.stringify(this.empleados));
    this.formGroup.reset();
    this.matriculaParaModificar = null;
    this.mostrarBuscador = false; // Ocultar el buscador después de modificar
  }

  modificarEmpleado(empleadoModificado: Empleado): void {
    const index = this.empleados.findIndex(e => e.matricula === this.matriculaParaModificar);
    if (index !== -1) {
      this.empleados[index] = empleadoModificado;
      localStorage.setItem('empleados', JSON.stringify(this.empleados));
      this.matriculaParaModificar = null;
    } else {
      alert('No se pudo modificar el empleado, matrícula no encontrada.');
    }
  }

  buscarParaModificar(): void {
    const empleado = this.empleados.find(e => e.matricula === this.matriculaBusqueda);
    if (empleado) {
      this.formGroup.setValue({
        matricula: empleado.matricula,
        nombre: empleado.nombre,
        correo: empleado.correo,
        edad: empleado.edad,
        horasTrabajadas: empleado.horasTrabajadas,
      });
      this.matriculaParaModificar = empleado.matricula;
      this.matriculaBusqueda = ''; // Limpiar campo de búsqueda
      this.mostrarBuscador = false; // Ocultar buscador
    } else {
      alert('Empleado no encontrado.');
    }
  }

  buscarYEliminar(): void {
    const index = this.empleados.findIndex(e => e.matricula === this.matriculaBusqueda);
    if (index !== -1) {
      this.empleados.splice(index, 1);
      localStorage.setItem('empleados', JSON.stringify(this.empleados));
      this.matriculaBusqueda = ''; // Limpiar campo de búsqueda
      alert('Empleado eliminado correctamente.');
    } else {
      alert('Empleado no encontrado.');
    }
  }

  imprimirTabla(): void {
    this.empleados = this.empleados.map(empleado => {
      const horasPagar = Math.min(empleado.horasTrabajadas, 40) * 70; // Cálculo en pesos
      const horasExtras = Math.max(empleado.horasTrabajadas - 40, 0) * 140; // Cálculo en pesos
      const subTotal = horasPagar + horasExtras;
      
      return {
        ...empleado,
        horasPagar, // Total a pagar por hasta 40 horas
        horasExtras, // Total a pagar por horas extras
        subTotal
      };
    });
    this.mostrarTabla = true;
  }

  calcularTotalSubtotales(): number {
    return this.empleados.reduce((total, empleado) => total + (empleado.subTotal || 0), 0);
  }

  activarBuscador(): void {
    this.mostrarBuscador = true;
  }
}

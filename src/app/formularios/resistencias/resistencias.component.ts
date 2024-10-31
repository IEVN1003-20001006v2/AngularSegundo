import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resistencias',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './resistencias.component.html',
  styleUrls: ['./resistencias.component.css']
})
export default class ResistenciasComponent {
  colors: string[] = ['Negro', 'Café', 'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Violeta', 'Gris', 'Blanco'];
  colorCodes: { [key: string]: string } = {
    'Negro': 'black',
    'Café': '#8B4513',
    'Rojo': 'red',
    'Naranja': 'orange',
    'Amarillo': 'yellow',
    'Verde': 'green',
    'Azul': 'blue',
    'Violeta': 'violet',
    'Gris': 'gray',
    'Blanco': 'white'
  };

  resistenciaForm: FormGroup;
  valor: number = 0;
  valorMaximo: number = 0;
  valorMinimo: number = 0;
  mostrarCalculos: boolean = false;
  registros: any[] = []; // Aquí almacenaremos todos los registros

  constructor(private fb: FormBuilder) {
    this.resistenciaForm = this.fb.group({
      color1: [''],
      color2: [''],
      color3: [''],
      tolerancia: ['']
    });
  }

  registrarEnLocalStorage() {
    const resistencia = {
      color1: this.resistenciaForm.value.color1,
      color2: this.resistenciaForm.value.color2,
      color3: this.resistenciaForm.value.color3,
      tolerancia: this.resistenciaForm.value.tolerancia,
      valor: this.valor,
      valorMaximo: this.valorMaximo,
      valorMinimo: this.valorMinimo
    };

    // Obtener registros anteriores
    const registrosGuardados = localStorage.getItem('registrosResistencias');
    const registros = registrosGuardados ? JSON.parse(registrosGuardados) : [];

    // Añadir nuevo registro
    registros.push(resistencia);

    // Guardar en localStorage
    localStorage.setItem('registrosResistencias', JSON.stringify(registros));

    // Vaciar el formulario
    this.resistenciaForm.reset();
  }

  cargarDesdeLocalStorage() {
    const registrosGuardados = localStorage.getItem('registrosResistencias');
    if (registrosGuardados) {
      this.registros = JSON.parse(registrosGuardados);
      this.mostrarCalculos = true;
    }
  }

  calcular() {
    const { color1, color2, color3, tolerancia } = this.resistenciaForm.value;
    const valorColor1 = this.colors.indexOf(color1);
    const valorColor2 = this.colors.indexOf(color2);
    const multiplicador = Math.pow(10, this.colors.indexOf(color3));

    this.valor = (valorColor1 * 10 + valorColor2) * multiplicador;
    const toleranceFactor = tolerancia === 'oro' ? 0.05 : 0.10;
    this.valorMaximo = this.valor * (1 + toleranceFactor);
    this.valorMinimo = this.valor * (1 - toleranceFactor);
  }

  getColorCode(color: string): string {
    return this.colorCodes[color] || 'transparent';
  }

  getToleranceColor(tolerancia: string): string {
    if (tolerancia === 'oro') {
      return 'gold';
    } else if (tolerancia === 'plata') {
      return 'silver';
    }
    return 'transparent';
  }
}


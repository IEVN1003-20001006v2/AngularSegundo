import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-zodiaco',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './zodiaco.component.html',
  styleUrl: './zodiaco.component.css'
})
export default class ZodiacoComponent {
  formulario: FormGroup;
  resultado: any = null;

  // Definimos los signos zodiacales chinos con su imagen y años correspondientes
  signosZodiacales = [
    { signo: 'Rata', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgvu0mENA3H71tXPab8EV_aAspHjp0aVJHWw&s', años: [1912, 1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020] },
    { signo: 'Buey', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKL9W3VXy7-nCEKVWtWoVX9EfPg1Z621FRMw&s', años: [1913, 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021] },
    { signo: 'Tigre', img: 'https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Tigre.jpg', años: [1914, 1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022] },
    { signo: 'Conejo', img: 'https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Conejo.jpg', años: [1915, 1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023] },
    { signo: 'Dragón', img: 'https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Dragon.jpg', años: [1916, 1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024] },
    { signo: 'Serpiente', img: 'https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Serpiente.jpg', años: [1917, 1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025] },
    { signo: 'Caballo', img: 'https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Caballo.jpg', años: [1918, 1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026] },
    { signo: 'Cabra', img: 'https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Cabra.jpg', años: [1919, 1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027] },
    { signo: 'Mono', img: 'https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Mono.jpg', años: [1920, 1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028] },
    { signo: 'Gallo', img: 'https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Gallo.jpg', años: [1921, 1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029] },
    { signo: 'Perro', img: 'https://www.confucioust.cl/web/wp-content/uploads/sites/3/2018/01/horoscopo-chino-perro-1-590x332.jpg', años: [1922, 1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030] },
    { signo: 'Cerdo', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpX9DHc5UyM66BSn92aGzCHDt3hNcbLqX7Tw&s', años: [1923, 1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031] }
  ];

  constructor(private fb: FormBuilder) {
    
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      dia: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
      mes: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      anio: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      sexo: ['', Validators.required]
    });
  }

  // Función que se ejecuta al enviar el formulario
  onSubmit() {
    if (this.formulario.valid) {
      const { nombre, apaterno, amaterno, dia, mes, anio, sexo } = this.formulario.value;
      const edad = this.calcularEdad(dia, mes, anio);
      const signoZodiacal = this.obtenerSignoZodiacal(anio);

      if (signoZodiacal) {
        this.resultado = {
          nombre,
          apaterno,
          amaterno,
          edad,
          signoZodiacal: signoZodiacal.signo,
          imgSigno: signoZodiacal.img
        };
      } else {
        // Manejar el caso donde el año no corresponde a ningún signo
        this.resultado = {
          nombre,
          apaterno,
          amaterno,
          edad,
          signoZodiacal: 'No encontrado',
          imgSigno: 'ruta_imagen_default' // Imagen por defecto si no se encuentra signo
        };
      }
    }
  }

  // Función para calcular la edad
  calcularEdad(dia: number, mes: number, anio: number): number {
    const fechaNacimiento = new Date(anio, mes - 1, dia);
    const edadDifMs = Date.now() - fechaNacimiento.getTime();
    const edadFecha = new Date(edadDifMs);
    return Math.abs(edadFecha.getUTCFullYear() - 1970);
  }

  // Función para obtener el signo zodiacal chino según el año de nacimiento
  obtenerSignoZodiacal(anio: number) {
    return this.signosZodiacales.find(signo => signo.años.includes(anio));
  }
}



import { Component } from "@angular/core";
import { Router, Routes } from "@angular/router";
export default[
  
    {
        path: 'ejemplo1',
        loadComponent:()=>import('./ejemplo1/ejemplo1.component'),


    },
    {
        path: 'zodiaco',
        loadComponent:()=>import('./zodiaco/zodiaco.component'),


    },
    {
        path: 'empleado',
        loadComponent:()=>import('./empleado/empleado.component'),


    },
    {
        path: 'resistencias',
        loadComponent:()=>import('./resistencias/resistencias.component'),


    },
 
    
   
]as Routes
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';

import { ReglaAcumulacionBandejaComponent } from './component-layer/reglas/acumulacion/bandeja/regla-acumulacion-bandeja.component';
import { ReglaValoradoBandejaComponent } from './component-layer/reglas/valorado/bandeja/regla-valorado-bandeja.component';
import { ReglaCanjeBandejaComponent } from './component-layer/reglas/canje/bandeja/regla-canje-bandeja.component';

import { MantenimientoParametroBandejaComponent } from './component-layer/mantenimiento/parametro/bandeja/mantenimiento-parametro-bandeja.component';
import { MantenimientoValoradoBandejaComponent } from './component-layer/mantenimiento/valorado/bandeja/mantenimiento-valorado-bandeja.component';
import { MantenimientoTipoClienteBandejaComponent } from './component-layer/mantenimiento/tipo-cliente/bandeja/mantenimiento-tipo-cliente-bandeja.component';
import { MantenimientoSucursalBandejaComponent } from './component-layer/mantenimiento/sucursal/bandeja/mantenimiento-sucursal-bandeja.component';
import { MantenimientoReglaVencimientoBandejaComponent } from './component-layer/mantenimiento/regla-vencimiento/bandeja/mantenimiento-regla-vencimiento-bandeja.component';
import { MantenimientoTipoVencimientoBandejaComponent } from './component-layer/mantenimiento/tipo-vencimiento/bandeja/mantenimiento-tipo-vencimiento-bandeja.component';
import { MantenimientoEmailProcesoBandejaComponent } from './component-layer/mantenimiento/email-proceso/bandeja/mantenimiento-email-proceso-bandeja.component';
import { ConsultaClienteBandejaComponent } from './component-layer/consulta/cliente/bandeja/consulta-cliente-bandeja.component';
import { MantenimientoReporteBandejaComponent } from './component-layer/mantenimiento/reporte/bandeja/mantenimiento-reporte-bandeja.component';
import { ReporteErrorProcesoBandejaComponent } from './component-layer/reporte/error-proceso/bandeja/reporte-error-proceso-bandeja.component';
import { ReporteAjusteBandejaComponent } from './component-layer/reporte/ajuste/bandeja/reporte-ajuste-bandeja.component';
import { ReporteAcumuladoAjusteBandejaComponent } from './component-layer/reporte/acumulado-ajuste/bandeja/reporte-acumulado-ajuste-bandeja.component';
import { ReporteDiarioAjusteBandejaComponent } from './component-layer/reporte/diario-ajuste/bandeja/reporte-diario-ajuste-bandeja.component';
import { ReporteCanjeEstablecimientoBandejaComponent } from './component-layer/reporte/canje-establecimiento/bandeja/reporte-canje-establecimiento-bandeja.component';
import { ReporteStockMensualBandejaComponent } from './component-layer/reporte/stock-mensual/bandeja/reporte-stock-mensual-bandeja.component';
import { ReporteCuadreDiarioBandejaComponent } from './component-layer/reporte/cuadre-diario/bandeja/reporte-cuadre-diario-bandeja.component';
import { MantenimientoStockFinalBandejaComponent } from './component-layer/mantenimiento/stock-final/bandeja/mantenimiento-stock-final-bandeja.component';
import { ReporteMovimientoMesBandejaComponent } from './component-layer/reporte/movimiento-mes/bandeja/reporte-movimiento-mes-bandeja.component';
import { CargaCampaniaBandejaComponent } from './component-layer/carga/campania/bandeja/carga-campania-bandeja.component';

const routes: Routes = [  
  { path: 'Reglas/Acumulacion/Bandeja', component: ReglaAcumulacionBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reglas/Canje/Bandeja', component: ReglaCanjeBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reglas/Valorado/Bandeja', component: ReglaValoradoBandejaComponent, canActivate: [AuthGuard] },

  { path: 'Mantenimiento/Parametro/Bandeja', component: MantenimientoParametroBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Mantenimiento/Reporte/Bandeja', component: MantenimientoReporteBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Mantenimiento/Valorado/Bandeja', component: MantenimientoValoradoBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Mantenimiento/Tipo-Cliente/Bandeja', component: MantenimientoTipoClienteBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Mantenimiento/Regla-Vencimiento/Bandeja', component: MantenimientoReglaVencimientoBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Mantenimiento/Tipo-Vencimiento/Bandeja', component: MantenimientoTipoVencimientoBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Mantenimiento/Sucursal/Bandeja', component: MantenimientoSucursalBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Mantenimiento/Email-Proceso/Bandeja', component: MantenimientoEmailProcesoBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Mantenimiento/Stock-Final/Bandeja', component: MantenimientoStockFinalBandejaComponent, canActivate: [AuthGuard] },

  { path: 'Reporte/Error-Proceso/Bandeja', component: ReporteErrorProcesoBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reporte/Ajuste/Bandeja', component: ReporteAjusteBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reporte/Acumulado-Ajuste/Bandeja', component: ReporteAcumuladoAjusteBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reporte/Diario-Ajuste/Bandeja', component: ReporteDiarioAjusteBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reporte/Canje-Establecimiento/Bandeja', component: ReporteCanjeEstablecimientoBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reporte/Stock-Mensual/Bandeja', component: ReporteStockMensualBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reporte/Cuadre-Diario/Bandeja', component: ReporteCuadreDiarioBandejaComponent, canActivate: [AuthGuard] },
  { path: 'Reporte/Movimiento-Mes/Bandeja', component: ReporteMovimientoMesBandejaComponent, canActivate: [AuthGuard] },
  
  { path: 'Emision/Certificado/Bandeja', component: ConsultaClienteBandejaComponent, data: { isCertificate:true }, canActivate: [AuthGuard] },
  { path: 'Consulta/Cliente/Bandeja', component: ConsultaClienteBandejaComponent, data: { isEdit:false }, canActivate: [AuthGuard] },
  { path: 'Actualizar/Cliente/Bandeja', component: ConsultaClienteBandejaComponent, data: { isEdit:true }, canActivate: [AuthGuard] },  
  { path: 'Carga/Campania/Bandeja', component: CargaCampaniaBandejaComponent, canActivate: [AuthGuard] }, 

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

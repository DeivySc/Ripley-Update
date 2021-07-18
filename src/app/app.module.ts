import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from "./material/material.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { MenuInicioComponent } from './menu-inicio/menu-inicio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { UserService } from './services/user.service';

import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { getTranslatePaginatorIntl } from './shared/language/table/translate-paginator';
import { SrpFileManager } from './shared/util/fileExport';
import { SrpEncryption } from './shared/util/srpEncyption';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ChangeClaveComponent } from './login/change-clave/change-clave.component';
import { EncryptObjects } from './shared/util/encryptObjects';

import { RecaptchaInterceptor } from '@common/interceptors/recaptcha.interceptor';
import { CloudFlareInterceptor } from '@common/interceptors/cloudflare.interceptor';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from '@environments/environment';

import { MantenimientoSucursalBandejaComponent } from './component-layer/mantenimiento/sucursal/bandeja/mantenimiento-sucursal-bandeja.component';
import { MantenimientoSucursalFormComponent } from './component-layer/mantenimiento/sucursal/form/mantenimiento-sucursal-form.component';
import { MantenimientoSucursalComercioComponent } from './component-layer/mantenimiento/sucursal/comercio/mantenimiento-sucursal-comercio.component';
import { MantenimientoSucursalUsuarioComponent } from './component-layer/mantenimiento/sucursal/usuario/mantenimiento-sucursal-usuario.component';
import { MantenimientoParametroBandejaComponent } from './component-layer/mantenimiento/parametro/bandeja/mantenimiento-parametro-bandeja.component';
import { MantenimientoParametroFormComponent } from './component-layer/mantenimiento/parametro/form/mantenimiento-parametro-form.component';
import { MantenimientoValoradoBandejaComponent } from './component-layer/mantenimiento/valorado/bandeja/mantenimiento-valorado-bandeja.component';
import { MantenimientoValoradoFormComponent } from './component-layer/mantenimiento/valorado/form/mantenimiento-valorado-form.component';
import { MantenimientoTipoClienteBandejaComponent } from './component-layer/mantenimiento/tipo-cliente/bandeja/mantenimiento-tipo-cliente-bandeja.component';
import { MantenimientoTipoClienteFormComponent } from './component-layer/mantenimiento/tipo-cliente/form/mantenimiento-tipo-cliente-form.component';
import { MantenimientoReporteBandejaComponent } from './component-layer/mantenimiento/reporte/bandeja/mantenimiento-reporte-bandeja.component';
import { MantenimientoReporteFormComponent } from './component-layer/mantenimiento/reporte/form/mantenimiento-reporte-form.component';

import { CargaCampaniaBandejaComponent } from './component-layer/carga/campania/bandeja/carga-campania-bandeja.component';
import { CargaCampaniaDetalleComponent } from './component-layer/carga/campania/detalle/carga-campania-detalle.component';

import { ReglaCanjeBandejaComponent } from './component-layer/reglas/canje/bandeja/regla-canje-bandeja.component';
import { ReglaCanjeFormComponent } from './component-layer/reglas/canje/form/regla-canje-form.component';
import { ReglaValoradoBandejaComponent } from './component-layer/reglas/valorado/bandeja/regla-valorado-bandeja.component';
import { ReglaValoradoFormComponent } from './component-layer/reglas/valorado/form/regla-valorado-form.component';
import { ReglaAcumulacionBandejaComponent } from './component-layer/reglas/acumulacion/bandeja/regla-acumulacion-bandeja.component';
import { ReglaAcumulacionFormComponent } from './component-layer/reglas/acumulacion/form/regla-acumulacion-form.component';
import { ReglaAcumulacionPlazoComponent } from './component-layer/reglas/acumulacion/plazo/regla-acumulacion-plazo.component';

import { DialogConfirmComponent } from './component-layer/utils/dialog-confirm/dialog-confirm.component';

import { ReglaCanjeService } from './service-layer/reglas/canje/regla-canje.service';
import { ReglaAcumulacionService } from './service-layer/reglas/acumulacion/regla-acumulacion.service';
import { ReglaValoradoService } from './service-layer/reglas/valorado/regla-valorado.service';
import { MantenimientoValoradoSucursalComponent } from './component-layer/mantenimiento/valorado/sucursal/mantenimiento-valorado-sucursal.component';
import { MantenimientoEmailProcesoBandejaComponent } from './component-layer/mantenimiento/email-proceso/bandeja/mantenimiento-email-proceso-bandeja.component';
import { MantenimientoEmailProcesoFormComponent } from './component-layer/mantenimiento/email-proceso/form/mantenimiento-email-proceso-form.component';
import { MantenimientoReglaVencimientoBandejaComponent } from './component-layer/mantenimiento/regla-vencimiento/bandeja/mantenimiento-regla-vencimiento-bandeja.component';
import { MantenimientoReglaVencimientoFormComponent } from './component-layer/mantenimiento/regla-vencimiento/form/mantenimiento-regla-vencimiento-form.component';
import { MantenimientoTipoVencimientoBandejaComponent } from './component-layer/mantenimiento/tipo-vencimiento/bandeja/mantenimiento-tipo-vencimiento-bandeja.component';
import { MantenimientoTipoVencimientoFormComponent } from './component-layer/mantenimiento/tipo-vencimiento/form/mantenimiento-tipo-vencimiento-form.component';
import { ConsultaClienteBandejaComponent } from './component-layer/consulta/cliente/bandeja/consulta-cliente-bandeja.component';
import { ConsultaClienteResumeComponent } from './component-layer/consulta/cliente/resume/consulta-cliente-resume.component';
import { ConsultaClienteCanjeComponent } from './component-layer/consulta/cliente/canje/consulta-cliente-canje.component';
import { ConsultaClienteHistoricoComponent } from './component-layer/consulta/cliente/historico/consulta-cliente-historico.component';
import { ConsultaClienteUltimoComponent } from './component-layer/consulta/cliente/ultimo/consulta-cliente-ultimo.component';
import { ConsultaClienteActualizarComponent } from './component-layer/consulta/cliente/actualizar/consulta-cliente-actualizar.component';
import { ReporteErrorProcesoBandejaComponent } from './component-layer/reporte/error-proceso/bandeja/reporte-error-proceso-bandeja.component';
import { ReporteAjusteBandejaComponent } from './component-layer/reporte/ajuste/bandeja/reporte-ajuste-bandeja.component';
import { ReporteAcumuladoAjusteBandejaComponent } from './component-layer/reporte/acumulado-ajuste/bandeja/reporte-acumulado-ajuste-bandeja.component';
import { ReporteDiarioAjusteBandejaComponent } from './component-layer/reporte/diario-ajuste/bandeja/reporte-diario-ajuste-bandeja.component';
import { ReporteCanjeEstablecimientoBandejaComponent } from './component-layer/reporte/canje-establecimiento/bandeja/reporte-canje-establecimiento-bandeja.component';
import { ReporteStockMensualBandejaComponent } from './component-layer/reporte/stock-mensual/bandeja/reporte-stock-mensual-bandeja.component';
import { ReporteMovimientoMesBandejaComponent } from './component-layer/reporte/movimiento-mes/bandeja/reporte-movimiento-mes-bandeja.component';
import { EmisionCertificadoBandejaComponent } from './component-layer/emision-certificado/bandeja/emision-certificado-bandeja.component';

import { ReporteCuadreDiarioBandejaComponent } from './component-layer/reporte/cuadre-diario/bandeja/reporte-cuadre-diario-bandeja.component';
import { MantenimientoReporteColumnaComponent } from './component-layer/mantenimiento/reporte/columna/mantenimiento-reporte-columna.component';
import { MantenimientoReporteDetalleComponent } from './component-layer/mantenimiento/reporte/detalle/mantenimiento-reporte-detalle.component';
import { MantenimientoStockFinalBandejaComponent } from './component-layer/mantenimiento/stock-final/bandeja/mantenimiento-stock-final-bandeja.component';
import { EmisionCertificadoVistaPreviaComponent } from './component-layer/emision-certificado/vista-previa/emision-certificado-vista-previa.component';
import { ModalErrorVistaPreviaComponent } from './component-layer/emision-certificado/modal-error/modal-error-vista-previa.component';


@NgModule({
  declarations: [
    AppComponent,

    ReglaAcumulacionBandejaComponent,
    ReglaAcumulacionFormComponent,
    ReglaAcumulacionPlazoComponent,
    ReglaCanjeBandejaComponent,
    ReglaCanjeFormComponent,
    ReglaValoradoBandejaComponent,
    ReglaValoradoFormComponent,
    MantenimientoSucursalBandejaComponent,
    MantenimientoSucursalFormComponent,
    MantenimientoSucursalComercioComponent,
    MantenimientoSucursalUsuarioComponent,
    MantenimientoParametroBandejaComponent,
    MantenimientoParametroFormComponent,
    MantenimientoValoradoBandejaComponent,
    MantenimientoValoradoFormComponent,
    MantenimientoValoradoSucursalComponent,
    MantenimientoTipoClienteBandejaComponent,
    MantenimientoTipoClienteFormComponent,
    MantenimientoEmailProcesoBandejaComponent,
    MantenimientoEmailProcesoFormComponent,
    MantenimientoReglaVencimientoBandejaComponent,
    MantenimientoReglaVencimientoFormComponent,
    MantenimientoTipoVencimientoBandejaComponent,
    MantenimientoTipoVencimientoFormComponent,
    MantenimientoStockFinalBandejaComponent,
    MantenimientoReporteBandejaComponent,
    MantenimientoReporteFormComponent,
    MantenimientoReporteColumnaComponent,
    MantenimientoReporteDetalleComponent,
    ConsultaClienteBandejaComponent,
    ConsultaClienteResumeComponent,
    ConsultaClienteCanjeComponent,
    ConsultaClienteHistoricoComponent,
    ConsultaClienteUltimoComponent,
    ConsultaClienteActualizarComponent,
    ReporteErrorProcesoBandejaComponent,
    ReporteAjusteBandejaComponent,
    ReporteAcumuladoAjusteBandejaComponent,
    ReporteDiarioAjusteBandejaComponent,
    ReporteCanjeEstablecimientoBandejaComponent,
    ReporteStockMensualBandejaComponent,
    ReporteCuadreDiarioBandejaComponent,
    ReporteMovimientoMesBandejaComponent,
    EmisionCertificadoBandejaComponent,
    EmisionCertificadoVistaPreviaComponent,
    ModalErrorVistaPreviaComponent,
    CargaCampaniaBandejaComponent,
    CargaCampaniaDetalleComponent,

    DialogConfirmComponent,
    
    LoginComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    MenuInicioComponent,
    PerfilComponent,
    RegistrarseComponent,
    
    HomeComponent,
    ChangeClaveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    RecaptchaV3Module
  ],

  exports: [RouterModule],

  providers: [
    ReglaCanjeService,
    ReglaAcumulacionService,
    ReglaValoradoService,
    
    DatePipe,
    authInterceptorProviders,
    UserService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MatPaginatorIntl, useValue: getTranslatePaginatorIntl() },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    
    SrpFileManager,
    SrpEncryption,
    EncryptObjects,
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.RECAPTCHA_SITE_KEY },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RecaptchaInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CloudFlareInterceptor,
      multi: true
    },
  ],

  bootstrap: [AppComponent],

  entryComponents: [
    LoginComponent,
    MenuInicioComponent,
    PerfilComponent,
    RegistrarseComponent,
    BoardUserComponent,
    BoardModeratorComponent,
    BoardAdminComponent
  ]
})

export class AppModule { }

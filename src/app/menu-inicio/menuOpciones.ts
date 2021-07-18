export const menuOpciones = [
  {
    label: 'Módulo 1',
    icon: '',
    items: [
      {
        label: 'Acumulación',
        icon: '',
        routerLink: ['/Reglas/Acumulacion/Bandeja'],
        rol: ['1']
      },
      {
        label: 'Canjes',
        icon: '',
        routerLink: ['/Reglas/Canje/Bandeja'],
        rol: ['2']
      },
      {
        label: 'Establecimientos',
        icon: '',
        routerLink: ['/Reglas/Establecimiento/Bandeja'],
        rol: ['3']
      },
    ]
  },
  {
    label: 'Módulo 2',
    icon: '',
    items: [
      {
        label: 'Actualización',
        icon: '',
        routerLink: ['/BuscarPuntosCuentas'],
        rol: ['4']
      },
      {
        label: 'Cargar Campañas',
        icon: '',
        routerLink: ['/PrecargaCampaña'],
        rol: ['5']
      },
      // {
      //   label: 'Establecimientos',
      //   icon: '',
      //   routerLink: ['/reglasEstablecimientosLista'],
      //   rol: ['6']
      // },
    ]
  },
  // {
  //   label: 'RECEPCIÓN',
  //   icon: 'fa fa-archive',
  //   routerLink: ['/recepciones'],
  //   rol: ['ROLE_RECEPTION']
  // },
  // {
  //   label: 'CONTROL DE CALIDAD',
  //   icon: 'fa fa-handshake-o',
  //   routerLink: ['/control-calidades'],
  //   rol: ['ROLE_QUALITY_CONTROL']
  // },
  // {
  //   label: 'REPROCESO',
  //   icon: 'fa fa-refresh',
  //   routerLink: ['/reprocesos'],
  //   rol: ['ROLE_REPROCESS']
  // },
  // {
  //   label: 'FEDATARIO',
  //   icon: 'fa fa-gavel',
  //   routerLink: ['/fedatarios'],
  //   rol: ['ROLE_REPROCESS']
  // },
];

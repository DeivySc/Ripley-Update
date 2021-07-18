import { MaterialModule } from './material.module';

describe('MaterialModule', () => {
  let materialModule: MaterialModule;

  beforeEach(() => {
    materialModule = new MaterialModule();
  });

  it('debería crear una instancia', () => {
    expect(materialModule).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CabeceraService } from './cabecera.service';

describe('CabeceraService', () => {
  let service: CabeceraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CabeceraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

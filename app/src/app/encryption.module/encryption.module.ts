import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncryptionService } from './services/encryption.service';
import { EncryptionDomainFactory } from './services/encryption-domain/encryption-domain.factory';
import { KeyContainerService } from './services/key-container/key-container.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [EncryptionDomainFactory, EncryptionService, KeyContainerService],
})
export class EncryptionModule {}

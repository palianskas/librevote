import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncryptionDomainFactory } from './encryption-domain/encryption-domain.factory';
import { EncryptionService } from './services/encryption.service';
import { KeyContainerService } from './key-container/key-container.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [EncryptionDomainFactory, EncryptionService, KeyContainerService],
})
export class EncryptionModule {}

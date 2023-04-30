import { Component, Input } from '@angular/core';

enum KeyStorageOption {
  DoNotStore,
  LocalEncrypted,
  LocalPlaintext,
}

@Component({
  selector: 'app-campaign-encryption-keys-modal',
  templateUrl: './campaign-encryption-keys-modal.component.html',
})
export class CampaignEncryptionKeysModalComponent {
  @Input() onConfirm: (
    storageOption: KeyStorageOption,
    password?: string
  ) => void;
  @Input() onCancel: () => void;

  selectedKeyStorageOption: KeyStorageOption = KeyStorageOption.DoNotStore;
  password?: string;

  keyStorageOptions = [
    { key: KeyStorageOption.DoNotStore, value: 'Do not store' },
    {
      key: KeyStorageOption.LocalEncrypted,
      value: 'Store encrypted locally ',
    },
    {
      key: KeyStorageOption.LocalPlaintext,
      value: 'Store plaintext locally ',
    },
  ];

  confirm(): void {
    this.onConfirm(this.selectedKeyStorageOption, this.password);
  }

  cancel(): void {
    this.selectedKeyStorageOption = KeyStorageOption.DoNotStore;
    this.password = null;

    this.onCancel();
  }

  openModal(): void {
    const button = document.getElementById('key-store-modal-open-button');
    button.click();
  }

  get isPasswordMissing(): boolean {
    return (
      this.selectedKeyStorageOption === KeyStorageOption.LocalEncrypted &&
      !this.password
    );
  }
}
